import {
  integer,
  pgTable,
  serial,
  timestamp,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { basic_info, timestamps } from "./common";
import { UserTable } from "./users";
import { GoalsTable } from "./goals";
import { relations } from "drizzle-orm";
import { SubtaskTable } from "./subtasks";

export const TasksTable = pgTable("tasks", {
  id: serial().primaryKey(),
  ...basic_info,
  ...timestamps,
  priority: integer(),
  deadline: timestamp({withTimezone:true}),
  userId: integer("user_id")
    .notNull()
    .references(() => UserTable.id),
  goalId: integer("goal_id").references((): AnyPgColumn => GoalsTable.id, {
    onDelete: "set null",
  }),
});

export const tasksToUsersRelation = relations(TasksTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [TasksTable.userId],
    references: [UserTable.id],
  }),
}));

export const tasksToSubtasks = relations(TasksTable, ({ many }) => ({
  subtasks: many(SubtaskTable),
}));
