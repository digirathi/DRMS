# Leave, salary slip and attendance reminder emails

These workflows use the real, signed-in local backend. Explore demo never sends email or writes real leave/payroll records.

## What is sent

- Leave submission: receipt to the applicant; review email to eligible active administrators. An HR Admin's or Super Admin's request is reviewed by Super Admin only. HR cannot approve their own request, another HR Admin's request or a Super Admin's request.
- Leave approval/rejection: saved decision email to the applicant. Cancellations and cancellation decisions also have notifications. Leave reasons stay inside the authenticated website and are omitted from email.
- Salary slip finalization: an email to that employee containing a sign-in link to the finalized statement. Drafts never send an email. No salary amounts, bank data, credentials or access tokens are included in this message or link.
- Monthly attendance review: 10:00 AM Asia/Kolkata on the 30th. February uses its last day (28th/29th). Recipients are all active Employees, HR Admins and Super Admins who have completed password setup and whose own slip for that month has not been finalized. Employees without a prepared slip are included.

Super Admin can adjust reminder time, audience or pause reminders in Settings. Reminder configuration is saved in SQLite. If paused, queued but unsent reminders are cancelled when the delivery worker next processes them.

## Gmail configuration

The existing private Gmail configuration is shared by onboarding and these notifications. Follow `ONBOARDING-EMAIL.md` and run `configure-gmail.ps1` locally. Set a sender address, Google app password and a real reachable website URL. Never paste the app password into chat or commit `.env.local`.

Without Gmail configuration, saved events remain PENDING; the website does not claim they were sent. Settings shows readiness and delivery history. Gmail acceptance is recorded as SENT, but cannot prove inbox placement. Check spam or the mail provider for delivery issues.

## Running and recovery

Start with Node 24 or newer: `node server.js`. The server checks the persistent outbox immediately and every minute. It must remain running with network access for scheduled emails. A machine that is asleep or turned off cannot send at the scheduled time. On restart, it catches up for the current month only; missed previous-month reminders are not sent later.

Each saved event and recipient pair has a unique queue key. Each employee receives at most one reminder queue entry per month. Queued review messages are cancelled when the request has already been decided or the recipient is no longer an eligible reviewer. Inactive employees and changed email addresses are skipped. Attendance reminders are cancelled when the employee's slip is finalized or the reminder month expires.

Delivery failures retry with increasing delays, up to six attempts. A Super Admin can retry FAILED messages in Settings. An interrupted send is recovered after a three-minute lease. SMTP cannot guarantee exactly-once delivery across a crash after Gmail accepts a message but before SQLite records success; deterministic message IDs reduce duplicate handling but do not eliminate this rare case.

## Saved workflow safeguards

Leave policy assignment is explicit and annual lump-sum only, with a mandatory reason and Change Summary Preview. Default paid quota is zero until Super Admin configures and assigns it. Unpaid leave is available without granting paid quota. Existing demo quotas and policies are not imported. No monthly accrual job is created. Carry forward and encashment stay disabled until a separately reviewed adjustment workflow exists. Real accounts currently have no holiday calendar; this is disclosed in policy configuration.

Pending paid leave reserves days. Approval consumes the reservation; rejection releases it. Full-day approval is blocked if punches exist. Approved full-day leave marks attendance ON_LEAVE and prevents clock-in or conflicting correction approval. Half-day leave preserves punches. Own approved cancellation requests retain used days until an eligible administrator approves restoration. Review status and version are checked inside the same transaction as balance changes, audit records and email queue entries.

Super Admin prepares an employee/cycle salary draft. Monthly salary, bonus and reimbursement are explicit earnings. PF, ESIC, professional tax, TDS and other statutory values are manually entered and verified; this module does not calculate tax liability or invent a salary structure. Unpaid leave deductions use the saved chargeable dates from approved requests, including approved leave awaiting cancellation. Late deductions use saved attendance and the effective policy. Leave dates are excluded from late penalties. The formula is monthly gross / calendar days × loss-of-pay days.

Finalization requires attendance and statutory review, nonnegative net pay, no pending leave decisions/corrections or open shifts, and an unchanged source-record signature. Finalized snapshots cannot be edited or deleted. Employees can view only their own published slips; direct API links enforce this. HR Admin cannot publish slips. Printing a finalized statement does not make any bank payment.

Tests use fake mail transports and disposable databases. No real employee emails, approvals, payroll finalizations or payments are needed for verification.
