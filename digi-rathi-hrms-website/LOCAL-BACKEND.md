# Local attendance backend

Start with **Node.js 24 or newer** using `node server.js` or `serve.ps1`. The website and API share http://127.0.0.1:4174. No external database is needed. Gmail onboarding emails use Nodemailer; install locked dependencies with `npm ci --omit=dev --ignore-scripts` in a fresh checkout.

## First use

1. Open the website and exit demo mode if it is open. Create the first Super Admin account on the setup screen, entering your own password. No default credentials or sample employees are installed.
2. Open **Employees → Onboard employee**. Super Admin can assign **HR Admin** or **Employee**. HR Admin can create Employee accounts only. A Manager designation still has Employee access.
3. Configure Gmail as described in [ONBOARDING-EMAIL.md](ONBOARDING-EMAIL.md). Onboarding sends the employee ID, login email, website link and a unique temporary password. Employees must set a new password before accessing their dashboard. Missing/failed email is shown explicitly and can be resent.
4. On **Attendance**, Super Admin configures the arrival policy and office verification. Every change requires a reason and a review step. HR Admin has read-only company policy controls.
5. Configure GPS, the server-observed office network IP, or both before using WFO. An unconfigured office check blocks WFO. WFH is available without office verification. On this computer, `127.0.0.1` confirms only a localhost connection, not physical office presence.

## Implemented service scope

- Employee accounts, salted scrypt password hashes, emailed temporary passwords and mandatory first-login password setup, expiring HTTP-only SameSite sessions, CSRF protection, same-origin checks, login rate limits and sign-out.
- Saved clock-ins/outs using server timestamps, unique employee/day records, duplicate/open-shift protection, own attendance and administrator team history.
- GPS distance, accuracy and freshness checks; optional exact office IPv4/IPv6 checks using the server's actual connection address. Forwarded-IP headers are not trusted. Browser-supplied GPS can be spoofed; this is not device attestation.
- Saved employee correction requests. Decisions require a reason, prevent stale/duplicate approval and write audit records. HR cannot decide their own or another administrator's corrections. Super Admin can decide administrator requests.
- Effective-month attendance rules, validated inputs and version checks to avoid overwriting another save. A policy can apply from the first of the current or a future month. Late deductions start **off** until Super Admin explicitly enables them.
- A read-only payroll attendance-deduction preview from real stored records, employee gross salary and the effective policy. The demo payroll register also includes a separately named late-attendance deduction. Neither workflow transfers money.

Other modules (leave, company holidays/weekend editing, detailed payroll structures/bank records, finalized live payslips, directory, assets, help desk, reports, image uploads and email password recovery) remain demo-only or show an integration notice in real mode. Real attendance does not assume demo leave/holiday records. Its current default weekly schedule is all Saturdays and Sundays off. The full payroll, tax, leave and payout backend is not implemented by this attendance service. No real payroll is finalized or published automatically.

## Late deduction calculation

Only completed, unambiguous records beyond the employee's saved shift start plus grace count. Exactly at the grace deadline is on time. Pending corrections, incomplete records, weekends and configured holidays/approved leave are excluded. The same shared rules run in browser previews and on the server. Live leave/holiday modules must be connected before their records can affect real attendance calculations.

Each complete group of N late days in a calendar month contributes half or one loss-of-pay day. Counts reset each month. Draft deduction = monthly gross / calendar days in the month × late loss-of-pay days, rounded to whole rupees. Short hours do not create an additional automatic deduction. Demo finalized snapshots are preserved. The real backend currently provides draft attendance estimates only.

## Records and backup

The database is `data/hrms.sqlite`, with SQLite WAL/SHM companion files when running. These files contain private HR data, password hashes, audit records and sessions. They are excluded from public serving, Git and container build context.

Stop the local server before copying the entire `data` folder to a private backup location. Restore it only while the server is stopped. Do not replace it with the workspace preview database. Tests use in-memory or temporary databases; the shipped database starts empty.

The default server binds only to this computer. Use this local service on localhost. Deployment to a shared network needs HTTPS, an explicit trusted-proxy design, email/recovery delivery, operational backups and further application integration. Initial Super Admin setup deliberately accepts loopback connections only. The container recipe includes the backend and a persistent data volume; its deployment and initial setup are not verified in this task.

## Verification

Run `node --test tests/*.test.cjs`. Tests cover rule boundaries, payroll amounts, login/session persistence, invitation reuse, role permissions, GPS/IP rejection, duplicate punches, correction ownership/concurrency and source/database exposure.
