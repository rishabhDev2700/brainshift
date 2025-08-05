import { Hono } from "hono";
import type { HonoVariables } from "../types/hono";
import { db } from "../db/db";
import { TasksTable } from "../db/schemas/tasks";
import { SessionsTable } from "../db/schemas/sessions";
import { GoalsTable } from "../db/schemas/goals";
import { eq, sum, count, sql, and, gte, lte, asc } from "drizzle-orm";
import { number } from "zod";

const app = new Hono<{ Variables: HonoVariables }>();

app.get("/dashboard", async (c) => {
  const totalTasksCompleted = await db
    .select({ count: count() })
    .from(TasksTable)
    .where(eq(TasksTable.status, "COMPLETED"));

  const totalTimeSpentResult = await db
    .select({ totalDuration: sum(SessionsTable.duration) })
    .from(SessionsTable)
    .where(eq(SessionsTable.completed, true));

  const totalGoalsAchieved = await db
    .select({ count: count() })
    .from(GoalsTable)
    .where(eq(GoalsTable.status, "COMPLETED"));

  const totalGoals = await db.select({ count: count() }).from(GoalsTable);

  const tasksPerDay = await db
    .select({
      date: sql<string>`to_char(${TasksTable.createdAt}, 'YYYY-MM-DD')`,
      count: count(),
    })
    .from(TasksTable)
    .where(eq(TasksTable.status, "COMPLETED"))
    .groupBy(sql`to_char(${TasksTable.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${TasksTable.createdAt}, 'YYYY-MM-DD')`);

  let result = {
    totalTasksCompleted: totalTasksCompleted[0]?.count,
    totalTimeSpent: totalTimeSpentResult[0]?.totalDuration || 0,
    totalGoalsAchieved: totalGoalsAchieved[0]?.count,
    totalGoals: totalGoals[0]?.count,
    tasksPerDay: tasksPerDay.map((row) => ({
      date: row.date,
      count: Number(row.count),
    })),
    timeSpentOverview: [], // This will be implemented later
  };

  const timeSpentOverview = await db
    .select({
      date: sql<string>`to_char(${SessionsTable.startTime}, 'YYYY-MM-DD')`,
      totalDuration: sum(SessionsTable.duration),
    })
    .from(SessionsTable)
    .where(eq(SessionsTable.completed, true))
    .groupBy(sql`to_char(${SessionsTable.startTime}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${SessionsTable.startTime}, 'YYYY-MM-DD')`);

  console.log(result);

  return c.json({
    totalTasksCompleted: totalTasksCompleted[0]?.count,
    totalTimeSpent: Number(totalTimeSpentResult[0]?.totalDuration) || 0,
    totalGoalsAchieved: totalGoalsAchieved[0]?.count,
    totalGoals: totalGoals[0]?.count,
    tasksPerDay: tasksPerDay.map((row) => ({
      date: row.date,
      count: Number(row.count),
    })),
    timeSpentOverview: timeSpentOverview.map((row) => ({
      date: row.date,
      totalDuration: Number(row.totalDuration),
    })),
  });
});

export default app;
