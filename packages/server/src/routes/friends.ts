import { Hono } from "hono";
import type { HonoVariables } from "../types/hono";
import { db } from "../db/db";
import {
  and,
  DrizzleError,
  eq,
  or,
  ilike,
  count,
  sum,
  inArray,
  desc,
  sql,
  ne,
} from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import { FriendshipsTable } from "../db/schemas/friends";
import { UserTable } from "../db/schemas/users";
import { GoalTable } from "../db/schemas/goals";
import { TaskTable } from "../db/schemas/tasks";
import { SessionsTable } from "../db/schemas/sessions";
import { sendInviteEmail } from "../services/email";

const app = new Hono<{ Variables: HonoVariables }>();

const FriendRequestSchema = z
  .object({
    friendId: z.number().optional(),
    friendEmail: z.string().email().optional(),
  })
  .refine((data) => data.friendId || data.friendEmail, {
    message: "Either friendId or friendEmail must be provided",
  });

const SearchQuerySchema = z.object({
  query: z.string().min(1),
});

app
  .get("/search", zValidator("query", SearchQuerySchema), async (c) => {
    try {
      const user = c.get("user");
      const { query } = c.req.valid("query");

      const users = await db
        .select()
        .from(UserTable)
        .where(
          and(
            or(
              ilike(UserTable.email, `%${query}%`),
              ilike(UserTable.fullName, `%${query}%`)
            ),
            ne(UserTable.id, user.id)
          )
        );

      return c.json(users);
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  })
  .get("/leaderboard", async (c) => {
    try {
      const user = c.get("user");

      const friends = await db
        .select({
          friendId: sql<number>`CASE WHEN ${FriendshipsTable.userId} = ${user.id} THEN ${FriendshipsTable.friendId} ELSE ${FriendshipsTable.userId} END`,
        })
        .from(FriendshipsTable)
        .where(
          and(
            eq(FriendshipsTable.status, "accepted"),
            or(
              eq(FriendshipsTable.userId, user.id),
              eq(FriendshipsTable.friendId, user.id)
            )
          )
        );

      const friendIds = friends.map((f) => f.friendId);

      const completedGoalsSubquery = db
        .select({
          userId: GoalTable.userId,
          count: count(GoalTable.id).as("goals_count"),
        })
        .from(GoalTable)
        .where(eq(GoalTable.status, "COMPLETED"))
        .groupBy(GoalTable.userId)
        .as("completed_goals");

      const completedTasksSubquery = db
        .select({
          userId: TaskTable.userId,
          count: count(TaskTable.id).as("tasks_count"),
        })
        .from(TaskTable)
        .where(eq(TaskTable.status, "COMPLETED"))
        .groupBy(TaskTable.userId)
        .as("completed_tasks");

      const totalTimeSpentSubquery = db
        .select({
          userId: SessionsTable.userId,
          sum: sum(SessionsTable.duration).as("time_sum"),
        })
        .from(SessionsTable)
        .groupBy(SessionsTable.userId)
        .as("total_time_spent");

      const leaderboard = await db
        .select({
          userId: UserTable.id,
          fullName: UserTable.fullName,
          goalsCompleted: completedGoalsSubquery.count,
          tasksCompleted: completedTasksSubquery.count,
          timeSpent: totalTimeSpentSubquery.sum,
        })
        .from(UserTable)
        .where(inArray(UserTable.id, [...friendIds, user.id]))
        .leftJoin(
          completedGoalsSubquery,
          eq(UserTable.id, completedGoalsSubquery.userId)
        )
        .leftJoin(
          completedTasksSubquery,
          eq(UserTable.id, completedTasksSubquery.userId)
        )
        .leftJoin(
          totalTimeSpentSubquery,
          eq(UserTable.id, totalTimeSpentSubquery.userId)
        )
        .orderBy(desc(totalTimeSpentSubquery.sum));

      return c.json(leaderboard);
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  })
  .get("/", async (c) => {
    const user = c.get("user");

    const friendships = await db
      .select({
        id: FriendshipsTable.id,
        status: FriendshipsTable.status,
        friend: {
          id: UserTable.id,
          fullName: UserTable.fullName,
          email: UserTable.email,
        },
      })
      .from(FriendshipsTable)
      .where(
        and(
          eq(FriendshipsTable.status, "accepted"),
          or(
            eq(FriendshipsTable.userId, user.id),
            eq(FriendshipsTable.friendId, user.id)
          )
        )
      )
      .leftJoin(
        UserTable,
        sql`CASE WHEN ${FriendshipsTable.userId} = ${user.id} THEN ${FriendshipsTable.friendId} ELSE ${FriendshipsTable.userId} END = ${UserTable.id}`
      );

    return c.json(friendships);
  })
  .get("/pending", async (c) => {
    const user = c.get("user");
    const pendingRequests = await db
      .select({
        id: FriendshipsTable.id,
        status: FriendshipsTable.status,
        user: {
          id: UserTable.id,
          fullName: UserTable.fullName,
          email: UserTable.email,
        },
      })
      .from(FriendshipsTable)
      .where(
        and(
          eq(FriendshipsTable.friendId, user.id),
          eq(FriendshipsTable.status, "pending")
        )
      )
      .leftJoin(UserTable, eq(FriendshipsTable.userId, UserTable.id));
    return c.json(pendingRequests);
  })
  .post("/request", zValidator("json", FriendRequestSchema), async (c) => {
    try {
      const user = c.get("user");
      const validatedData = c.req.valid("json");
      const { friendId, friendEmail } = validatedData;

      if (!friendId && !friendEmail) {
        return c.json(
          { message: "Either friendId or friendEmail must be provided" },
          400
        );
      }

      let friend: any;

      if (friendId) {
        [friend] = await db
          .select()
          .from(UserTable)
          .where(eq(UserTable.id, friendId));
      } else if (friendEmail) {
        [friend] = await db
          .select()
          .from(UserTable)
          .where(eq(UserTable.email, friendEmail));
      }

      if (friend) {
        if (user.id === friend.id) {
          return c.json(
            { message: "You cannot be friends with yourself" },
            400
          );
        }

        const existingFriendship = await db
          .select()
          .from(FriendshipsTable)
          .where(
            or(
              and(
                eq(FriendshipsTable.userId, user.id),
                eq(FriendshipsTable.friendId, friend.id)
              ),
              and(
                eq(FriendshipsTable.userId, friend.id),
                eq(FriendshipsTable.friendId, user.id)
              )
            )
          );

        if (existingFriendship.length > 0) {
          return c.json({ message: "Friendship already exists" }, 409);
        }

        const [friendship] = await db
          .insert(FriendshipsTable)
          .values({
            userId: user.id,
            friendId: friend.id,
            status: "pending",
          })
          .returning();

        return c.json(friendship);
      } else {
        await sendInviteEmail(friendEmail || "", user.fullName || "");
        return c.json({ message: "Invite sent to new user" });
      }
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  })
  .put("/accept/:friendshipId", async (c) => {
    try {
      const user = c.get("user");
      const { friendshipId } = c.req.param();

      const [updatedFriendship] = await db
        .update(FriendshipsTable)
        .set({ status: "accepted" })
        .where(
          and(
            eq(FriendshipsTable.id, Number(friendshipId)),
            eq(FriendshipsTable.friendId, user.id)
          )
        )
        .returning();

      if (!updatedFriendship) {
        return c.json({ message: "Friend request not found" }, 404);
      }

      return c.json(updatedFriendship);
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  })
  .delete("/reject/:friendshipId", async (c) => {
    try {
      const user = c.get("user");
      const { friendshipId } = c.req.param();

      const [deletedFriendship] = await db
        .delete(FriendshipsTable)
        .where(
          and(
            eq(FriendshipsTable.id, Number(friendshipId)),
            or(
              eq(FriendshipsTable.userId, user.id),
              eq(FriendshipsTable.friendId, user.id)
            )
          )
        )
        .returning();

      if (!deletedFriendship) {
        return c.json({ message: "Friend request not found" }, 404);
      }

      return c.json({ message: "Friend request rejected" });
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  });

export default app;
