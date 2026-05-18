# WI-FBA Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the WI-FBA project foundation: a runnable Next.js application with TypeScript, Tailwind CSS, Prisma/PostgreSQL schema, Google-only authentication policy for `rmutsv.ac.th`, initial admin bootstrap, basic responsive app shell, documentation, and CI.

**Architecture:** Use a single Next.js App Router application as the full-stack boundary. Keep business rules in focused server-side modules under `src/lib`, Prisma schema as the data contract, and UI routes under `src/app`. This phase produces the stable foundation for later proposal, review, approval, and reporting feature work.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, Auth.js/NextAuth Google provider, Vitest, Testing Library, GitHub Actions.

---

## Scope Check

The full MVP includes authentication, proposal management, approval workflow, reporting, administration, PDPA, browser compatibility, and responsive UX. This plan intentionally implements Phase 1 foundation only because it creates a working project that later feature plans can build on safely.

Covered in this plan:

- Repository scaffold
- Project scripts and dependencies
- Environment template
- Prisma schema for MVP data model
- Seed data for departments
- Google domain authentication policy
- Initial admin bootstrap email `theepakorn.n@rmutsv.ac.th`
- Server-side role constants and access helpers
- Proposal workflow transition helpers and tests
- Responsive app shell and public privacy page
- CI workflow
- README and branch strategy documentation

Feature plans after this phase:

- Phase 2: Proposal CRUD and staff tracking
- Phase 3: Review, evaluation, and approval workflow screens
- Phase 4: Reports and administration screens

## File Structure

Create and modify these files:

- Create: `package.json` via Next.js scaffold and modify scripts/dependencies
- Create: `src/app/layout.tsx` for global layout
- Create: `src/app/page.tsx` for landing redirect/dashboard entry
- Create: `src/app/(public)/privacy/page.tsx` for PDPA-aware privacy notice
- Create: `src/app/(auth)/signin/page.tsx` for Google sign-in entry page
- Create: `src/app/(app)/dashboard/page.tsx` for authenticated dashboard shell
- Create: `src/app/(app)/onboarding/page.tsx` for department selection shell
- Create: `src/app/api/auth/[...nextauth]/route.ts` for Auth.js route handlers
- Create: `src/components/app-shell.tsx` for responsive navigation shell
- Create: `src/components/sign-in-button.tsx` for client sign-in action
- Create: `src/lib/auth.ts` for Auth.js config
- Create: `src/lib/auth-policy.ts` for email domain and initial admin policy
- Create: `src/lib/rbac.ts` for roles and permission helpers
- Create: `src/lib/workflow.ts` for proposal status transitions
- Create: `src/lib/prisma.ts` for Prisma client singleton
- Create: `src/lib/env.ts` for typed environment access
- Create: `prisma/schema.prisma` for the MVP data model
- Create: `prisma/seed.ts` for initial departments
- Create: `src/test/auth-policy.test.ts` for authentication policy tests
- Create: `src/test/rbac.test.ts` for role helper tests
- Create: `src/test/workflow.test.ts` for status transition tests
- Create: `.env.example` for local and cloud configuration
- Create: `.github/workflows/ci.yml` for CI
- Create: `README.md` for setup instructions
- Create: `docs/branch-strategy.md` for GitHub workflow
- Modify: `docs/superpowers/specs/2026-05-18-wi-fba-mvp-design.md` only if implementation reveals a contradiction

## Task 1: Clone Repository and Scaffold Next.js

**Files:**
- Create: generated Next.js app files in repository root
- Preserve: `docs/superpowers/specs/2026-05-18-wi-fba-mvp-design.md`
- Preserve: `docs/superpowers/plans/2026-05-18-wi-fba-foundation.md`

- [ ] **Step 1: Clone the repository locally**

Run:

```bash
git clone https://github.com/theepakorn-ux/wi-fba.git
cd wi-fba
git status --short
```

Expected: clean working tree with the `docs/` directory present.

- [ ] **Step 2: Create scaffold in a sibling temporary directory**

Run:

