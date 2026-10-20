# HRMS sample service and React modules

This is a separate Next.js scaffold for attendance, leave and payroll. Data is held in memory. `src/db/schema.prisma` describes intended storage but no database client, migrations, real session provider or email service is wired in. It is not the `/api/v1` service expected by the main HTML website.

## Development

Install the declared dependencies with `pnpm install` (lockfile included), then use `pnpm dev --hostname 127.0.0.1`. The root page explains this project's purpose.

Admin pages and API routes fail closed by default. Production rejects all mock identities. For local API development only, explicitly set `HRMS_ENABLE_DEMO_AUTH=true` in a non-production environment and send a JSON `x-user-mock` header with `id`, `name`, and an allowed `role`. Bind the server to loopback only. This is a test fixture, not real authentication. No environment file enabling this mode is supplied.

Before real use, replace this mechanism with a server-verified session and database authorization. Leave requires SUPER_ADMIN; attendance and payroll require SUPER_ADMIN or HR. Add database transactions/version checks and immutable audit storage before multi-instance deployment. Current concurrency checks protect the in-memory demonstration within one process only.

## Verification

```powershell
pnpm exec tsc --noEmit
pnpm build
node --test tests/regressions.cjs
```

Tests cover denied access, duplicate decisions, date-range attendance conflicts, full-day/half-day behavior, rejection validation and quota restoration. Periodic refill retries are disabled; use annual policy assignment.

The main website in `../digi-rathi-hrms-website` contains the reviewed desktop/mobile interface and light/dark theme. This scaffold has been compiled and its core authorization/leave logic tested; it is not a complete production backend.
