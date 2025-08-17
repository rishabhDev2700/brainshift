import { Hono } from "hono";
import { db } from "../db/db";
import { FeedbackTable } from "../db/schemas/feedback";
import { and, eq } from "drizzle-orm";
import type { HonoVariables } from "../types/hono";

const app = new Hono<{ Variables: HonoVariables }>();

app.post("/", async (c) => {
  const userId = c.get("user").id;
  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { message, rating, category } = await c.req.json();

  if (!message) {
    return c.json({ error: "Feedback message is required" }, 400);
  }

  try {
    const [newFeedback] = await db
      .insert(FeedbackTable)
      .values({
        userId: userId,
        message,
        rating: rating || null,
        category: category || null,
      })
      .returning();

    return c.json(
      { message: "Feedback submitted successfully", feedback: newFeedback },
      201
    );
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return c.json({ error: "Failed to submit feedback" }, 500);
  }
});

app.get("/status/friends", async (c) => {
  const userId = c.get("user").id;
  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const existingFeedback = await db
      .select()
      .from(FeedbackTable)
      .where(
        and(
          eq(FeedbackTable.userId, userId),
          eq(FeedbackTable.category, "Friends Feature Interest")
        )
      );

    return c.json({ hasGivenFeedback: existingFeedback.length > 0 }, 200);
  } catch (error) {
    console.error("Error fetching feedback status:", error);
    return c.json({ error: "Failed to fetch feedback status" }, 500);
  }
});

export default app;
