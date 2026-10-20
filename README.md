# DigiRathi HRMS

This repository contains the fresh HRMS website in `digi-rathi-hrms-website/`. It has no demo sign-in, seeded employee profiles, attendance, leave requests, salary records, assets or support tickets. The disconnected React demo and duplicate application snapshots have been removed.

## Run locally

Use Node.js 24 or newer:

```powershell
cd digi-rathi-hrms-website
npm ci
node server.js
```

Open http://127.0.0.1:4174. The existing installation uses a private Supabase configuration outside the repository. On another machine, supply the server environment settings described in [Supabase setup](digi-rathi-hrms-website/SUPABASE-IMPLEMENTATION.md). Static hosting alone is insufficient: the Node gateway and deployed Supabase API are required for cloud mode.

## First account and credentials

When the database has no accounts, the loopback-only setup page creates the first Super Admin. Choose your own login ID, email and password. An initial temporary password supplied privately by the administrator must be changed before dashboard access. Login IDs and passwords can later be changed in **Settings → Change login ID & password**, after verifying the current password. Credentials are never committed to this repository.

Exactly three access roles exist: Super Admin, HR Admin and Employee. Manager remains a designation with Employee access. Empty sections fill only after authorized users save real records. Default policy/configuration templates do not grant leave balances or create employee transactions.

## Checks

```powershell
cd digi-rathi-hrms-website
node --test tests/*.test.cjs
```

Automated fixtures are disposable and use `example.test`; they are not application seed data. Private configuration, databases, runtime uploads, logs, dependency folders and local restore backups are excluded from Git.
