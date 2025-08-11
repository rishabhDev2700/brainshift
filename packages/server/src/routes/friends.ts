import { Hono } from "hono";
import type { HonoVariables } from "../types/hono";
import { db } from "../db/db";
import { and, DrizzleError, eq, or } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import { FriendshipsTable } from "../db/schemas/friends";
import { UserTable } from "../db/schemas/users";

const app = new Hono<{ Variables: HonoVariables }>();

const FriendRequestSchema = z.object({
  friendId: z.number(),
});

app
  .get("/", async (c) => {
    const user = c.get("user");
    const friendships = await db
      .select()
      .from(FriendshipsTable)
      .where(
        and(
          or(
            eq(FriendshipsTable.userId, user.id),
            eq(FriendshipsTable.friendId, user.id)
          ),
          eq(FriendshipsTable.status, "accepted")
        )
      );
    return c.json(friendships);
  })
  .get("/pending", async (c) => {
    const user = c.get("user");
    const pendingRequests = await db
      .select()
      .from(FriendshipsTable)
      .where(
        and(
          eq(FriendshipsTable.friendId, user.id),
          eq(FriendshipsTable.status, "pending")
        )
      );
    return c.json(pendingRequests);
  })
  .post(
    "/request",
    zValidator("json", FriendRequestSchema),
    async (c) => {
      try {
        const user = c.get("user");
        const { friendId } = c.req.valid("json");

        if (user.id === friendId) {
          return c.json({ message: "You cannot be friends with yourself" }, 400);
        }

        const [friendship] = await db
          .insert(FriendshipsTable)
          .values({
            userId: user.id,
            friendId: friendId,
            status: "pending",
          })
          .returning();

        return c.json(friendship);
      } catch (err) {
        const error = err as DrizzleError;
        console.log(error);
        c.status(500);
        return c.json({ message: "Internal Server Error" });
      }
    }
  )
  .put("/accept/:friendshipId", async (c) => {
    try {
      const user = c.get("user");
      const { friendshipId } = c.req.param();

      const [updatedFriendship] = await db
        .update(FriendshipsTable)
        .set({ status: "accepted" })
        .where(
          and(
            eq(FriendshipsTable.id, Number(friendshipId)),
            eq(FriendshipsTable.friendId, user.id)
          )
        )
        .returning();

      if (!updatedFriendship) {
        return c.json({ message: "Friend request not found" }, 404);
      }

      return c.json(updatedFriendship);
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  })
  .delete("/reject/:friendshipId", async (c) => {
    try {
      const user = c.get("user");
      const { friendshipId } = c.req.param();

      const [deletedFriendship] = await db
        .delete(FriendshipsTable)
        .where(
          and(
            eq(FriendshipsTable.id, Number(friendshipId)),
            or(
              eq(FriendshipsTable.userId, user.id),
              eq(FriendshipsTable.friendId, user.id)
            )
          )
        )
        .returning();

      if (!deletedFriendship) {
        return c.json({ message: "Friend request not found" }, 404);
      }

      return c.json({ message: "Friend request rejected" });
    } catch (err) {
      const error = err as DrizzleError;
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  });

export default app;
