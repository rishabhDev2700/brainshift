
import { Hono } from "hono";
import type { HonoVariables } from "../types/hono";
import { db } from "../db/db";
import { StreaksTable } from "../db/schemas/streaks";
import { eq } from "drizzle-orm";
import { isSameDay, isYesterday } from "date-fns";

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

    const today = new Date();
    const lastStreakDate = new Date(streak.lastStreakDate as any);

    if (!isSameDay(lastStreakDate, today) && !isYesterday(lastStreakDate)) {
      await db
        .update(StreaksTable)
        .set({ currentStreak: 0 })
        .where(eq(StreaksTable.userId, userId));
      return c.json({ ...streak, currentStreak: 0 });
    }

    return c.json(streak);
  } catch (err) {
    console.error(err);
    c.status(500);
    return c.json({ message: "Internal Server Error" });
  }
});

export default app;
