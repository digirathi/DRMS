> Historical assessment. Supabase has since been implemented; see [SUPABASE-IMPLEMENTATION.md](SUPABASE-IMPLEMENTATION.md) for current status.

# DigiRathi HRMS — Supabase backend assessment

Checked on 20/10/2026. Project creation and assessment are complete; application migration is not yet implemented.

## Created project

| Item | Verified value |
| --- | --- |
| Name | digirathi-hrms |
| Organization | demo02@example.test's Org |
| Region | Mumbai — ap-south-1 |
| Project reference | rtcvneqwysksqijexbir |
| Dashboard | https://supabase.com/dashboard/project/rtcvneqwysksqijexbir |
| API URL | https://rtcvneqwysksqijexbir.supabase.co |
| State | ACTIVE_HEALTHY |
| PostgreSQL | 17.11 |
| Database timezone | UTC |
| Application tables in public | 0 |
| Auth users | 0 |
| Storage buckets | 0 |
| Edge Functions | 0 |
| pg_cron enabled | No |
| Security advisor findings | None reported on the empty project; this is not a completed application security review. |

No application schema, storage access, email jobs or employee accounts were created during this assessment. The website still reads and writes its existing local SQLite backend. Project creation does not automatically connect or migrate the website.

## What the local website currently has

The installed Node.js service uses `node:sqlite` and synchronous SQLite transactions. Its 17 application tables cover employees, local accounts/sessions, invitations, attendance policies, attendance/corrections, leave policies/balances/requests/absence, immutable audit history, salary slips and email delivery.

Read-only record counts found no real employees, accounts, attendance, leave requests, salary slips or queued messages. Only two default leave types and one reminder configuration exist. Sample people seen in Explore demo are browser demonstration data and must not be imported as real employees.

This makes a fresh Supabase Auth setup possible without migrating active employee passwords. If real users are added before migration, repeat this check and plan their account transition. The existing service uses scrypt password hashes; do not assume those can be imported into Supabase Auth. Supabase's documented hash import supports bcrypt and Argon2. Use an approved invitation/reset or rolling migration flow instead.

## Required Supabase services

| Service | What to add | Why |
| --- | --- | --- |
| Auth | Email/password sign-in, server-managed onboarding, invitation/first-login password setup, password recovery, session verification, approved redirect URLs | Replace custom account/password/session storage |
| Postgres | Employee records, attendance, leave, payroll, assets, help desk, settings and audit tables | Save all real application workflows centrally |
| Row Level Security | Explicit ownership and administrator policies; column separation for identity, access and pay/bank data | Enforce the three access types at the database boundary |
| Private Storage | Profile images, company branding, optional salary PDFs and help-desk attachments | Replace temporary browser-only file URLs |
| Server-side operations | Authenticated API/RPC transactions for punches, corrections, leave decisions, quota assignment and payroll publication | Preserve validation, audit and email queue writes atomically |
| Cron and email delivery | Monthly reminder producer and persistent outbox worker | Send scheduled notifications independently of the user's local computer |

Realtime is optional for live queue refreshes. Vectors/AI and a manager role are not required.

## Database mapping

Names below are proposed design names, not tables already created in Supabase.

