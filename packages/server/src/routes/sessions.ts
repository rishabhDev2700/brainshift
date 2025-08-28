import { Hono } from "hono";
import type { HonoVariables } from "../types/hono";
import { db } from "../db/db";
import { SessionsTable } from "../db/schemas/sessions";
import { and, desc, DrizzleError, eq, inArray } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import { StreaksTable } from "../db/schemas/streaks";
import { isSameDay, isYesterday, subDays } from "date-fns";

const app = new Hono<{ Variables: HonoVariables }>();
const SessionSchema = z.object({
  id: z.int().optional(),
  targetType: z.enum(["task", "subtask"]),
  targetId: z.int().optional(),
  startTime: z.string(),
  endTime: z.string().optional(),
  duration: z.int().optional(),
  breakDuration: z.int().optional(), 
  isPomodoro: z.boolean(),
  completed: z.boolean().default(false),
});

const SessionCompleteSchema = z.object({
  completed: z.boolean(),
});

app
  .get("/", async (c) => {
    try {
      const userId = c.get("user").id;
      const sessions = await db
        .select()
        .from(SessionsTable)
        .where(eq(SessionsTable.userId, userId))
        .orderBy(desc(SessionsTable.startTime));

      return c.json(sessions);
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  })
  .get("/:id", async (c) => {
    try {
      const { id } = c.req.param();
      const [session] = await db
        .select()
        .from(SessionsTable)
        .where(
          and(
            eq(SessionsTable.id, Number(id)),
            eq(SessionsTable.userId, c.get("user").id)
          )
        );
      return c.json(session);
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      return c.json(error);
    }
  })
  .delete("/:id", async (c) => {
    try {
      const { id } = c.req.param();
      const [deletedsession] = await db
        .delete(SessionsTable)
        .where(
          and(
            eq(SessionsTable.id, Number(id)),
            eq(SessionsTable.userId, c.get("user").id)
          )
        )
        .returning();
      if (deletedsession) {
        return c.json({ message: "Session deleted Successfully" });
      }
      return c.json({ message: "Session not Found" }, 404);
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      return c.json(error);
    }
  })
  .post("/", zValidator("json", SessionSchema), async (c) => {
    try {
      const userId = c.get("user").id;
      const existingActiveSession = await db
        .select()
        .from(SessionsTable)
        .where(
          and(
            eq(SessionsTable.userId, userId),
            eq(SessionsTable.completed, false),
            eq(SessionsTable.isCancelled, false)
          )
        );

      if (existingActiveSession.length > 0) {
        return c.json(
          { message: "An active session is already in progress." },
          409
        );
      }

      const validated = c.req.valid("json");
      console.log("Validated data:", validated);
      let values: any = {
        ...validated,
        startTime: new Date(validated.startTime),
        userId: userId,
        breakDuration: validated.breakDuration === undefined ? null : validated.breakDuration,
      };
      console.log(values);
      if (validated.isPomodoro) {
        const startTime = new Date(validated.startTime).getTime();
        const durationInMs = (validated.duration || 0) * 60 * 1000;
        values.endTime = new Date(startTime + durationInMs);
      } else if (validated.endTime) {
        values.endTime = new Date(validated.endTime);
      }

      const [session] = await db
        .insert(SessionsTable)
        .values(values)
        .returning();

      if (!session) {
        return c.json({ message: "Something went wrong" }, 404);
      } else {
        return c.json(session);
      }
    } catch (err) {
      const error = err as DrizzleError;
      console.log(err);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  })
  .patch("/:id/cancel", async (c) => {
    const id = parseInt(c.req.param("id"));
    const [session] = await db
      .update(SessionsTable)
      .set({ isCancelled: true })
      .where(
        and(
          eq(SessionsTable.id, id),
          eq(SessionsTable.userId, c.get("user").id)
        )
      )
      .returning();
    if (!session) {
      return c.json({ message: "Invalid Session ID" }, 404);
    }
    return c.json({ session });
  })
  .patch(
    "/:id/completed",
    zValidator("json", SessionCompleteSchema),
    async (c) => {
      const id = parseInt(c.req.param("id"));
      const validated = c.req.valid("json");
      const userId = c.get("user").id;

      const [existingSession] = await db
        .select()
        .from(SessionsTable)
        .where(and(eq(SessionsTable.id, id), eq(SessionsTable.userId, userId)));

      if (!existingSession) {
        return c.json({ message: "Invalid Session ID" }, 404);
      }

      let values: any = {
        completed: validated.completed,
        breakDuration: existingSession.breakDuration,
      };

      const sessionStartTime = new Date(existingSession.startTime);
      let sessionEndTime = existingSession.endTime
        ? new Date(existingSession.endTime)
        : new Date();

      if (existingSession.isPomodoro && existingSession.duration) {
        const plannedEndTime = new Date(
          sessionStartTime.getTime() + existingSession.duration * 60 * 1000
        );
        sessionEndTime =
          sessionEndTime > plannedEndTime ? sessionEndTime : plannedEndTime;
      }

      const durationInMinutes = Math.floor(
        (sessionEndTime.getTime() - sessionStartTime.getTime()) / (1000 * 60)
      );

      values.endTime = sessionEndTime;
      values.duration = durationInMinutes;

      const [session] = await db
        .update(SessionsTable)
        .set(values)
        .where(and(eq(SessionsTable.id, id), eq(SessionsTable.userId, userId)))
        .returning();

      if (!session) {
        return c.json({ message: "Invalid Session ID" }, 404);
      }

      // Streak logic
      if (session.completed && session.duration && session.duration >= 30) {
        const [streak] = await db
          .select()
          .from(StreaksTable)
          .where(eq(StreaksTable.userId, userId));

        const today = new Date();

        if (streak) {
          const lastStreakDate = new Date(streak.lastStreakDate as any);
          console.log("lastStreakDate:", lastStreakDate);
          console.log("today:", today);
          if (isYesterday(lastStreakDate)) {
            const newCurrentStreak = (streak.currentStreak || 0) + 1;
            await db
              .update(StreaksTable)
              .set({
                currentStreak: newCurrentStreak,
                longestStreak: Math.max(
                  newCurrentStreak,
                  streak.longestStreak || 0
                ),
                lastStreakDate: today,
              })
              .where(eq(StreaksTable.userId, userId));
          } else if (!isSameDay(lastStreakDate, today)) {
            await db
              .update(StreaksTable)
              .set({ currentStreak: 1, lastStreakDate: today, longestStreak: Math.max(1, streak.longestStreak || 0) })
              .where(eq(StreaksTable.userId, userId));
          }
        } else {
          await db.insert(StreaksTable).values({
            userId: userId,
            currentStreak: 1,
            longestStreak: 1,
            lastStreakDate: today,
          });
        }
      } else if (!session.completed) {
        const [streak] = await db
          .select()
          .from(StreaksTable)
          .where(eq(StreaksTable.userId, userId));

        if (streak) {
          const lastStreakDate = new Date(streak.lastStreakDate as any);
          const today = new Date();
          if (!isSameDay(lastStreakDate, today) && !isYesterday(lastStreakDate)) {
            await db
              .update(StreaksTable)
              .set({ currentStreak: 0 })
              .where(eq(StreaksTable.userId, userId));
          }
        }

        return c.json({ session });
      }
    });

export default app;
