import { Hono } from "hono";
import type { HonoVariables } from "../types/hono";
import { db } from "../db/db";
import {GoalsTable} from "../db/schemas/goals";
import { and, DrizzleError, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";

const app = new Hono<{ Variables: HonoVariables }>();
const GoalSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(1, "Name is required"),
    description: z.string(),
    parentId: z.number().optional(),
    type: z.enum(["SHORT", "LONG"]),
    status: z.enum(["NOT STARTED", "IN PROGRESS", "COMPLETED", "CANCELLED"]),
    priority: z.number(),
    deadline: z.string(),
});

type Goal = z.infer<typeof GoalSchema>;

app
  .get("/", async (c) => {
    try {
      const goals = await db
        .select()
        .from(GoalsTable)
        .where(eq(GoalsTable.userId, c.get("user").id));
      return c.json(goals);
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
    }
  })
  .get("/:id", async (c) => {
    try {
      const { id } = c.req.param();
      const [goal] = await db
        .select()
        .from(GoalsTable)
        .where(
          and(
            eq(GoalsTable.id, Number(id)),
            eq(GoalsTable.userId, c.get("user").id)
          )
        );
      return c.json(goal);
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      return c.json(error);
    }
  })
  .delete("/:id", async (c) => {
    try {
      const { id } = c.req.param();
      const [deletedGoal] = await db
        .delete(GoalsTable)
        .where(
          and(
            eq(GoalsTable.id, Number(id)),
            eq(GoalsTable.userId, c.get("user").id)
          )
        )
        .returning();
      if (deletedGoal) {
        return c.json({ message: "Goal deleted Successfully" });
      }
      return c.json({ message: "Goal not Found" });
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      return c.json(error);
    }
  })
  .post("/", zValidator("json", GoalSchema), async (c) => {
    try {
      const validated = c.req.valid("json");
      const [goal] = await db
        .insert(GoalsTable)
        .values({
          ...validated,
          deadline: new Date(validated.deadline),
          userId: c.get("user").id,
        })
        .returning();
      if (!goal) {
        return c.json({ message: "Something went wrong" });
      } else {
        return c.json({ message: "Goal added successfully" });
      }
    } catch (err) {
      const error = err as DrizzleError;
      console.log(err);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  })
  .put("/:id", zValidator("json", GoalSchema), async (c) => {
    try {
      const validated = c.req.valid("json");
      const {id} = c.req.param();
      const [goal] = await db
        .update(GoalsTable)
        .set({ ...validated, userId: c.get("user").id,deadline:new Date(validated.deadline) })
        .where(and(eq(GoalsTable.userId, c.get("user").id),eq(GoalsTable.id,Number(id))))
        .returning();
      if (!goal) {
        return c.json({ message: "Something went wrong" });
      } else {
        return c.json({ message: "Goal Updated Successfully" });
      }
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  });

export default app;
