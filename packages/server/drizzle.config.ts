import { defineConfig } from "drizzle-kit";import "dotenv/config";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schemas/*.ts",
  out:"./src/db/drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});