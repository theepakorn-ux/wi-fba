# WI-FBA MVP Design

Date: 2026-05-18
Repository: theepakorn-ux/wi-fba
Project: Work Improvement Management System for the Faculty of Business Administration

## 1. Purpose

WI-FBA is a web application for managing work improvement proposals within the Faculty of Business Administration, Rajamangala University of Technology Srivijaya. The first release focuses on secure university-only access, proposal submission, review, approval, reporting, and administration of users and departments.

The system is designed for internal university personnel and must support traceability, role-based access, PDPA-aware data handling, and responsive use across modern browsers.

## 2. MVP Scope

The first version includes these modules:

1. Authentication and registration
2. Work improvement proposal management
3. Review, evaluation, and approval workflow
4. Reports and status tracking
5. User, role, and department administration

Out of scope for the first implementation unless added later:

- External public registration
- Student-facing usage
- Complex document signing
- Multi-faculty tenant separation
- Advanced BI dashboards
- Mobile native apps

## 3. Recommended Tech Stack

- Frontend and backend: Next.js App Router with TypeScript
- Styling: Tailwind CSS
- Database: PostgreSQL
- ORM: Prisma
- Authentication: Auth.js / NextAuth with Google provider
- Hosting options: Vercel for application hosting, Supabase or managed PostgreSQL for database
- Source control: GitHub
- CI: GitHub Actions

This stack supports fast development, strong TypeScript safety, and a simple deployment path while remaining maintainable for a small university development team.

## 4. Authentication Policy

The approved authentication policy is:

Google Login Only + Allow Domain rmutsv.ac.th + Automatic Staff Approval + Self-Selected Department + Admin-Managed Elevated Roles

Detailed rules:

1. Users must sign in with Google OAuth/OpenID Connect.
2. Only email addresses under the `rmutsv.ac.th` domain are allowed.
3. On first login, the system automatically creates an active user account.
4. The default role is `STAFF`.
5. Users may choose their own department during onboarding.
6. Users may not assign themselves elevated roles.
7. The roles `OFFICE_HEAD`, `VICE_DEAN`, `DEAN`, and `ADMIN` can only be assigned by an existing admin.
8. Every role or department change must be recorded in an audit log.
9. If a non-allowed email domain attempts to sign in, access is denied with a generic, polite message.
10. The system should request only the minimum Google scopes required for identity: email, name, profile image, and Google account identifier.

Security rationale: automatic approval is acceptable because access is restricted to university Google accounts, but elevated role assignment must remain admin-controlled to prevent privilege escalation.

## 5. Initial Admin Bootstrap

Because elevated roles are admin-managed, the system needs a controlled way to create the first administrator.

Approved initial admin:

- `theepakorn.n@rmutsv.ac.th`

Recommended approach:

1. Define `INITIAL_ADMIN_EMAILS=theepakorn.n@rmutsv.ac.th` in the environment during initial setup.
2. Each email in `INITIAL_ADMIN_EMAILS` must still be under `rmutsv.ac.th`.
3. When a matching user signs in for the first time, the system assigns `ADMIN` automatically.
4. After the first production setup is complete, the deployment owner should remove or freeze the bootstrap list.
5. Any later admin assignment must be performed from the admin screen and recorded in `AuditLog`.

This avoids a deadlock where no user can assign the first admin role.

## 6. User Roles

The MVP roles are:

- `STAFF`: Creates, edits, submits, and tracks proposals.
- `OFFICE_HEAD`: Reviews proposals, requests revisions, and records evaluation results.
- `VICE_DEAN`: Reviews evaluated proposals and recommends approval or rejection.
- `DEAN`: Performs final approval or rejection.
- `ADMIN`: Manages users, roles, departments, settings, and audit review.

## 7. Proposal Workflow

The approved workflow is:

Staff submits proposal -> Office head reviews and evaluates -> Vice dean reviews -> Dean approves -> Reports show results

Recommended status model:

- `DRAFT`: Staff is preparing a proposal.
- `SUBMITTED`: Staff has submitted the proposal.
- `OFFICE_REVIEW`: Office head is reviewing the proposal.
- `REVISION_REQUESTED`: Proposal is returned to staff for correction.
- `EVALUATED`: Office head has completed evaluation.
- `VICE_DEAN_REVIEW`: Vice dean is reviewing the evaluated proposal.
- `DEAN_APPROVAL`: Dean is reviewing for final decision.
- `APPROVED`: Proposal is approved.
- `REJECTED`: Proposal is rejected.
- `CANCELLED`: Proposal is cancelled by an authorized user before completion.

Key workflow rules:

1. Staff can create, edit, delete, and submit their own draft proposals.
2. Staff can edit submitted proposals only when revision is requested.
3. Office heads can review proposals assigned to their scope and enter evaluation comments/results.
4. Vice deans can review evaluated proposals and forward them to the dean.
5. The dean makes the final approval or rejection decision.
6. Reviewers should add comments and decisions but should not directly alter the original proposal content.
7. Every status transition must create a status history record.
8. Every decision must record actor, timestamp, previous status, new status, comments, and optional evaluation fields.

## 8. Core Data Model

Initial entities:

- `User`
- `Role`
- `Department`
- `ImprovementProposal`
- `ProposalReview`
- `ProposalStatusHistory`
- `AuditLog`

Possible later entities:

- `Attachment`
- `Notification`
- `ReportExport`
- `PrivacyConsentRecord`

Essential fields:

`User`

