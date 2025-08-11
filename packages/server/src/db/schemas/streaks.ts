import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { UserTable } from "./users";

export const StreaksTable = pgTable("streaks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => UserTable.id)
    .unique()
    .notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastStreakDate: timestamp("last_streak_date", { withTimezone: true }),
});

export const streaksToUsers = relations(StreaksTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [StreaksTable.userId],
    references: [UserTable.id],
  }),
}));
