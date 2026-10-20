# DigiRathi HRMS website

Fresh, authenticated HRMS interface with mobile/desktop layouts, light/dark themes, DD/MM/YYYY dates and outline icons. No demo workspace or sample HR records are seeded.

Run `npm ci` and `node server.js` using Node 24+, then open http://127.0.0.1:4174. See [SUPABASE-IMPLEMENTATION.md](SUPABASE-IMPLEMENTATION.md) for private cloud configuration, database migrations, API deployment and mail delivery.

The local installation uses Supabase Auth/Postgres. Initial Super Admin credentials are supplied privately; no reusable login or password exists in the source. Temporary initial credentials require a new password before entering the dashboard. You can choose a new login ID at first sign-in and later update your login ID/password from Settings after confirming your current password. Other app sessions are revoked on credential changes. Employee IDs and historical HR ownership stay stable.

After sign-in, configure company details, working days, attendance rules and salary structures, then onboard real employees. Leave balances require explicit annual assignment. Gmail/Workspace sender configuration and an employee-accessible website URL are required for onboarding and notification delivery. See [ONBOARDING-EMAIL.md](ONBOARDING-EMAIL.md) and [EMAIL-NOTIFICATIONS.md](EMAIL-NOTIFICATIONS.md).

## Verification

Run `node --test tests/*.test.cjs`. Tests use disposable fixtures, never the real cloud employees. No real email is sent by tests.

## Private files

The private Supabase gateway/encryption settings live outside the repository at `%LOCALAPPDATA%\DigiRathi\HRMS\supabase.env` on this Windows installation. Preserve that secret securely; it encrypts bank/outbox/session envelopes. Deploy using server environment secrets or an explicit private `HRMS_SUPABASE_ENV_FILE`, never browser code. Run the actual Node server so its public-file allowlist protects backend sources and private runtime data.

The earlier local SQLite mode remains available for isolated use and regression tests. It does not automatically synchronize with Supabase. Public deployment and SMTP setup are separate from running this localhost preview.