| Current implementation | Supabase target | Required work |
| --- | --- | --- |
| employees | employees, employee_access, employee_compensation | Link `auth.users.id` to employee identity; retain existing employee codes separately; separate directory fields from access and salary fields |
| accounts, sessions, invitations | Supabase Auth + onboarding state | Remove duplicated password/session storage after cutover; retain a protected first-login setup state if temporary passwords remain part of onboarding |
| policies | attendance_policies, office_locations, weekend_schedules, company_settings | Effective-dated settings; saved weekend choices; validated GPS/network settings |
| attendance | attendance | DATE workday, TIMESTAMPTZ punches, one employee/day record, one open shift, version checks |
| corrections | attendance_corrections | Own requests; eligible administrator decisions; original/proposed snapshots and optimistic concurrency |
| leave_types | leave_types | Preserve the General/Advanced policy matrix and annual lump-sum invariant; no demographic eligibility fields |
| leave_balances | leave_balances, leave_policy_assignments | Explicit annual assignment and proration with reason and Change Summary Preview |
| leave_requests, leave_absence | leave_requests, leave_absence | Preserve reservations, approval conflicts, cancellation restoration and ON_LEAVE markers |
| audit, LeaveAuditLog | audit_log, leave_audit_log | Append-only for application roles; capture actor, timestamp, action and before/after detail |
| salary_slips | salary_slips, payroll_runs | Reviewed drafts, immutable finalized snapshots, employee/cycle uniqueness and source-record consistency |
| Detailed structure/bank pages — not connected in real mode | salary_structures, salary_structure_assignments, employee_bank_accounts, bank_change_requests | Add effective-dated structure editing and private audited bank workflows; avoid exposing pay/bank data through employee directory queries |
| email_outbox, notification_settings, onboarding_mail | email_outbox, notification_settings, onboarding_deliveries | Idempotent event/recipient keys, retries, delivery history, recipient eligibility and secret-free errors |
| Assets — demo-only | assets, asset_assignments, asset_events | Unique serial numbers, one active assignee, return condition and maintenance transitions |
| Help Desk — demo-only | tickets, ticket_comments, ticket_attachments | Ownership, permitted assignment, internal notes, status transitions and attachment controls |
| Directory — integration notice in real mode | Safe directory query over employee profiles | All active employees can see name, designation, calling number and permitted profile image; exclude compensation, bank details and private HR notes |
| Reports — integration notice in real mode | Authorized reporting queries / security-invoker views | Attendance, leave and payroll reports restricted to permitted records; validate export scope |
| Holiday calendar / profile images / branding — not connected in real mode | holidays, employee_profiles, company_settings + Storage | Persist calendar, avatar and organization image preferences and connect them to existing calculations/UI |

The removed Documents and Performance pages do not need new modules or tables.

Use UUID primary keys where appropriate, indexed foreign keys, exact NUMERIC values for money/leave fractions, JSONB for versioned snapshots, DATE for workdays and TIMESTAMPTZ for events. Keep stored instants in UTC, calculate company workdays in Asia/Kolkata and format user-facing dates as DD/MM/YYYY.

## Access rules to preserve

| Action | Super Admin | HR Admin | Employee |
| --- | --- | --- | --- |
| Company settings, access-role assignment and administrator record changes | Allowed | Not allowed | Not allowed |
| Submit own leave / attendance correction | Allowed | Allowed | Allowed |
| Review regular employee leave / corrections | Allowed | Allowed for another employee | Not allowed |
| Review HR Admin / Super Admin leave or corrections | Allowed | Not allowed, including own | Not allowed |
| Change own HR identity or increase own leave quota | Allowed through audited admin workflow | Not allowed | Not allowed |
| Prepare/finalize salary slips | Allowed | Not allowed by current saved workflow | Not allowed |
| Read a finalized personal payslip | Own and permitted administrative records | Own and permitted regular-employee records | Own only |
| Directory | Safe staff directory | Safe staff directory | Safe staff directory |

Manager remains a designation with Employee access. Only SUPER_ADMIN, HR_ADMIN and EMPLOYEE are access roles.

Roles must come from protected database records or administrator-controlled app metadata, never user-editable metadata. Employees cannot update their access role, salary, balance or attendance timestamps directly. Enforce active-account and completed-password-setup checks in both server operations and any Data API policies.

Enable RLS on every exposed application table and grant only required operations. A publishable key does not authorize access on its own. Keep secret/service-role keys server-side. Avoid public buckets for employee files. If a privileged lookup function is necessary, keep it in an unexposed schema, verify the caller, fix its search path, restrict execution and audit its use. Prefer security-invoker functions/views where possible.

## Workflows requiring transactions

- Leave decisions: lock/check pending status and version; check reviewer; block full-day approval where punches exist; update quota/absence; append immutable audit; queue notification in one transaction. A second reviewer gets the existing exact 409 response.
- Leave cancellation: own approved leave requests need an eligible reviewer; preserve used days while awaiting review; approved cancellation restores quota and removes ON_LEAVE records atomically.
- Policy assignment: use the saved annual baseline, explicit selected employees, optional proration, reason and preview. Do not run monthly accrual jobs. Never lower quota beneath used/reserved leave without a separately reviewed supported workflow.
- Clocking and corrections: server timestamps, correct India workday, duplicate/open-shift checks, GPS/network verification and HR self-review protection. Frontend-only checks are insufficient.
- Payroll: preserve reviewed inputs and exact totals; include saved unpaid leave and effective late rules; block unresolved attendance/leave and stale drafts; lock finalized snapshots and queue the employee's secure link once. No automatic bank payment.
- Delivery worker: claim queued messages safely (short transactions and row locks / SKIP LOCKED), send outside the transaction, record accepted/failed status and retry with backoff. Preserve deterministic event keys; SMTP crash recovery cannot guarantee exactly-once delivery.