```bash
cd ..
npx create-next-app@latest wi-fba-scaffold --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Expected: `wi-fba-scaffold` is created with a runnable Next.js app.

- [ ] **Step 3: Copy scaffold files into repository root**

Run from the parent directory containing both folders:

```bash
rsync -av --exclude='.git' --exclude='node_modules' wi-fba-scaffold/ wi-fba/
cd wi-fba
git status --short
```

Expected: generated Next.js files appear as untracked files while `docs/` remains present.

- [ ] **Step 4: Verify the scaffold runs before custom changes**

Run:

```bash
npm run lint
npm run build
```

Expected: lint and production build complete successfully.

- [ ] **Step 5: Commit scaffold**

Run:

```bash
git add .
git commit -m "chore: scaffold WI-FBA Next.js app"
```

Expected: one commit containing scaffolded project files.

## Task 2: Add Dependencies and Project Scripts

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`

- [ ] **Step 1: Install runtime and test dependencies**

Run:

```bash
npm install next-auth @auth/prisma-adapter @prisma/client zod lucide-react
npm install -D prisma vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom tsx
```

Expected: packages install and `package-lock.json` updates.

- [ ] **Step 2: Update `package.json` scripts**

Ensure `package.json` contains these scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "tsx prisma/seed.ts",
    "verify": "npm run typecheck && npm run lint && npm run test && npm run prisma:generate && npm run build"
  }
}
```

If the scaffold creates a different `lint` command because of the installed Next.js version, keep the generated working lint command and still add the remaining scripts exactly.

- [ ] **Step 3: Add Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Verify dependency setup**

Run:

```bash
npm run typecheck
npm run test
```

Expected: typecheck passes and Vitest reports no test files or passes existing tests depending on scaffold state.

- [ ] **Step 5: Commit dependency setup**

Run:

```bash
git add package.json package-lock.json tsconfig.json vitest.config.ts vitest.setup.ts
git commit -m "chore: add WI-FBA dependencies and scripts"
```

Expected: one commit with dependency and script changes.

## Task 3: Add Environment and Prisma Schema

**Files:**
- Create: `.env.example`
- Create: `src/lib/env.ts`
- Create: `src/lib/prisma.ts`
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`

- [ ] **Step 1: Create `.env.example`**

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/wi_fba?schema=public"
AUTH_SECRET="replace-with-openssl-rand-base64-32"
AUTH_GOOGLE_ID="replace-with-google-oauth-client-id"
AUTH_GOOGLE_SECRET="replace-with-google-oauth-client-secret"
NEXTAUTH_URL="http://localhost:3000"
ALLOWED_GOOGLE_DOMAIN="rmutsv.ac.th"
INITIAL_ADMIN_EMAILS="theepakorn.n@rmutsv.ac.th"
```

- [ ] **Step 2: Create typed environment helper**

Create `src/lib/env.ts`:

```ts
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
```

- [ ] **Step 3: Create Prisma client singleton**

Create `src/lib/prisma.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

- [ ] **Step 4: Create Prisma schema**

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  STAFF
  OFFICE_HEAD
  VICE_DEAN
  DEAN
  ADMIN
}

enum ProposalStatus {
  DRAFT
  SUBMITTED
  OFFICE_REVIEW
  REVISION_REQUESTED
  EVALUATED
  VICE_DEAN_REVIEW
  DEAN_APPROVAL
  APPROVED
  REJECTED
  CANCELLED
}

enum ReviewStage {
  OFFICE_HEAD
  VICE_DEAN
  DEAN
}

enum ReviewDecision {
  REQUEST_REVISION
  EVALUATE
  RECOMMEND_APPROVAL
  RECOMMEND_REJECTION
  APPROVE
  REJECT
}

model User {
  id              String                  @id @default(cuid())
  googleAccountId String                  @unique
  email           String                  @unique
  name            String
  imageUrl        String?
  role            Role                    @default(STAFF)
  departmentId    String?
  department      Department?             @relation(fields: [departmentId], references: [id])
  isActive        Boolean                 @default(true)
  lastLoginAt     DateTime?
  createdAt       DateTime                @default(now())
  updatedAt       DateTime                @updatedAt
  proposals       ImprovementProposal[]   @relation("ProposalSubmitter")
  reviews         ProposalReview[]        @relation("ProposalReviewer")
  statusChanges   ProposalStatusHistory[] @relation("StatusActor")
  auditLogs       AuditLog[]              @relation("AuditActor")
}

