import { Hono } from "hono";
import type { HonoVariables } from "../types/hono";
import { db } from "../db/db";
import { TaskTable } from "../db/schemas/tasks";
import { SessionsTable } from "../db/schemas/sessions";
import { GoalTable } from "../db/schemas/goals";
import { eq, sum, count, sql, and, gte, lte, asc } from "drizzle-orm";
import { number } from "zod";

const app = new Hono<{ Variables: HonoVariables }>();

app.get("/dashboard", async (c) => {
  const userId = c.get("user").id;
  const startDateParam = c.req.query("startDate");
  const endDateParam = c.req.query("endDate");

  const startDate = startDateParam
    ? new Date(startDateParam)
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to 30 days ago
  const endDate = endDateParam ? new Date(endDateParam) : new Date(); // Default to today

  const totalTasksCompleted = await db
    .select({ count: count() })
    .from(TaskTable)
    .where(
      and(
        eq(TaskTable.status, "COMPLETED"),
        eq(TaskTable.userId, userId),
        gte(TaskTable.createdAt, startDate),
        lte(TaskTable.createdAt, endDate)
      )
    );

  const totalTimeSpentResult = await db
    .select({ totalDuration: sum(SessionsTable.duration) })
    .from(SessionsTable)
    .where(
      and(
        eq(SessionsTable.completed, true),
        eq(SessionsTable.userId, userId),
        gte(SessionsTable.startTime, startDate),
        lte(SessionsTable.startTime, endDate)
      )
    );

  const totalGoalsAchieved = await db
    .select({ count: count() })
    .from(GoalTable)
    .where(
      and(
        eq(GoalTable.status, "COMPLETED"),
        eq(GoalTable.userId, userId),
        gte(GoalTable.createdAt, startDate),
        lte(GoalTable.createdAt, endDate)
      )
    );

  const totalGoals = await db
    .select({ count: count() })
    .from(GoalTable)
    .where(
      and(
        eq(GoalTable.userId, userId),
        gte(GoalTable.createdAt, startDate),
        lte(GoalTable.createdAt, endDate)
      )
    );

  const tasksPerDay = await db
    .select({
      date: sql<string>`to_char(dates.day, 'YYYY-MM-DD')`,
      count: sql<number>`COALESCE(count(${TaskTable.id}), 0)`,
    })
    .from(
      sql`(SELECT generate_series(${sql.raw(
        `'${startDate.toISOString()}'::timestamp`
      )}, ${sql.raw(
        `'${endDate.toISOString()}'::timestamp`
      )}, '1 day')::date as day) as dates`
    )
    .leftJoin(
      TaskTable,
      and(
        eq(
          sql`to_char(dates.day, 'YYYY-MM-DD')`,
          sql`to_char(${TaskTable.createdAt}, 'YYYY-MM-DD')`
        ),
        eq(TaskTable.status, "COMPLETED"),
        eq(TaskTable.userId, userId)
      )
    )
    .groupBy(sql`dates.day`)
    .orderBy(sql`dates.day`);

  const timeSpentOverview = await db
    .select({
      date: sql<string>`to_char(dates.day, 'YYYY-MM-DD')`,
      totalDuration: sql<number>`COALESCE(sum(${SessionsTable.duration}), 0)`,
    })
    .from(
      sql`(SELECT generate_series(${sql.raw(
        `'${startDate.toISOString()}'::timestamp`
      )}, ${sql.raw(
        `'${endDate.toISOString()}'::timestamp`
      )}, '1 day')::date as day) as dates`
    )
    .leftJoin(
      SessionsTable,
      and(
        eq(
          sql`to_char(dates.day, 'YYYY-MM-DD')`,
          sql`to_char(${SessionsTable.startTime}, 'YYYY-MM-DD')`
        ),
        eq(SessionsTable.completed, true),
        eq(SessionsTable.userId, userId)
      )
    )
    .groupBy(sql`dates.day`)
    .orderBy(sql`dates.day`);

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
