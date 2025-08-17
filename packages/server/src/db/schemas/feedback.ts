import { pgTable, serial, text, timestamp, integer, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { UserTable } from "./users";

export const FeedbackTable = pgTable("feedbacks", {
  id: serial().primaryKey(),
  userId: integer("user_id").references(() => UserTable.id, { onDelete: "cascade" }).notNull(),
  message: text("message").notNull(),
  rating: integer("rating"), // e.g., 1-5
  category: varchar("category", { length: 256 }), // e.g., bug, feature_request, general
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const feedbackRelations = relations(FeedbackTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [FeedbackTable.userId],
    references: [UserTable.id],
  }),
}));
