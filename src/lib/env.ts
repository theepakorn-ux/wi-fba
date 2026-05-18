import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(1),
  AUTH_GOOGLE_ID: z.string().min(1),
  AUTH_GOOGLE_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url().optional(),
  ALLOWED_GOOGLE_DOMAIN: z.string().default("rmutsv.ac.th"),
  INITIAL_ADMIN_EMAILS: z.string().default("theepakorn.n@rmutsv.ac.th"),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  ALLOWED_GOOGLE_DOMAIN: process.env.ALLOWED_GOOGLE_DOMAIN,
  INITIAL_ADMIN_EMAILS: process.env.INITIAL_ADMIN_EMAILS,
});

export function getInitialAdminEmails() {
  return env.INITIAL_ADMIN_EMAILS.split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}
