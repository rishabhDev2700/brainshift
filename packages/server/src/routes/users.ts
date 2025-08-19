import { Hono } from "hono";
import type { HonoVariables } from "../types/hono";
import { db } from "../db/db";
import { UserTable } from "../db/schemas/users";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";

const app = new Hono<{ Variables: HonoVariables }>();

const UserSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
});

app
  .get("/me", async (c) => {
    try {
      const userId = c.get("user").id;
      const [user] = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.id, userId));

      if (!user) {
        return c.json({ message: "User not found" }, 404);
      }

      return c.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return c.json({ message: "Internal Server Error" }, 500);
    }
  })
  .put("/me", zValidator("json", UserSchema), async (c) => {
    try {
      const userId = c.get("user").id;
      const validated = c.req.valid("json");

      const [updatedUser] = await db
        .update(UserTable)
        .set(validated)
        .where(eq(UserTable.id, userId))
        .returning();

      if (!updatedUser) {
        return c.json({ message: "User not found" }, 404);
      }

      return c.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return c.json({ message: "Internal Server Error" }, 500);
    }
  });

export default app;
