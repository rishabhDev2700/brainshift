import type { JwtVariables } from "hono/jwt";

export type UserContext = {
  id: number;
  fullName: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export type HonoVariables = JwtVariables & {
  user: UserContext;
};
