import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getBootstrapRole, isAllowedUniversityEmail } from "@/lib/auth-policy";
import { env, getInitialAdminEmails } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile, user }) {
      const email = user.email ?? profile?.email;

      if (!email || !isAllowedUniversityEmail(email, env.ALLOWED_GOOGLE_DOMAIN)) {
        return false;
      }

      const googleAccountId = profile?.sub;
      if (!googleAccountId) {
        return false;
      }

      const normalizedEmail = email.toLowerCase();
      const role = getBootstrapRole(normalizedEmail, getInitialAdminEmails());

      await prisma.user.upsert({
        where: { email: normalizedEmail },
        update: {
          googleAccountId,
          name: user.name ?? normalizedEmail,
          imageUrl: user.image,
          role,
          isActive: true,
          lastLoginAt: new Date(),
        },
        create: {
          googleAccountId,
          email: normalizedEmail,
          name: user.name ?? normalizedEmail,
          imageUrl: user.image,
          role,
          isActive: true,
          lastLoginAt: new Date(),
        },
      });

      return true;
    },
    async jwt({ token }) {
      if (token.email) {
        const user = await prisma.user.findUnique({
          where: { email: token.email.toLowerCase() },
        });
        token.role = user?.role ?? "STAFF";
        token.departmentId = user?.departmentId ?? null;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = typeof token.role === "string" ? token.role : "STAFF";
        session.user.departmentId =
          typeof token.departmentId === "string" ? token.departmentId : null;
      }

      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
});
