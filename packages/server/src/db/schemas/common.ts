import { pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";

export const GoalTypes = pgEnum("goal_types", ["SHORT", "LONG"]);

export const Status = pgEnum("status", [
  "NOT STARTED",
  "IN PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

export const basic_info = {
  title: varchar().notNull(),
  description: varchar(),
  status: Status().default("NOT STARTED"),
};
export const timestamps = {
  updatedAt: timestamp("updated_at",{withTimezone:true}).$onUpdate(() => new Date()),
  createdAt: timestamp("created_at",{withTimezone:true}).defaultNow().notNull(),
};
