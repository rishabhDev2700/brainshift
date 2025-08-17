import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "./common";
import { relations } from "drizzle-orm";
import { TaskTable } from "./tasks";
import { SessionsTable } from "./sessions";

export const UserTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fullName: varchar("full_name").notNull(),
  email: varchar().unique().notNull(),
  password: varchar().notNull(),
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: varchar("email_verification_token"),
  emailVerificationTokenExpiresAt: timestamp(
    "email_verification_token_expires_at",
    { withTimezone: true }
  ),
  ...timestamps,
});

export const usersToTasks = relations(UserTable, ({ many }) => {
  return {
    tasks: many(TaskTable),
  };
});

export const usersToSession = relations(UserTable, ({ many }) => ({
  sessions: many(SessionsTable),
}));
