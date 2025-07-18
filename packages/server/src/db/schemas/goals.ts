import {
  integer,
  pgTable,
  serial,
  timestamp,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { basic_info, GoalTypes, timestamps } from "./common";
import {UserTable} from "./users";

export const GoalsTable = pgTable("goals", {
  id: serial().primaryKey(),
  ...basic_info,
  ...timestamps,
  type: GoalTypes().default(GoalTypes.enumValues[0]),
  priority: integer(),
  deadline: timestamp("deadline",{ withTimezone: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => UserTable.id),
  parentId: integer("parent_id").references((): AnyPgColumn => GoalsTable.id, {
    onDelete: "set null",
  }),
});

