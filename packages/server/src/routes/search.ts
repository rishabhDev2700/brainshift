import { Hono } from "hono";
import { db } from "../db/db";
import { TaskTable } from "../db/schemas/tasks";
import { GoalTable } from "../db/schemas/goals";
import { EventTable } from "../db/schemas/events";
import { ilike, or } from "drizzle-orm";
import type { HonoVariables } from "../types/hono";

const app = new Hono<{ Variables: HonoVariables }>();

app.get("/", async (c) => {
  const userId = c.get("user").id;
  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const query = c.req.query("query");
  if (!query) {
    return c.json({ error: "Search query is required" }, 400);
  }

  try {
    const tasks = await db
      .select()
      .from(TaskTable)
      .where(
        or(
          ilike(TaskTable.title, `%${query}%`),
          ilike(TaskTable.description, `%${query}%`)
        )
      );

    const goals = await db
      .select()
      .from(GoalTable)
      .where(
        or(
          ilike(GoalTable.title, `%${query}%`),
          ilike(GoalTable.description, `%${query}%`)
        )
      );

    const events = await db
      .select()
      .from(EventTable)
      .where(
        or(
          ilike(EventTable.title, `%${query}%`),
          ilike(EventTable.description, `%${query}%`)
        )
      );

    return c.json({ tasks, goals, events }, 200);
  } catch (error) {
    console.error("Error during search:", error);
    return c.json({ error: "Failed to perform search" }, 500);
  }
});

export default app;
