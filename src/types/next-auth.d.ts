import type { Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role: Role | string;
      departmentId: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role | string;
    departmentId?: string | null;
  }
}
