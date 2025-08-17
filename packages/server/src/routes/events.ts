import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { HonoVariables } from "../types/hono";
import { db } from "../db/db";
import { and, DrizzleError, eq, gte, lt } from "drizzle-orm";
import { EventTable } from "../db/schemas/events";
import * as z from "zod";

const app = new Hono<{ Variables: HonoVariables }>();

const EventSchema = z.object({
  id: z.int().optional(),
  title: z.string(),
  description: z.string().optional(),
  date: z.string(),
});

type Event = z.infer<typeof EventSchema>;

app
  .get("/", async (c) => {
    try {
      const events = await db
        .select()
        .from(EventTable)
        .where(eq(EventTable.userId, c.get("user").id));
      console.log();
      return c.json(events);
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
    }
  })
  .get(
    "/search",
    zValidator(
      "query",
      z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      })
    ),
    async (c) => {
      try {
        const { date } = c.req.valid("query");
        const dayStart = new Date(`${date}T00:00:00.000Z`);
        const dayEnd = new Date(`${date}T23:59:59.999Z`);
        const events = await db
          .select()
          .from(EventTable)
          .where(
            and(
              eq(EventTable.userId, c.get("user").id),
              gte(EventTable.date, dayStart),
              lt(EventTable.date, new Date(dayEnd.getTime() + 1))
            )
          );
        console.log(events);
        return c.json(events);
      } catch (err) {
        const error = err as DrizzleError;
        console.log(error);
      }
    }
  )
  .get("/:id", async (c) => {
    try {
      const { id } = c.req.param();
      const [event] = await db
        .select()
        .from(EventTable)
        .where(
          and(
            eq(EventTable.id, Number(id)),
            eq(EventTable.userId, c.get("user").id)
          )
        );
      return c.json(event);
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      return c.json(error);
    }
  })
  .delete("/:id", async (c) => {
    try {
      const { id } = c.req.param();
      const [deletedEvent] = await db
        .delete(EventTable)
        .where(
          and(
            eq(EventTable.id, Number(id)),
            eq(EventTable.userId, c.get("user").id)
          )
        )
        .returning();
      if (deletedEvent) {
        return c.json({ message: "Event deleted Successfully" });
      }
      return c.json({ message: "Event not Found" });
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      return c.json(error);
    }
  })
  .post("/", zValidator("json", EventSchema), async (c) => {
    try {
      const validated = c.req.valid("json");
      const [event] = await db
        .insert(EventTable)
        .values({
          ...validated,
          description: validated.description || "",
          date: new Date(validated.date),
          userId: c.get("user").id,
        })
        .returning();
      if (!event) {
        return c.json({ message: "Something went wrong" });
      } else {
        return c.json({ message: "Event added successfully" });
      }
    } catch (err) {
      const error = err as DrizzleError;
      console.log(err);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  })
  .put("/:id", zValidator("json", EventSchema), async (c) => {
    try {
      const validated = c.req.valid("json");
      const { id } = c.req.param();
      const [event] = await db
        .update(EventTable)
        .set({
          ...validated,
          description: validated.description || "",
          date: new Date(validated.date),
          userId: c.get("user").id,
        })
        .where(
          and(
            eq(EventTable.id, Number(id)),
            eq(EventTable.userId, c.get("user").id)
          )
        )
        .returning();
      if (!event) {
        return c.json({ message: "Something went wrong" });
      } else {
        return c.json({ message: "Event Updated Successfully" });
      }
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  });

export default app;
