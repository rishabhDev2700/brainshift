import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { TasksTable } from "./tasks";
import { relations } from "drizzle-orm";
import { UserTable } from "./users";

export const TargetType = pgEnum("target_type", ["task", "subtask"]);
export const SessionsTable = pgTable("sessions", {
  id: serial().primaryKey(),
  targetType: TargetType("target_type").notNull(),
  targetId: integer("task_id").references(() => TasksTable.id),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }),
  duration: integer(),
  isCancelled: boolean("is_cancelled").default(false),
  isPomodoro: boolean("is_pomodoro").default(false),
  completed: boolean("is_completed").default(false),
  userId: integer("user_id").references(() => UserTable.id),
});

export const sessionsToUsers = relations(SessionsTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [SessionsTable.userId],
    references: [UserTable.id],
  }),
}));