## Storage design

| Proposed private bucket | Permitted access |
| --- | --- |
| employee-avatars | Employee uploads/replaces own image; active staff reads through controlled authenticated access; administrative overrides follow identity permissions |
| company-branding | Super Admin uploads/replaces; signed-in staff reads |
| salary-slips (only if PDF files are persisted) | Employee's own finalized file or permitted administrator; short-lived authorized URLs |
| helpdesk-attachments | Requester and authorized support administrators, with internal attachments restricted separately |

Validate image/file types and sizes. For own-avatar upsert, policies need SELECT, INSERT and UPDATE with path ownership checks; do not grant arbitrary folder writes. Keep file-object references in database rows and define cleanup behavior before enabling deletion.

## Email and monthly reminder

Supabase Auth SMTP is for account invitations, recovery and authentication messages. Leave decisions and salary notifications still need the application's transactional mail worker/provider; enabling Auth SMTP does not create those business notifications.

Retain the existing private Gmail configuration for the Node worker during the first migration, or implement a separately authenticated Edge Function with a supported email provider. Never put Google app passwords in frontend JavaScript or public SQL tables. Auth's built-in test mail service is unsuitable for general employee delivery; configure custom SMTP and correct Site URL / redirect allowlist for production.

For the agreed reminder, use the company timezone explicitly: 10:00 AM Asia/Kolkata equals 04:30 UTC. A daily producer can check whether the local date has reached the 30th (or February's last day), then insert one month/employee event key. Include all active Employees, HR Admins and Super Admins with completed setup and an unfinalized own slip. Skip already finalized slips and prevent duplicate reminders. Define catch-up after downtime and cancel stale previous-month reminders. Supabase Cron needs pg_cron enabled and the worker still needs a working mail provider.

## Implementation sequence and acceptance checks

1. Add tracked Postgres migrations and local test setup; create schema, constraints, indexes, RLS and transactional operations; run Supabase security/performance advisors. Create migration files with the CLI's migration command rather than inventing filenames.
2. Add Supabase Auth and an authorized first-Super-Admin bootstrap. Keep public self-registration from becoming a way to create staff accounts. Configure redirects/SMTP and test invitation, new password, recovery, sign-out and deactivation.
3. Replace SQLite-specific synchronous queries/transactions with an async Postgres/server adapter. Preserve the existing same-origin API contracts so the UI can transition without a full visual rewrite. Add only pinned dependencies and lockfile updates.
4. Connect employees, attendance, leave, payroll and notification delivery. Run the existing 106 regression tests against a dedicated disposable Postgres test environment and add direct Data API/RLS tests for every role.
5. Implement the missing real assets/help-desk/directory/report/settings/upload workflows. Verify these pages save and reload through Supabase; do not treat existing demo UI as evidence that a backend exists.
6. Test three separate signed-in roles on desktop/mobile and both themes. Test concurrent reviewers, wrong-owner URLs, first-login restrictions, full/half-day leave, cancellation restoration, protected HR records and finalized-slip immutability.
7. Move the website/backend to a public HTTPS host, configure its trusted proxy and observed office IP behavior, set secrets privately, test backups/restoration and only then cut over real usage. Supabase does not replace frontend hosting or automatically adapt the existing Node API.

Project creation, SQL connectivity and the empty-project advisor check have been verified. Schema, Auth configuration, application integration, Storage, Cron, actual employee invitations and cloud email delivery are pending implementation; none are claimed complete here.

## Documentation checked

- https://supabase.com/changelog.md
- https://supabase.com/docs/guides/platform/migrating-to-supabase/auth0 — documented password-hash import support and user mapping
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/storage/security/access-control
- https://supabase.com/docs/guides/auth/auth-smtp
- https://supabase.com/docs/guides/cron
- https://supabase.com/changelog/cbc-tls-ciphers-deprecated
- https://supabase.com/changelog/postgres-15-19-17-11-breaking-changes

The inspected current changelog includes upcoming removal of old TLS 1.2 CBC ciphers. Use supported Node/browser TLS defaults; do not weaken certificate validation. The existing database is a new PostgreSQL 17.11 project, without imported legacy ltree, btree_gist or encrypted data implicated by the inspected upgrade notice.
