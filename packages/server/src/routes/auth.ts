import { type Context, Hono } from "hono";
import { sign } from "hono/jwt";
import { UserTable } from "../db/schemas/users";
import { eq } from "drizzle-orm";
import type { SignatureKey } from "hono/utils/jwt/jws";
import { db } from "../db/db";

const app = new Hono();

app
  .post("/register", async (c: Context) => {
    const { fullName, email, password } = await c.req.json();

    if (!fullName || !email || !password) {
      return c.json({ error: "All fields are required" }, 400);
    }

    const hashedPassword = await Bun.password.hash(password, {
      cost: 4,
      algorithm: "bcrypt",
    });

    try {
      const [user] = await db
        .insert(UserTable)
        .values({ fullName, email, password: hashedPassword })
        .returning();
      const payload = {
        sub: user?.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
      };

      const token = await sign(payload, process.env.JWT_SECRET as SignatureKey);

      return c.json({ token });
    } catch (error) {
      return c.json(
        { error: `User with this email already exists ${error}` },
        409
      );
    }
  })
  .post("/login", async (c: Context) => {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const [user] = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, email));

    if (!user) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const passwordMatch = await Bun.password.verify(password, user.password);

    if (!passwordMatch) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const payload = {
      sub: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    };
    const token = await sign(payload, process.env.JWT_SECRET as SignatureKey);

    return c.json({ token });
  });

export default app;
