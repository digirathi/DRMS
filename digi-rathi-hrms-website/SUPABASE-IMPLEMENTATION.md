# Supabase implementation

Verified 20/10/2026. Project: **digirathi-hrms**, Mumbai (`ap-south-1`), ref `rtcvneqwysksqijexbir`.
[Open Supabase](https://supabase.com/dashboard/project/rtcvneqwysksqijexbir).

## Running the website

Run `node server.js` using Node 24+, then open http://127.0.0.1:4174. The private `%LOCALAPPDATA%\DigiRathi\HRMS\supabase.env` selects Supabase. Create your own first Super Admin through the setup screen on this computer. No sample employees or HR transactions are created. The initial Super Admin is provisioned privately and must replace the temporary password before accessing the dashboard.

Supabase provides Postgres, native Auth, private Storage, the `hrms-api` Edge Function and the scheduled reminder producer. The Node server still serves the website and handles Gmail delivery. Deploying only the static HTML is insufficient. Keep Node online for website access and email delivery; cloud records survive a Node restart. The website is currently local, not publicly deployed.

## Connected workflows

- Three roles: Super Admin, HR Admin and Employee. A Manager designation has Employee access. HR cannot change protected administrator records, approve their own leave/corrections or increase their own leave entitlement.
- Onboarding creates native Supabase Auth accounts, queues unique temporary credentials and requires a password change before dashboard access. Password recovery uses encrypted single-use links with a 30-minute expiry. Opaque HttpOnly sessions retain encrypted native Auth tokens on the server and validate current employee access.
- Attendance: WFO/WFH punches, correction review, saved effective policies, calendar weekends and holidays. No GPS/network verification is claimed without trusted verification evidence.
- Leave: explicit annual quota assignments, paid reservations, approval/rejection, cancellation/restoration and immutable audit. Decisions and salary publishing use transactions and version checks.
- Payroll: saved drafts, review requirements, frozen finalized snapshots, assigned component structures, employee-owned payslips and encrypted bank change review. Finalized slips retain company details/component amounts at publication. This does not transfer money or automatically certify statutory tax/PF calculations.
- Directory and profile/company images, company calendar/settings, assets with assignment history, support tickets with internal/private comments, reports and CSV exports now save to cloud records.
- Leave application/decision and finalized payslip email events use an idempotent outbox. A private worker claims messages, sends through Gmail and marks delivery only after acceptance. Scheduled attendance reminders use 10:00 AM India time on the 30th (February: last day), for active accounts that completed setup and have an unfinalized cycle. Delayed delivery retries while the worker is online; delivery status appears in Settings.

## Email setup still required

Run `configure-gmail.ps1` privately and configure a Gmail/Workspace sender, Google app password and the real employee-accessible `HRMS_PUBLIC_URL`. Do not paste passwords into chat or commit configuration. The existing `.env.local` is preserved. No real test email was sent during this Supabase installation. Without Gmail configuration, email shows Not configured rather than a false Sent status. Account credentials are not returned to the browser. Onboard/re-send only after mail is configured.

## Data and access design

28 tables are in the unexposed `hrms_private` schema. Client roles have no raw table grants, with RLS and explicit deny policies as defense in depth. Authorization runs in the authenticated API against current employee records, never user-editable metadata. Audit and finalized-slip triggers prevent changes. Request mutations use a short transaction/advisory lock, appropriate for this small team, and first-review/version conflict guards.

Four private buckets exist: `employee-avatars` and `company-branding` (1 MB JPG/PNG/WebP, actual file signature checked), plus reserved `salary-slips` (PDF) and `helpdesk-attachments` buckets. Avatar and branding upload/signing are connected. PDF storage and helpdesk attachment uploads are reserved for future implementation; payslip viewing/printing is available in the website.

The browser sends requests only to the same-origin Node API. The private Node gateway token is checked by the Edge Function; the function then validates employee sessions through Supabase Auth. `verify_jwt=false` disables the generic Edge JWT wrapper only: private gateway authentication and app session verification are enforced inside the function. The browser cannot call internal queue routes. A health check verifies Postgres and Auth connectivity. The Node gateway does not fall back to SQLite when cloud access fails.

The private configuration is stored outside the project at `%LOCALAPPDATA%\DigiRathi\HRMS\supabase.env` on the Windows system drive, with inheritance disabled and access restricted to the current user. The F: project drive uses exFAT and cannot enforce Windows ACLs, so it contains no private Supabase configuration. Set `HRMS_SUPABASE_ENV_FILE` to an absolute private file path on other installations, or inject environment variables directly. Do not store secrets on exFAT or in the public project folder. Supabase database/service credentials are available only inside the Edge runtime. Keep the gateway token backed up securely: replacing it without coordinated re-encryption makes stored bank/outbox/session envelopes unreadable. Do not copy it into JavaScript bundles or `supabase-project.json`. For deployment, inject the same values as server secrets, use HTTPS, configure the public origin and review trusted-proxy handling. First-account setup remains loopback-only; complete it locally before deployment.

## Database/deployment source

`supabase/migrations/20261020073401_hrms_cloud_backend.sql` and `20261020074121_hrms_explicit_client_guards.sql` match the applied remote migration versions. `supabase/functions/hrms-api` contains the deployed Edge sources; dependencies are pinned. No CLI build dependencies are needed by Node. Do not replay the existing migrations against the live database blindly.

To inspect application data in SQL Editor, choose/use `hrms_private`; it is deliberately not exposed in the public REST API. Restore production data only from reviewed backups, preserving Auth identities and encryption secrets. The original local SQLite database and changed source are backed up alongside the project before cutover. No local employee records existed at cutover, so no employee-data migration was needed. Switching providers later does not automatically synchronize the two databases.

## Verification

121 automated tests pass, including disposable cloud-API fixtures, ownership/HR restrictions, first-login and recovery, quota restoration, payroll snapshot and stale-draft checks, upload validation, gateway origin/host checks and cloud-outage behavior. Separate live Postgres rollback tests checked table privacy, immutable records, numeric arithmetic and February/India-time reminder deduplication. Live gateway smoke checks confirmed database/Auth health, anonymous rejection, setup readiness and private Data API denial. UI checks covered directory, settings, support, payroll and reports with mobile/light and dark layouts.

The Supabase security advisor returned **no findings** on 20/10/2026. The empty database's unused-index INFO notices are expected before real activity; keep permission/lookup indexes and reassess after workload measurement. [Unused index guidance](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index).

Before public production use, set a real URL/Gmail sender, arrange database backups suitable for the Free plan, monitor quotas, review HTTPS/proxy settings and exercise a real employee onboarding with their consent. Free-plan limits or inactivity pausing can affect availability; the implementation does not promise an uptime SLA.

## Fresh installation update

Demo sign-in, employee/payroll seeds, sample attendance/leave/assets/tickets, the disconnected React scaffold and duplicate source snapshots are removed. Unique login IDs are stored in the private accounts table; first sign-in and Settings can change your own login ID. Normal credential changes verify the current password and revoke all previous app sessions. The ccount_login_credentials migration was applied after the two original migrations. Initial credentials are kept out of source control. Disposable test fixtures remain in tests only.
