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
cp .env.example .env
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
