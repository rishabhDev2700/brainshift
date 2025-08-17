import { type Context, Hono } from "hono";
import { sign } from "hono/jwt";
import { UserTable } from "../db/schemas/users";
import { and, eq } from "drizzle-orm";
import type { SignatureKey } from "hono/utils/jwt/jws";
import { db } from "../db/db";
import { OAuth2Client } from "google-auth-library";
import { randomBytes } from "crypto";
import { MailtrapClient } from "mailtrap";

const app = new Hono();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const TOKEN = process.env.MAILTRAP_TOKEN as string;
const mailtrapClient = new MailtrapClient({ token: TOKEN });

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

    const emailVerificationToken = randomBytes(32).toString("hex");
    const emailVerificationTokenExpiresAt = new Date(Date.now() + 3600000); // 1 hour

    try {
      const [user] = await db
        .insert(UserTable)
        .values({
          fullName,
          email,
          password: hashedPassword,
          emailVerificationToken,
          emailVerificationTokenExpiresAt,
        })
        .returning();

      const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`;

      await mailtrapClient.send({
        from: { email: "admin@brainshift.in", name: "BrainShift" },
        to: [{ email }],
        subject: "Verify your email address",
        text: `Please click the following link to verify your email address: ${verificationLink}`,
      });

      return c.json({
        message:
          "Registration successful. Please check your email for verification.",
      });
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

    if (!user.emailVerified) {
      return c.json(
        { error: "Please verify your email before logging in." },
        401
      );
    }

    const passwordMatch = await Bun.password.verify(password, user.password);

    if (!passwordMatch) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const payload = {
      sub: user.id,
      fullName: user.fullName,
      email: user.email,
      emailVerified: user.emailVerified,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    };
    const token = await sign(payload, process.env.JWT_SECRET as SignatureKey);

    return c.json({ token });
  })
  .post("/google", async (c: Context) => {
    const { token: idToken } = await c.req.json();

    if (!idToken) {
      return c.json({ error: "Google ID token is required" }, 400);
    }

    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      if (!payload || !payload.email) {
        return c.json({ error: "Invalid Google ID token payload" }, 400);
      }

      const email = payload.email;
      const fullName = payload.name || email;

      let [user] = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.email, email));

      if (!user) {
        [user] = await db
          .insert(UserTable)
          .values({
            fullName,
            email,
            password: "",
            emailVerified: true,
          })
          .returning();
      }

      if (!user) {
        return c.json({ error: "Failed to create or retrieve user" }, 500);
      }

      const jwtPayload = {
        sub: user.id,
        fullName: user.fullName,
        email: user.email,
        emailVerified: user.emailVerified,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
      };
      const token = await sign(
        jwtPayload,
        process.env.JWT_SECRET as SignatureKey
      );

      return c.json({ token });
    } catch (error) {
      console.error("Google authentication error:", error);
      return c.json({ error: "Google authentication failed" }, 401);
    }
  })
  .get("/verify-email", async (c) => {
    const { token } = c.req.query();

    if (!token) {
      return c.json({ error: "Verification token is required" }, 400);
    }

    const [user] = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.emailVerificationToken, token));

    console.log(user);

    if (!user) {
      return c.json({ error: "Invalid verification token" }, 400);
    }

    if (
      !user.emailVerificationTokenExpiresAt ||
      new Date() > new Date(user.emailVerificationTokenExpiresAt)
    ) {
      return c.json({ error: "Verification token has expired" }, 400);
    }

    console.log("Before update:", user);
    await db
      .update(UserTable)
      .set({
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpiresAt: null,
      })
      .where(eq(UserTable.id, user.id));
    console.log("After update");

    return c.json({ message: "Email verified successfully" });
  });

export default app;