model Department {
  id        String                @id @default(cuid())
  name      String
  code      String                @unique
  isActive  Boolean               @default(true)
  createdAt DateTime              @default(now())
  updatedAt DateTime              @updatedAt
  users     User[]
  proposals ImprovementProposal[]
}

model ImprovementProposal {
  id                  String                  @id @default(cuid())
  title               String
  problemStatement    String
  proposedImprovement String
  expectedBenefit     String
  submitterId         String
  submitter           User                    @relation("ProposalSubmitter", fields: [submitterId], references: [id])
  departmentId        String
  department          Department              @relation(fields: [departmentId], references: [id])
  status              ProposalStatus          @default(DRAFT)
  submittedAt         DateTime?
  createdAt           DateTime                @default(now())
  updatedAt           DateTime                @updatedAt
  reviews             ProposalReview[]
  statusHistories     ProposalStatusHistory[]
}

model ProposalReview {
  id                String              @id @default(cuid())
  proposalId        String
  proposal          ImprovementProposal @relation(fields: [proposalId], references: [id], onDelete: Cascade)
  reviewerId        String
  reviewer          User                @relation("ProposalReviewer", fields: [reviewerId], references: [id])
  reviewStage       ReviewStage
  decision          ReviewDecision
  comment           String
  evaluationScore   Int?
  evaluationSummary String?
  createdAt         DateTime            @default(now())
}

model ProposalStatusHistory {
  id         String              @id @default(cuid())
  proposalId String
  proposal   ImprovementProposal @relation(fields: [proposalId], references: [id], onDelete: Cascade)
  fromStatus ProposalStatus?
  toStatus   ProposalStatus
  actorId    String
  actor      User                @relation("StatusActor", fields: [actorId], references: [id])
  comment    String?
  createdAt  DateTime            @default(now())
}

model AuditLog {
  id         String   @id @default(cuid())
  actorId    String?
  actor      User?    @relation("AuditActor", fields: [actorId], references: [id])
  action     String
  entityType String
  entityId   String?
  metadata   Json?
  createdAt  DateTime @default(now())
}
```

- [ ] **Step 5: Create seed file**

Create `prisma/seed.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const departments = [
  { code: "FBA-OFFICE", name: "สำนักงานคณบดีคณะบริหารธุรกิจ" },
  { code: "FBA-ACCT", name: "สาขาการบัญชี" },
  { code: "FBA-MGMT", name: "สาขาการจัดการ" },
  { code: "FBA-MKT", name: "สาขาการตลาด" },
  { code: "FBA-IS", name: "สาขาระบบสารสนเทศ" },
];

