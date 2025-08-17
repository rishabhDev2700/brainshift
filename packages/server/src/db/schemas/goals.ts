import {
  integer,
  pgTable,
  serial,
  timestamp,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { basic_info, GoalTypes, timestamps } from "./common";
import { UserTable } from "./users";

export const GoalTable = pgTable("goals", {
  id: serial().primaryKey(),
  ...basic_info,
  ...timestamps,
  type: GoalTypes().default(GoalTypes.enumValues[0]),
  priority: integer(),
  deadline: timestamp("deadline", { withTimezone: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  parentId: integer("parent_id").references((): AnyPgColumn => GoalTable.id, {
    onDelete: "set null",
  }),
});
