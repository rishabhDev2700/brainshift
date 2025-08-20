
import { Hono } from "hono";
import type { HonoVariables } from "../types/hono";
import { db } from "../db/db";
import { StreaksTable } from "../db/schemas/streaks";
import { eq } from "drizzle-orm";

const app = new Hono<{ Variables: HonoVariables }>();

app.get("/", async (c) => {
  try {
    const userId = c.get("user").id;
    const [streak] = await db
      .select()
      .from(StreaksTable)
      .where(eq(StreaksTable.userId, userId));

    if (!streak) {
      return c.json({
        currentStreak: 0,
        longestStreak: 0,
        lastStreakDate: null,
      });
    }

    return c.json(streak);
  } catch (err) {
    console.error(err);
    c.status(500);
    return c.json({ message: "Internal Server Error" });
  }
});

export default app;