async function main() {
  for (const department of departments) {
    await prisma.department.upsert({
      where: { code: department.code },
      update: { name: department.name, isActive: true },
      create: department,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
```

- [ ] **Step 6: Verify Prisma generation**

Run:

```bash
npm run prisma:generate
npm run typecheck
```

Expected: Prisma client generates and TypeScript passes.

- [ ] **Step 7: Commit data foundation**

Run:

```bash
git add .env.example src/lib/env.ts src/lib/prisma.ts prisma/schema.prisma prisma/seed.ts package.json package-lock.json
git commit -m "feat: add WI-FBA data model foundation"
```

Expected: one commit with environment and Prisma foundation.

## Task 4: Add Auth Policy, RBAC, and Workflow Tests

**Files:**
- Create: `src/lib/auth-policy.ts`
- Create: `src/lib/rbac.ts`
- Create: `src/lib/workflow.ts`
- Create: `src/test/auth-policy.test.ts`
- Create: `src/test/rbac.test.ts`
- Create: `src/test/workflow.test.ts`

- [ ] **Step 1: Write authentication policy tests**

Create `src/test/auth-policy.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getBootstrapRole, isAllowedUniversityEmail } from "@/lib/auth-policy";

describe("auth policy", () => {
  it("allows rmutsv.ac.th university email addresses", () => {
    expect(isAllowedUniversityEmail("theepakorn.n@rmutsv.ac.th", "rmutsv.ac.th")).toBe(true);
  });

  it("rejects external email addresses", () => {
    expect(isAllowedUniversityEmail("person@gmail.com", "rmutsv.ac.th")).toBe(false);
  });

  it("assigns ADMIN to the approved initial admin", () => {
    expect(getBootstrapRole("theepakorn.n@rmutsv.ac.th", ["theepakorn.n@rmutsv.ac.th"])).toBe("ADMIN");
  });

  it("assigns STAFF to ordinary university users", () => {
    expect(getBootstrapRole("staff@rmutsv.ac.th", ["theepakorn.n@rmutsv.ac.th"])).toBe("STAFF");
  });
});
```

Run:

```bash
npm run test -- src/test/auth-policy.test.ts
```

Expected: FAIL because `src/lib/auth-policy.ts` does not exist.

- [ ] **Step 2: Implement authentication policy**

Create `src/lib/auth-policy.ts`:

```ts
import type { Role } from "@prisma/client";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isAllowedUniversityEmail(email: string, allowedDomain: string) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedDomain = allowedDomain.trim().toLowerCase();
  return normalizedEmail.endsWith(`@${normalizedDomain}`);
}

export function getBootstrapRole(email: string, initialAdminEmails: string[]): Role {
  const normalizedEmail = normalizeEmail(email);
  const normalizedAdmins = initialAdminEmails.map(normalizeEmail);
  return normalizedAdmins.includes(normalizedEmail) ? "ADMIN" : "STAFF";
}
```

Run:

```bash
npm run test -- src/test/auth-policy.test.ts
```

Expected: PASS.

- [ ] **Step 3: Write RBAC tests**

Create `src/test/rbac.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { canAssignRole, canEditProposal, canReviewStatus } from "@/lib/rbac";

describe("rbac", () => {
  it("allows only admins to assign elevated roles", () => {
    expect(canAssignRole("ADMIN", "DEAN")).toBe(true);
    expect(canAssignRole("STAFF", "DEAN")).toBe(false);
  });

  it("allows staff to edit draft and revision proposals", () => {
    expect(canEditProposal("STAFF", true, "DRAFT")).toBe(true);
    expect(canEditProposal("STAFF", true, "REVISION_REQUESTED")).toBe(true);
    expect(canEditProposal("STAFF", true, "SUBMITTED")).toBe(false);
  });

  it("maps reviewer roles to their allowed statuses", () => {
    expect(canReviewStatus("OFFICE_HEAD", "OFFICE_REVIEW")).toBe(true);
    expect(canReviewStatus("VICE_DEAN", "VICE_DEAN_REVIEW")).toBe(true);
    expect(canReviewStatus("DEAN", "DEAN_APPROVAL")).toBe(true);
    expect(canReviewStatus("STAFF", "DEAN_APPROVAL")).toBe(false);
  });
});
```

Run:

```bash
npm run test -- src/test/rbac.test.ts
```

Expected: FAIL because `src/lib/rbac.ts` does not exist.

- [ ] **Step 4: Implement RBAC helpers**

Create `src/lib/rbac.ts`:

```ts
import type { ProposalStatus, Role } from "@prisma/client";

const elevatedRoles: Role[] = ["OFFICE_HEAD", "VICE_DEAN", "DEAN", "ADMIN"];

export function canAssignRole(actorRole: Role, targetRole: Role) {
  if (!elevatedRoles.includes(targetRole)) {
    return actorRole === "ADMIN";
  }
  return actorRole === "ADMIN";
}

export function canEditProposal(actorRole: Role, isOwner: boolean, status: ProposalStatus) {
  return actorRole === "STAFF" && isOwner && ["DRAFT", "REVISION_REQUESTED"].includes(status);
}

export function canReviewStatus(actorRole: Role, status: ProposalStatus) {
  const allowed: Partial<Record<Role, ProposalStatus[]>> = {
    OFFICE_HEAD: ["OFFICE_REVIEW"],
    VICE_DEAN: ["VICE_DEAN_REVIEW"],
    DEAN: ["DEAN_APPROVAL"],
    ADMIN: ["OFFICE_REVIEW", "VICE_DEAN_REVIEW", "DEAN_APPROVAL"],
  };

  return allowed[actorRole]?.includes(status) ?? false;
}
```

Run:

```bash
npm run test -- src/test/rbac.test.ts
```

Expected: PASS.

- [ ] **Step 5: Write workflow transition tests**

Create `src/test/workflow.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getNextStatuses } from "@/lib/workflow";

describe("proposal workflow", () => {
  it("moves draft proposals to submitted", () => {
    expect(getNextStatuses("DRAFT", "STAFF")).toEqual(["SUBMITTED"]);
  });

  it("allows office heads to evaluate or request revision", () => {
    expect(getNextStatuses("OFFICE_REVIEW", "OFFICE_HEAD")).toEqual(["REVISION_REQUESTED", "EVALUATED"]);
  });

  it("allows vice dean to forward to dean approval or reject", () => {
    expect(getNextStatuses("VICE_DEAN_REVIEW", "VICE_DEAN")).toEqual(["DEAN_APPROVAL", "REJECTED"]);
  });

  it("allows dean final decision", () => {
    expect(getNextStatuses("DEAN_APPROVAL", "DEAN")).toEqual(["APPROVED", "REJECTED"]);
  });
});
```

Run:

```bash
npm run test -- src/test/workflow.test.ts
```

Expected: FAIL because `src/lib/workflow.ts` does not exist.

- [ ] **Step 6: Implement workflow helper**

Create `src/lib/workflow.ts`:

```ts
import type { ProposalStatus, Role } from "@prisma/client";

const transitions: Partial<Record<ProposalStatus, Partial<Record<Role, ProposalStatus[]>>>> = {
  DRAFT: {
    STAFF: ["SUBMITTED"],
  },
  SUBMITTED: {
    STAFF: ["CANCELLED"],
    OFFICE_HEAD: ["OFFICE_REVIEW"],
  },
  OFFICE_REVIEW: {
    OFFICE_HEAD: ["REVISION_REQUESTED", "EVALUATED"],
    ADMIN: ["REVISION_REQUESTED", "EVALUATED"],
  },
  REVISION_REQUESTED: {
    STAFF: ["SUBMITTED", "CANCELLED"],
  },
  EVALUATED: {
    OFFICE_HEAD: ["VICE_DEAN_REVIEW"],
    ADMIN: ["VICE_DEAN_REVIEW"],
  },
  VICE_DEAN_REVIEW: {
    VICE_DEAN: ["DEAN_APPROVAL", "REJECTED"],
    ADMIN: ["DEAN_APPROVAL", "REJECTED"],
  },
  DEAN_APPROVAL: {
    DEAN: ["APPROVED", "REJECTED"],
    ADMIN: ["APPROVED", "REJECTED"],
  },
};

export function getNextStatuses(status: ProposalStatus, role: Role) {
  return transitions[status]?.[role] ?? [];
}

export function canTransition(status: ProposalStatus, role: Role, nextStatus: ProposalStatus) {
  return getNextStatuses(status, role).includes(nextStatus);
}
```

Run:

```bash
npm run test -- src/test/workflow.test.ts
```

Expected: PASS.

- [ ] **Step 7: Run all domain tests and commit**

Run:

```bash
npm run test
npm run typecheck
```

Expected: all tests and typecheck pass.

Commit:

```bash
git add src/lib/auth-policy.ts src/lib/rbac.ts src/lib/workflow.ts src/test/auth-policy.test.ts src/test/rbac.test.ts src/test/workflow.test.ts
git commit -m "feat: add WI-FBA auth policy and workflow rules"
```

Expected: one commit with tested domain helpers.

## Task 5: Add Auth.js Configuration

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Create Auth.js configuration**

Create `src/lib/auth.ts`:

```ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { env, getInitialAdminEmails } from "@/lib/env";
import { getBootstrapRole, isAllowedUniversityEmail } from "@/lib/auth-policy";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
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
    async signIn({ user, profile }) {
      const email = user.email ?? profile?.email;
      if (!email || !isAllowedUniversityEmail(email, env.ALLOWED_GOOGLE_DOMAIN)) {
        return false;
      }

      const googleAccountId = profile?.sub;
      if (!googleAccountId) {
        return false;
      }

      const role = getBootstrapRole(email, getInitialAdminEmails());

      await prisma.user.upsert({
        where: { email: email.toLowerCase() },
        update: {
          googleAccountId,
          name: user.name ?? email,
          imageUrl: user.image,
          role,
          isActive: true,
          lastLoginAt: new Date(),
        },
        create: {
          googleAccountId,
          email: email.toLowerCase(),
          name: user.name ?? email,
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
        const user = await prisma.user.findUnique({ where: { email: token.email.toLowerCase() } });
        token.role = user?.role ?? "STAFF";
        token.departmentId = user?.departmentId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.departmentId = token.departmentId as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
});
```

- [ ] **Step 2: Add NextAuth type augmentation**

Create `src/types/next-auth.d.ts`:

```ts
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
```

- [ ] **Step 3: Create auth route handler**

Create `src/app/api/auth/[...nextauth]/route.ts`:

```ts
export { handlers as GET, handlers as POST } from "@/lib/auth";
```

- [ ] **Step 4: Verify auth config compiles**

Run:

```bash
npm run typecheck
```

Expected: TypeScript passes. If the installed Auth.js version exposes different handler exports, adjust only the import/export shape to match installed package docs while preserving the policy logic.

- [ ] **Step 5: Commit auth configuration**

Run:

```bash
git add src/lib/auth.ts src/app/api/auth/[...nextauth]/route.ts src/types/next-auth.d.ts
git commit -m "feat: configure Google authentication policy"
```

Expected: one commit with Google auth configuration.

## Task 6: Add Responsive App Shell and Core Pages

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Create: `src/app/(public)/privacy/page.tsx`
- Create: `src/app/(auth)/signin/page.tsx`
- Create: `src/app/(app)/dashboard/page.tsx`
- Create: `src/app/(app)/onboarding/page.tsx`
- Create: `src/components/app-shell.tsx`
- Create: `src/components/sign-in-button.tsx`

- [ ] **Step 1: Create sign-in button component**

Create `src/components/sign-in-button.tsx`:

```tsx
"use client";

import { signIn } from "next-auth/react";

export function SignInButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="inline-flex min-h-11 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
    >
      เข้าสู่ระบบด้วย Google Account มหาวิทยาลัย
    </button>
  );
}
```

- [ ] **Step 2: Create responsive app shell**

Create `src/components/app-shell.tsx`:

```tsx
import Link from "next/link";
import { ClipboardList, LayoutDashboard, Settings, Users } from "lucide-react";

const navigation = [
  { href: "/dashboard", label: "ภาพรวม", icon: LayoutDashboard },
  { href: "/proposals", label: "ข้อเสนอ", icon: ClipboardList },
  { href: "/admin/users", label: "ผู้ใช้", icon: Users },
  { href: "/admin/settings", label: "ตั้งค่า", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Link href="/dashboard" className="text-lg font-semibold">
            WI-FBA
          </Link>
          <nav className="flex gap-2 overflow-x-auto" aria-label="เมนูหลัก">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 3: Update global layout**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WI-FBA",
  description: "ระบบบริหารจัดการข้อเสนอปรับปรุงการทำงาน คณะบริหารธุรกิจ",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Create public sign-in page**

Create `src/app/(auth)/signin/page.tsx`:

```tsx
import Link from "next/link";
import { SignInButton } from "@/components/sign-in-button";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-md border bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">WI-FBA</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">เข้าสู่ระบบ</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          ระบบนี้สงวนสิทธิ์สำหรับบุคลากรมหาวิทยาลัยที่ใช้บัญชี Google ภายใต้โดเมน rmutsv.ac.th เท่านั้น
        </p>
        <div className="mt-6">
          <SignInButton />
        </div>
        <Link href="/privacy" className="mt-5 inline-block text-sm text-slate-600 underline underline-offset-4">
          ประกาศความเป็นส่วนตัว
        </Link>
      </section>
    </main>
  );
}
```

- [ ] **Step 5: Create privacy notice page**

Create `src/app/(public)/privacy/page.tsx`:

```tsx
export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-slate-900">
      <h1 className="text-2xl font-semibold">ประกาศความเป็นส่วนตัว WI-FBA</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
        <p>
          ระบบ WI-FBA เก็บรวบรวมและใช้ข้อมูลส่วนบุคคลเท่าที่จำเป็นเพื่อยืนยันตัวตน กำหนดสิทธิ์การใช้งาน จัดการข้อเสนอปรับปรุงงาน รายงานผล และตรวจสอบย้อนหลังตามภารกิจของคณะบริหารธุรกิจ
        </p>
        <p>
          ข้อมูลที่ใช้ประกอบด้วยชื่อ อีเมล รูปโปรไฟล์จาก Google หน่วยงาน บทบาทการใช้งาน ประวัติการเข้าสู่ระบบ และประวัติการดำเนินการในระบบ
        </p>
        <p>
          ผู้ใช้งานสามารถติดต่อผู้ดูแลระบบของคณะเพื่อขอตรวจสอบหรือแก้ไขข้อมูลส่วนบุคคลตามกระบวนการของมหาวิทยาลัย
        </p>
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Create dashboard and onboarding shell pages**

Create `src/app/(app)/dashboard/page.tsx`:

```tsx
import { AppShell } from "@/components/app-shell";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="grid gap-4 md:grid-cols-3">
        <section className="rounded-md border bg-white p-4">
          <p className="text-sm text-slate-500">ข้อเสนอทั้งหมด</p>
          <p className="mt-2 text-3xl font-semibold">0</p>
        </section>
        <section className="rounded-md border bg-white p-4">
          <p className="text-sm text-slate-500">รอตรวจสอบ</p>
          <p className="mt-2 text-3xl font-semibold">0</p>
        </section>
        <section className="rounded-md border bg-white p-4">
          <p className="text-sm text-slate-500">อนุมัติแล้ว</p>
          <p className="mt-2 text-3xl font-semibold">0</p>
        </section>
      </div>
    </AppShell>
  );
}
```

Create `src/app/(app)/onboarding/page.tsx`:

```tsx
import { AppShell } from "@/components/app-shell";

export default function OnboardingPage() {
  return (
    <AppShell>
      <section className="max-w-2xl rounded-md border bg-white p-5">
        <h1 className="text-xl font-semibold">เลือกหน่วยงานสังกัด</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          ผู้ใช้บัญชี rmutsv.ac.th จะได้รับบทบาทเริ่มต้นเป็นเจ้าหน้าที่ และเลือกหน่วยงานสังกัดได้ด้วยตนเอง
        </p>
      </section>
    </AppShell>
  );
}
```

Replace `src/app/page.tsx` with:

```tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/dashboard");
}
```

- [ ] **Step 7: Verify UI compiles responsively**

Run:

```bash
npm run typecheck
npm run build
```

Expected: typecheck and build pass.

- [ ] **Step 8: Commit app shell**

Run:

```bash
git add src/app src/components
git commit -m "feat: add WI-FBA responsive app shell"
```

Expected: one commit with UI shell and public pages.

## Task 7: Add CI, README, and Branch Strategy

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `README.md`
- Create: `docs/branch-strategy.md`

- [ ] **Step 1: Create CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma client
        run: npm run prisma:generate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/wi_fba?schema=public

      - name: Typecheck
        run: npm run typecheck

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm run test

      - name: Build
        run: npm run build
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/wi_fba?schema=public
          AUTH_SECRET: ci-secret
          AUTH_GOOGLE_ID: ci-google-id
          AUTH_GOOGLE_SECRET: ci-google-secret
          NEXTAUTH_URL: http://localhost:3000
          ALLOWED_GOOGLE_DOMAIN: rmutsv.ac.th
          INITIAL_ADMIN_EMAILS: theepakorn.n@rmutsv.ac.th
```

