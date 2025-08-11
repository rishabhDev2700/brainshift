import { integer, pgTable, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { UserTable } from "./users";
import { timestamps } from "./common";

export const friendshipStatusEnum = pgEnum("friendship_status", [
  "pending",
  "accepted",
  "blocked",
]);

export const FriendshipsTable = pgTable("friendships", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => UserTable.id),
  friendId: integer("friend_id")
    .notNull()
    .references(() => UserTable.id),
  status: friendshipStatusEnum("status").notNull().default("pending"),
  ...timestamps,
});

export const friendshipsRelations = relations(FriendshipsTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [FriendshipsTable.userId],
    references: [UserTable.id],
    relationName: "user",
  }),
  friend: one(UserTable, {
    fields: [FriendshipsTable.friendId],
    references: [UserTable.id],
    relationName: "friend",
  }),
}));
