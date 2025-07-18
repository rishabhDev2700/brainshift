import { Hono } from "hono";
import "dotenv/config";
import { logger } from "hono/logger";
import type { SignatureKey } from "hono/utils/jwt/jws";
import { jwt } from "hono/jwt";
import AuthRoute from "./routes/auth";
import { db } from "./db/db";
import { UserTable } from "./db/schemas/users";
import { eq } from "drizzle-orm";
import { type HonoVariables } from "./types/hono";
import EventsRoutes from "./routes/events";
import GoalsRoutes from "./routes/goals";
import TaskRoutes from "./routes/tasks";
import SessionRoutes from "./routes/sessions";
import { cors } from "hono/cors";
const app = new Hono<{ Variables: HonoVariables }>().basePath("/api");

app.use(cors());
app.use(logger());
app.route("/auth", AuthRoute);

app.use("/*", async (c, next) => {
  if (c.req.path.startsWith("/api/auth")) {
    return next();
  }

  const jwtMiddleware = jwt({
    secret: process.env.JWT_SECRET as SignatureKey,
  });
  return jwtMiddleware(c, next);
});

app.use("/*", async (c, next) => {
  if (c.req.path.startsWith("/api/auth")) {
    return next();
  }

  const payload = c.get("jwtPayload");
  if (!payload || !payload.sub) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const [user] = await db
    .select({
      id: UserTable.id,
      fullName: UserTable.fullName,
      email: UserTable.email,
      createdAt: UserTable.createdAt,
      updatedAt: UserTable.updatedAt,
    })
    .from(UserTable)
    .where(eq(UserTable.id, payload.sub as number));

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("user", user);
  await next();
});

app.route("/events", EventsRoutes);
app.route("/goals", GoalsRoutes);
app.route("/tasks", TaskRoutes);
app.route("/sessions", SessionRoutes);
export default {
  fetch: app.fetch,
  port: process.env.PORT,
};
