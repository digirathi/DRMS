# Employee and HR Admin welcome emails

Real onboarding now sends a welcome email through Gmail/Google Workspace. It contains the employee's name, access type, employee ID, login email, employee-accessible website link and a unique temporary password. Demo onboarding never sends real credentials or creates real accounts.

The employee signs in with either the email address or employee ID and the temporary password. The backend grants a restricted first-login session only. All dashboard, attendance, employee and payroll API access stays blocked until the employee sets a different password of 12–128 characters. After that change, the server revokes the temporary credential and old sessions and creates a fresh signed-in session.

Temporary passwords expire after 24 hours. The password-setup session lasts 15 minutes. Passwords are stored only as salted scrypt hashes; they are not displayed to HR or returned by APIs. The plaintext temporary password exists only in memory while composing/sending the welcome email and in the recipient's email.

## Configure Gmail locally

1. Choose the Gmail/Workspace account that will send welcome emails. Google app passwords require 2-Step Verification and may be restricted by Workspace policy. See [Google's app-password instructions](https://support.google.com/mail/answer/185833).
2. Run `configure-gmail.ps1` in this project folder. Enter the sender address, the real website root URL employees can reach, and the Google app password when prompted. The password input is hidden; do not paste it into chat. Alternatively, copy `.env.example` to `.env.local` and fill it in locally.
3. Restart `node server.js` using Node 24 or newer. Check **Settings → Onboarding email** or **Employees → Onboard employee** for readiness.
4. Create an Employee or HR Admin account. The result states whether Gmail accepted the email, sending failed, or configuration is missing. Acceptance does not guarantee inbox delivery; employees should check spam as well.

The interactive setup script creates `.env.local` and restricts its Windows file permissions to the current user. It contains a mail credential and must stay private. The file is excluded from Git, Docker build context and HTTP serving. Deployments should supply the same variables through private environment configuration. Nodemailer is a locked dependency; a fresh checkout can install it with `npm ci --omit=dev --ignore-scripts`.

Gmail transport uses `smtp.gmail.com:465`, TLS certificate verification and no message/protocol logging. Configuration variables are `SMTP_USER`, `SMTP_PASSWORD`, `HRMS_PUBLIC_URL` and optional `HRMS_COMPANY_NAME`.

Do not configure `127.0.0.1`, `localhost` or the sample `https://hrms.digirathi.example/` URL for live employee email. Localhost is only reachable on the server's computer; the .example address is a placeholder. The demo email requested during development uses clearly labelled sample credentials and does not create an employee account.

## Delivery failures and resending

An employee is saved even if the email cannot be sent. This avoids losing onboarding details or creating duplicates when a mail service fails. Configure or correct Gmail, then use **Employees → Resend welcome email**. Resend creates a fresh temporary password and revokes the previous temporary password and sessions. Resends are limited to once per minute, with an immediate retry allowed after missing configuration is corrected.

HR Admin can send/resend welcome emails for regular Employees only. Super Admin can onboard HR Admin accounts. An already activated account cannot be reset with the welcome-email action. No welcome email is sent when a user changes their password.

Existing active accounts keep their passwords. Existing unused activation links from the previous version remain usable; new onboarding uses temporary passwords and email rather than exposing activation links to administrators.

Automated tests use fake mail transports and disposable databases. Only the explicitly requested sample email was sent through the connected Gmail account; no real employee was onboarded or emailed as part of testing.
