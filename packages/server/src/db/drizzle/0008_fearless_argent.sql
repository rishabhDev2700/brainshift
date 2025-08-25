ALTER TABLE "sessions" ALTER COLUMN "break_duration" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "refresh_token" varchar;