- [ ] **Step 2: Create README**

Create `README.md`:

```md
# WI-FBA

WI-FBA is a web application for managing work improvement proposals for the Faculty of Business Administration, Rajamangala University of Technology Srivijaya.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- Auth.js / NextAuth with Google provider
- GitHub Actions

## Authentication Policy

WI-FBA uses Google Login only. Users must sign in with an account under `rmutsv.ac.th`.

Initial admin:

- `theepakorn.n@rmutsv.ac.th`

Default user behavior:

- First login creates an active user account.
- Default role is `STAFF`.
- Users select their own department during onboarding.
- Elevated roles are assigned by admins only.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run prisma:generate
npm run dev
```

Open `http://localhost:3000`.

## Required Environment Variables

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/wi_fba?schema=public"
AUTH_SECRET="replace-with-openssl-rand-base64-32"
AUTH_GOOGLE_ID="replace-with-google-oauth-client-id"
AUTH_GOOGLE_SECRET="replace-with-google-oauth-client-secret"
NEXTAUTH_URL="http://localhost:3000"
ALLOWED_GOOGLE_DOMAIN="rmutsv.ac.th"
INITIAL_ADMIN_EMAILS="theepakorn.n@rmutsv.ac.th"
```

## Verification

```bash
npm run verify
```

## Documentation

- Design spec: `docs/superpowers/specs/2026-05-18-wi-fba-mvp-design.md`
- Foundation plan: `docs/superpowers/plans/2026-05-18-wi-fba-foundation.md`
- Branch strategy: `docs/branch-strategy.md`
```

