import { Hono } from "hono";
import type { HonoVariables } from "../types/hono";
import { db } from "../db/db";
import { SessionsTable } from "../db/schemas/sessions";
import { and, DrizzleError, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";

const app = new Hono<{ Variables: HonoVariables }>();
const SessionSchema = z.object({
  id: z.int().optional(),
  targetType: z.enum(["task", "subtask"]),
  targetId: z.int(),
  startTime: z.string(),
  endTime: z.string().optional(),
  duration: z.int().min(5),
  isPomodoro: z.boolean(),
  userId: z.int(),
});

const SessionCompleteSchema = z.object({
  completed: z.boolean(),
});

app
  .get("/", async (c) => {
    try {
      const sessions = await db
        .select()
        .from(SessionsTable)
        .where(eq(SessionsTable.userId, c.get("user").id));
      return c.json(sessions);
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
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
      const validated = c.req.valid("json");
      let values: any = {
        ...validated,
        startTime: new Date(validated.startTime),
        userId: c.get("user").id,
      };
      if (validated.endTime) {
        values = {
          ...values,
          endTime: new Date(validated.endTime),
        };
      }
      const [session] = await db
        .insert(SessionsTable)
        .values(values)
        .returning();
      if (!session) {
        return c.json({ message: "Something went wrong" }, 404);
      } else {
        return c.json({ message: "Session added successfully" });
      }
    } catch (err) {
      const error = err as DrizzleError;
      console.log(err);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  })
  .put("/:id", zValidator("json", SessionSchema), async (c) => {
    try {
      const validated = c.req.valid("json");
      const { id } = c.req.param();
      let values: any = {
        ...validated,
        startTime: new Date(validated.startTime),
        userId: c.get("user").id,
      };
      if (validated.endTime) {
        values = {
          ...values,
          endTime: new Date(validated.endTime),
        };
      }
      const [session] = await db
        .update(SessionsTable)
        .set(values)
        .where(
          and(
            eq(SessionsTable.userId, c.get("user").id),
            eq(SessionsTable.id, Number(id))
          )
        )
        .returning();
      if (!session) {
        return c.json({ message: "Session not found" }, 404);
      } else {
        return c.json({ message: "session Updated Successfully" });
      }
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
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
      const [session] = await db
        .update(SessionsTable)
        .set({ completed: validated.completed })
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
    }
  );

export default app;
