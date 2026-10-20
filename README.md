# DigiRathi DRMS

HRMS project source, including the current website and its Supabase backend implementation.

## Main application

`digi-rathi-hrms-website/` contains the active HRMS: employee, HR Admin and Super Admin dashboards, attendance, leave, payroll, directory, assets, support, reports and settings.

Use Node.js 24 or newer:

```powershell
cd digi-rathi-hrms-website
npm ci
node server.js
```

Open http://127.0.0.1:4174. Supabase configuration must be supplied privately on a new computer; credentials are intentionally absent from this repository. Read [implementation and setup](digi-rathi-hrms-website/SUPABASE-IMPLEMENTATION.md), [Gmail onboarding](digi-rathi-hrms-website/ONBOARDING-EMAIL.md) and [email notifications](digi-rathi-hrms-website/EMAIL-NOTIFICATIONS.md).

The backend requires the Node gateway plus the Supabase database/Auth/Edge deployment. Static hosting alone is insufficient. Existing local configuration and employee records are not uploaded here. Do not blindly replay migrations against the existing project.

## Separate React scaffold

`attendance-dashboard-react/` preserves the earlier Next.js attendance, leave and payroll scaffold. It is not the production backend of the main website. Its [README](attendance-dashboard-react/README.md) explains its demo-only storage/auth and development checks.

## Verification

```powershell
cd digi-rathi-hrms-website
node --test tests/*.test.cjs
```

The main application had 118 passing tests at the Supabase cutover on 20/10/2026. Project invariants are preserved in `.agents/AGENTS.md`.

## Private files

Credentials, local databases, employee uploads, log files, installed dependencies, generated builds and backup copies are excluded. Install dependencies from the lockfiles. Keep Gmail and Supabase private settings outside version control; each deployment requires its own secure configuration.

## Public source copy

Embedded demonstration identities, contact addresses, banking and statutory identifiers have been replaced with explicit demo placeholders for public sharing. These fixtures are not employee records or valid payment instructions. Private environment settings, live databases and uploads remain excluded. The React `src/data` modules are application source and are included.
