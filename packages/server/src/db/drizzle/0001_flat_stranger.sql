ALTER TABLE "tasks" RENAME COLUMN "parent_id" TO "goal_id";--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_parent_id_goals_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE set null ON UPDATE no action;