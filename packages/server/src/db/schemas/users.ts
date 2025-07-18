import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./common";
import { relations } from "drizzle-orm";
import { TasksTable } from "./tasks";
import { SessionsTable } from "./sessions";

export const UserTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fullName: varchar("full_name").notNull(),
  email: varchar().unique().notNull(),
  password: varchar().notNull(),
  ...timestamps,
});

export const usersToTasks = relations(UserTable, ({ many }) => {
  return {
    tasks: many(TasksTable),
  };
});

export const usersToSession = relations(UserTable, ({ many }) => ({
  sessions: many(SessionsTable),
}));
