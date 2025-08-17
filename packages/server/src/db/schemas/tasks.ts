import {
  integer,
  pgTable,
  serial,
  timestamp,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { basic_info, timestamps } from "./common";
import { UserTable } from "./users";
import { GoalTable } from "./goals";
import { relations } from "drizzle-orm";
import { SubtaskTable } from "./subtasks";

export const TaskTable = pgTable("tasks", {
  id: serial().primaryKey(),
  ...basic_info,
  ...timestamps,
  priority: integer(),
  deadline: timestamp({ withTimezone: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  goalId: integer("goal_id").references((): AnyPgColumn => GoalTable.id, {
    onDelete: "set null",
  }),
  lastRemindedAt: timestamp("last_reminded_at", { withTimezone: true }),
});

export const tasksToUsersRelation = relations(TaskTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [TaskTable.userId],
    references: [UserTable.id],
  }),
}));

export const tasksToSubtasks = relations(TaskTable, ({ many }) => ({
  subtasks: many(SubtaskTable),
}));
