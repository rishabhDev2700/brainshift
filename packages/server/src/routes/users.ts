import { Hono } from "hono";
import type { HonoVariables } from "../types/hono";
import { db } from "../db/db";
import { UserTable } from "../db/schemas/users";
import { eq, count, sum } from "drizzle-orm";
import { GoalTable } from "../db/schemas/goals";
import { TaskTable } from "../db/schemas/tasks";
import { SessionsTable } from "../db/schemas/sessions";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";

const app = new Hono<{ Variables: HonoVariables }>();

const UserSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
});

app
  .get("/me", async (c) => {
    try {
      const userId = c.get("user").id;

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

      const [user] = await db
        .select({
          id: UserTable.id,
          fullName: UserTable.fullName,
          email: UserTable.email,
          goalsCompleted: completedGoalsSubquery.count,
          tasksCompleted: completedTasksSubquery.count,
          timeSpent: totalTimeSpentSubquery.sum,
        })
        .from(UserTable)
        .where(eq(UserTable.id, userId))
        .leftJoin(completedGoalsSubquery, eq(UserTable.id, completedGoalsSubquery.userId))
        .leftJoin(completedTasksSubquery, eq(UserTable.id, completedTasksSubquery.userId))
        .leftJoin(totalTimeSpentSubquery, eq(UserTable.id, totalTimeSpentSubquery.userId));

      if (!user) {
        return c.json({ message: "User not found" }, 404);
      }

      return c.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return c.json({ message: "Internal Server Error" }, 500);
    }
  })
  .put("/me", zValidator("json", UserSchema), async (c) => {
    try {
      const userId = c.get("user").id;
      const validated = c.req.valid("json");

      const [updatedUser] = await db
        .update(UserTable)
        .set(validated)
        .where(eq(UserTable.id, userId))
        .returning();

      if (!updatedUser) {
        return c.json({ message: "User not found" }, 404);
      }

      return c.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return c.json({ message: "Internal Server Error" }, 500);
    }
  });

app.get("/:id", async (c) => {
  try {
    const requestedUserId = Number(c.req.param("id"));

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

    const [user] = await db
      .select({
        id: UserTable.id,
        fullName: UserTable.fullName,
        email: UserTable.email,
        goalsCompleted: completedGoalsSubquery.count,
        tasksCompleted: completedTasksSubquery.count,
        timeSpent: totalTimeSpentSubquery.sum,
      })
      .from(UserTable)
      .where(eq(UserTable.id, requestedUserId))
      .leftJoin(completedGoalsSubquery, eq(UserTable.id, completedGoalsSubquery.userId))
      .leftJoin(completedTasksSubquery, eq(UserTable.id, completedTasksSubquery.userId))
      .leftJoin(totalTimeSpentSubquery, eq(UserTable.id, totalTimeSpentSubquery.userId));

    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }

    return c.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

export default app;