- [ ] **Step 3: Create branch strategy documentation**

Create `docs/branch-strategy.md`:

```md
# Branch Strategy

WI-FBA uses a simple GitHub flow.

## Branches

- `main`: stable branch for reviewed work
- `feature/<short-name>`: feature implementation branches
- `fix/<short-name>`: bug fix branches
- `docs/<short-name>`: documentation branches

## Rules

1. Work in a branch instead of committing directly to `main` after the initial foundation is created.
2. Open a pull request for each feature or fix.
3. Require CI to pass before merging.
4. Use squash merge for feature branches when the branch has many small implementation commits.
5. Keep PRs focused on one feature or one fix.

## Commit Prefixes

- `feat:` user-facing feature
- `fix:` bug fix
- `chore:` tooling or repository maintenance
- `docs:` documentation
- `test:` test-only change
- `refactor:` behavior-preserving code change
```

- [ ] **Step 4: Verify documentation and CI syntax**

Run:

```bash
npm run verify
```

Expected: typecheck, lint, tests, Prisma generation, and build pass.

- [ ] **Step 5: Commit docs and CI**

Run:

```bash
git add .github/workflows/ci.yml README.md docs/branch-strategy.md
git commit -m "docs: add WI-FBA setup and CI guidance"
```

Expected: one commit with CI and documentation.

