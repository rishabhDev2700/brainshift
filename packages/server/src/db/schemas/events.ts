import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { UserTable } from "./users";
import { timestamps } from "./common";

export const EventsTable = pgTable("events", {
  id: serial().primaryKey(),
  title: varchar().notNull(),
  description: varchar().notNull(),
  date: timestamp({ withTimezone: true }).notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  ...timestamps,
});
