import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { basic_info, timestamps } from "./common";
import { relations } from "drizzle-orm";
import { TaskTable } from "./tasks";

export const SubtaskTable = pgTable("subtasks", {
  id: serial().primaryKey(),
  ...basic_info,
  ...timestamps,
  priority: integer(),
  deadline: timestamp({ withTimezone: true }),
  taskId: integer("task_id").references(() => TaskTable.id, {
    onDelete: "cascade",
  }),
});

export const subtasksToTasks = relations(SubtaskTable, ({ one }) => ({
  task: one(TaskTable, {
    fields: [SubtaskTable.taskId],
    references: [TaskTable.id],
  }),
}));
