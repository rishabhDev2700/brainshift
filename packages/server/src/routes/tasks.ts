import { Hono } from "hono";
import type { HonoVariables } from "../types/hono";
import { db } from "../db/db";
import { and, DrizzleError, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import { TasksTable } from "../db/schemas/tasks";
import { SubtaskTable } from "../db/schemas/subtasks";
const app = new Hono<{ Variables: HonoVariables }>();
const TaskSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["NOT STARTED", "IN PROGRESS", "COMPLETED", "CANCELLED"]),
  priority: z.number().min(0).max(4),
  deadline: z.string(),
  goalId: z.number().optional(),
});

const SubtaskSchema = z.object({
  id: z.int().optional(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["NOT STARTED", "IN PROGRESS", "COMPLETED", "CANCELLED"]),
  priority: z.int().min(0).max(4),
  deadline: z.string(),
});

const StatusUpdateSchema = z.object({
  status: z.enum(["NOT STARTED", "IN PROGRESS", "COMPLETED", "CANCELLED"]),
});

app
  .get("/", async (c) => {
    try {
      const tasks = await db
        .select()
        .from(TasksTable)
        .where(eq(TasksTable.userId, c.get("user").id));
      return c.json(tasks);
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
    }
  })
  .get("/subtasks", async (c) => {
    try {
      const userId = c.get("user").id;
      const subtasks = await db.select()
        .from(SubtaskTable)
        .innerJoin(TasksTable, eq(SubtaskTable.taskId, TasksTable.id))
        .where(eq(TasksTable.userId, userId));
      return c.json(subtasks.map(s => s.subtasks));
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  })
  .get("/:id", async (c) => {
    try {
      const { id } = c.req.param();
      const [task] = await db.query.TasksTable.findMany({
        with: {
          subtasks: true,
        },
        where: (tasks, { eq }) => (
          eq(tasks.id, Number(id)), eq(tasks.userId, c.get("user").id)
        ),
      });
      return c.json(task);
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      return c.json(error);
    }
  })
  .delete("/:id", async (c) => {
    try {
      const { id } = c.req.param();
      const [deletedTask] = await db
        .delete(TasksTable)
        .where(
          and(
            eq(TasksTable.id, Number(id)),
            eq(TasksTable.userId, c.get("user").id)
          )
        )
        .returning();
      if (deletedTask) {
        return c.json({ message: "Task deleted Successfully" });
      }
      return c.json({ message: "Task not Found" });
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      return c.json(error);
    }
  })
  .post("/", zValidator("json", TaskSchema), async (c) => {
    try {
      const validated = c.req.valid("json");
      const [task] = await db
        .insert(TasksTable)
        .values({
          ...validated,
          deadline: new Date(validated.deadline),
          userId: c.get("user").id,
          goalId: validated.goalId || null,
        })
        .returning();
      if (!task) {
        return c.json({ message: "Something went wrong" });
      } else {
        return c.json({ message: "Task added successfully" });
      }
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  })
  .put("/:id", zValidator("json", TaskSchema), async (c) => {
    try {
      const validated = c.req.valid("json");
      console.log(validated);
      const id = parseInt(c.req.param().id);
      const [task] = await db
        .update(TasksTable)
        .set({
          id: id,
          ...validated,
          userId: c.get("user").id,
          deadline: new Date(validated.deadline),
          goalId: validated.goalId || null,
        })
        .where(
          and(
            eq(TasksTable.userId, c.get("user").id),
            eq(TasksTable.id, Number(id))
          )
        )
        .returning();
      if (!task) {
        return c.json({ message: "Something went wrong" });
      } else {
        return c.json({ task });
      }
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  })

  // get specific subtask

  .get("/:taskID/subtasks/:subtaskID", async (c) => {
    const taskID = parseInt(c.req.param("taskID"));
    const subtaskID = parseInt(c.req.param("subtaskID"));

    if (isNaN(taskID) || isNaN(subtaskID)) {
      return c.json({ error: "Invalid taskID or subtaskID" }, 400);
    }
    const subtask = await db.query.SubtaskTable.findFirst({
      where: and(
        eq(SubtaskTable.id, subtaskID),
        eq(SubtaskTable.taskId, taskID)
      ),
      with: {
        task: true,
      },
    });
    if (!subtask) {
      return c.json({ error: "Subtask not found" }, 404);
    }

    return c.json(subtask);
  })

  // add subtasks

  .post("/:taskID/subtasks", zValidator("json", SubtaskSchema), async (c) => {
    const taskID = parseInt(c.req.param("taskID"));
    if (isNaN(taskID)) {
      return c.json({ error: "Invalid taskID" }, 400);
    }
    const validated = c.req.valid("json");
    const [subtask] = await db
      .insert(SubtaskTable)
      .values({
        ...validated,
        deadline: new Date(validated.deadline),
        taskId: taskID,
      })
      .returning();
    if (!subtask) {
      return c.json({ message: "Subtask not inserted" }, 400);
    } else {
      return c.json(subtask);
    }
  })
  .put(
    "/:taskID/subtasks/:id",
    zValidator("json", SubtaskSchema),
    async (c) => {
      const taskID = parseInt(c.req.param().taskID);
      const subtaskID = parseInt(c.req.param().id);
      if (isNaN(taskID)) {
        return c.json({ error: "Invalid taskID" }, 400);
      }
      const validated = c.req.valid("json");
      const [subtask] = await db
        .update(SubtaskTable)
        .set({
          id: subtaskID,
          ...validated,
          deadline: new Date(validated.deadline),
          taskId: taskID,
        })
        .where(
          and(eq(SubtaskTable.id, subtaskID), eq(SubtaskTable.taskId, taskID))
        )
        .returning();
      if (!subtask) {
        return c.json({ message: "Subtask not updated" }, 400);
      } else {
        return c.json(subtask);
      }
    }
  )
  .delete("/:taskID/subtasks/:id", async (c) => {
    try {
      const id = parseInt(c.req.param().id);
      const taskID = parseInt(c.req.param().taskID);
      const [deletedSubtask] = await db
        .delete(SubtaskTable)
        .where(and(eq(SubtaskTable.id, id), eq(SubtaskTable.taskId, taskID)))
        .returning();
      if (deletedSubtask) {
        return c.json({ message: "Task deleted Successfully" });
      }
      return c.json({ message: "Task not Found" });
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      return c.json(error);
    }
  })
  .patch(
    "/:taskID/subtasks/:id/status",
    zValidator("json", StatusUpdateSchema),
    async (c) => {
      try {
        const id = parseInt(c.req.param().id);
        const taskID = parseInt(c.req.param().taskID);
        const validated = c.req.valid("json");
        const [updatedSubtask] = await db
          .update(SubtaskTable)
          .set({ status: validated.status })
          .where(and(eq(SubtaskTable.id, id), eq(SubtaskTable.taskId, taskID)))
          .returning();
        if (updatedSubtask) {
          return c.json({ message: "Subtask status updated Successfully" });
        }
        return c.json({ message: "Subtask not Found" }, 404);
      } catch (err) {
        const error = err as DrizzleError;
        console.log(error);
        return c.json(error);
      }
    }
  );

export default app;