- id
- googleAccountId
- email
- name
- imageUrl
- role
- departmentId
- isActive
- lastLoginAt
- createdAt
- updatedAt

`Department`

- id
- name
- code
- isActive
- createdAt
- updatedAt

`ImprovementProposal`

- id
- title
- problemStatement
- proposedImprovement
- expectedBenefit
- submitterId
- departmentId
- status
- submittedAt
- createdAt
- updatedAt

`ProposalReview`

- id
- proposalId
- reviewerId
- reviewStage
- decision
- comment
- evaluationScore
- evaluationSummary
- createdAt

`ProposalStatusHistory`

- id
- proposalId
- fromStatus
- toStatus
- actorId
- comment
- createdAt

`AuditLog`

- id
- actorId
- action
- entityType
- entityId
- metadata
- createdAt

## 9. Access Control

Access control must be enforced on the server side, not only in the UI.

Recommended rules:

1. Unauthenticated users can only access login and public privacy pages.
2. Users with disallowed domains cannot access the application.
3. Staff can access their own proposals and general report summaries allowed by policy.
4. Office heads can access proposals in their review scope.
5. Vice deans and deans can access proposals at their approval stages.
6. Admins can manage users, roles, departments, and system configuration.
7. Elevated role assignment requires admin permission.
8. Direct API access must re-check session, role, ownership, and workflow state.

## 10. PDPA and Data Governance

The system handles personal data and should include PDPA-aware controls from the first release.

Required design items:

1. Privacy Notice on login/onboarding explaining collection, use, disclosure, retention, and contact channel.
2. Data minimization: collect only what is required for identity, workflow, and auditability.
3. Purpose limitation: use personal data for authentication, authorization, workflow management, reporting, and audit only.
4. Retention policy: keep workflow and audit records for the faculty's required administrative period, then delete or anonymize when no longer necessary.
5. Access control: restrict personal data visibility by role and operational need.
6. Auditability: record important actions such as login, role changes, proposal submission, review decisions, and approval actions.
7. Data subject rights process: define how users can request access, correction, or deletion where legally appropriate.
8. Vendor review: document use of Google OAuth, hosting provider, and database provider as external processors or service providers.

## 11. Browser Compatibility

The application should support current versions of:

- Safari
- Chrome
- Microsoft Edge

Implementation guidance:

1. Use Next.js supported browser targets and avoid unsupported browser APIs unless tested.
2. Use Tailwind CSS with modern browser support in mind.
3. Test authentication flow and responsive pages in Chromium and WebKit before release.
4. Avoid design or JavaScript features that behave inconsistently across Safari and Chromium without fallback.

## 12. Responsive UX Requirements

The application must be usable on desktop, tablet, and mobile browsers.

Required responsive behavior:

1. Mobile-first layout.
2. Collapsible navigation for small screens.
3. Responsive proposal forms with readable field spacing.
4. Tables should adapt using stacked cards, horizontal scroll, or priority columns on small screens.
5. Approval actions must remain easy to reach on mobile.
6. Text must not overflow buttons, cards, menus, or table cells.
7. Dashboard and report filters must work on mobile and desktop.

## 13. Reporting Requirements

MVP reports should include:

1. Proposal counts by status.
2. Proposal counts by department.
3. Proposal counts by date range.
4. Approved and rejected proposals.
5. Pending items by approval stage.
6. User-level tracking for proposals created by the current staff user.

Exports can be deferred unless required in the first release.

## 14. Error Handling

Recommended behavior:

1. Authentication failures should use generic messages that do not expose whether an account exists.
2. Domain denial should clearly state that only university accounts are allowed.
3. Unauthorized workflow actions should be blocked and logged.
4. Failed database operations should show user-safe messages and log technical details server-side.
5. Validation errors should be shown near the relevant form fields.

## 15. Testing Strategy

Initial verification should include:

1. Unit tests for workflow status transitions and access-control helpers.
2. Integration tests for proposal creation, submission, review, and approval.
3. Authentication tests for allowed and disallowed domains.
4. Basic UI tests for main flows.
5. Responsive checks for mobile, tablet, and desktop viewports.
6. Browser checks in Chromium and WebKit.
7. CI checks for typecheck, lint, tests, and Prisma validation.

## 16. Repository and Environment Setup

After this design is approved, implementation should proceed with:

1. Clone or initialize the GitHub repository `theepakorn-ux/wi-fba`.
2. Scaffold Next.js with TypeScript and Tailwind CSS.
3. Add Prisma and PostgreSQL configuration.
4. Add Auth.js / NextAuth Google provider configuration.
5. Add `.env.example` with variables such as:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `AUTH_GOOGLE_ID`
   - `AUTH_GOOGLE_SECRET`
   - `ALLOWED_GOOGLE_DOMAIN=rmutsv.ac.th`
   - `INITIAL_ADMIN_EMAILS=theepakorn.n@rmutsv.ac.th`
6. Add README with setup instructions for MacBook Pro M1, VS Code, GitHub, and deployment.
7. Add GitHub Actions for CI.
8. Add branch strategy documentation.

## 17. Open Decisions Before Implementation

The following decisions should be confirmed before coding begins:

1. Exact production hosting choice: Vercel plus Supabase, Render, or another managed cloud.
2. Whether proposal attachments are required in MVP.
3. Whether email notifications are required in MVP.
4. Whether report export to Excel/PDF is required in MVP.
5. Official retention period for proposal and audit records.

## 18. Approval Gate

This design is ready for user review. After approval, the next step is to create a detailed implementation plan before scaffolding the application.