## Task 8: Final Verification and Push

**Files:**
- Verify all changed files

- [ ] **Step 1: Run full verification**

Run:

```bash
npm run verify
git status --short
git log --oneline -8
```

Expected:

- `npm run verify` passes
- working tree is clean
- recent commits show scaffold, dependencies, data model, auth policy, app shell, docs, and CI

- [ ] **Step 2: Push to GitHub**

Run:

```bash
git push origin main
```

Expected: `main` on `theepakorn-ux/wi-fba` contains the foundation app.

- [ ] **Step 3: Confirm CI status**

Check GitHub Actions for the pushed commit.

Expected: CI workflow starts. If CI fails, inspect the failing command and fix the exact file causing failure before continuing to Phase 2.

## Self-Review

Spec coverage:

- Authentication policy: covered by Tasks 3, 4, and 5.
- Initial admin `theepakorn.n@rmutsv.ac.th`: covered by Tasks 3, 4, 5, and 7.
- Data model: covered by Task 3.
- Workflow status transitions: covered by Task 4.
- Responsive UX foundation: covered by Task 6.
- Browser compatibility verification foundation: covered by Task 7 CI and Task 8 final verification; full cross-browser Playwright checks belong in Phase 2 when interactive pages exist.
- PDPA privacy notice foundation: covered by Task 6.
- GitHub and environment setup: covered by Tasks 1, 2, 7, and 8.

Placeholder scan:

- This plan uses concrete files, commands, values, and code blocks.
- Open product decisions from the design spec are not implemented in this foundation phase because they are reserved for later feature plans.

Type consistency:

- Roles and proposal statuses match the Prisma enums.
- Auth policy helpers return Prisma `Role` values.
- Workflow tests use Prisma `ProposalStatus` values defined in schema.
