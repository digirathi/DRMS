# Digi Rathi HRMS

The website is connected to Supabase Postgres, Auth, private Storage and its Edge API. Use Node.js 24 or newer and run `node server.js` (or `.\serve.ps1`), then open http://127.0.0.1:4174. Create your first Super Admin on this computer; **Explore demo** retains sample workflows separately.

Read [SUPABASE-IMPLEMENTATION.md](SUPABASE-IMPLEMENTATION.md) for the connected scope, access model, deployment requirements, verification and remaining configuration. Attendance, leave, payroll, directory, images, assets, support tickets, reports and settings use saved cloud records in real mode. Manager is a designation with Employee access, not a fourth role.

Read [ONBOARDING-EMAIL.md](ONBOARDING-EMAIL.md) and [EMAIL-NOTIFICATIONS.md](EMAIL-NOTIFICATIONS.md) for Gmail delivery and notifications. Gmail configuration and an employee-accessible website URL are still required before sending onboarding credentials or other emails. Keep all credentials private.

The interface supports mobile and desktop, light/dark themes, DD/MM/YYYY dates and Lucide outline icons. Demo records and preferences are separate from real employee accounts. Real-mode authorization is enforced by the API.

## Run locally

```powershell
node server.js
```

The private `%LOCALAPPDATA%\DigiRathi\HRMS\supabase.env` selects Supabase. The server binds to `127.0.0.1:4174` by default. The Node gateway and Gmail worker are required; this app cannot be deployed as static files alone. Public deployment is separate from this local installation.

## Checks

```powershell
node --test tests/*.test.cjs
```

118 tests passed on 20/10/2026, with additional live database/API verification. Test accounts are disposable and are never seeded into the real project.

## Configuration and backups

Never publish `.env.local`, `.env.supabase.local`, `data/` or backend-only sources through a general static server. Use `server.js`, whose public file allowlist protects them. The Supabase configuration is kept on C: outside the exFAT project drive, with access restricted to your Windows account. The gateway token also encrypts sensitive saved values; preserve it in a private backup and coordinate any rotation.

[LOCAL-BACKEND.md](LOCAL-BACKEND.md) describes the earlier standalone SQLite mode retained for isolated tests and rollback reference. It is not the installed data source. Switching between SQLite and Supabase does not migrate records automatically. The earlier [Supabase assessment](SUPABASE-BACKEND-PLAN.md) is historical; the implementation document is current.
