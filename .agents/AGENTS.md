# Project Rules & Customizations for DigiRathi DRMS

## Super Admin Leave Management Guidelines & Invariants

1. **Access Control & Authorization**:
   - Super Admin Leave Management module routes (`/admin/leave` and `/api/admin/leave/*`) MUST be restricted strictly to `SUPER_ADMIN`.
   - Unauthorized requests MUST return HTTP 403 Forbidden with exact payload:
     ```json
     {
       "success": false,
       "message": "You do not have permission to access leave management."
     }
     ```

2. **Single-Level Approval & Optimistic Concurrency**:
   - HR and Super Admin share the single-level pending review queue. The first decision completed becomes final.
   - Approval/rejection handlers MUST verify the request status is `PENDING_APPROVAL` or `CANCELLATION_REQUESTED`.
   - If already processed by another approver, return HTTP 409 Conflict with exact payload:
     ```json
     {
       "success": false,
       "message": "This leave request has already been processed by another approver."
     }
     ```

3. **Strict Policy Exclusions**:
   - Gender, employee category, department/location eligibility, and employment type eligibility parameters MUST be excluded from all leave policy forms, Prisma schemas, TypeScript interfaces, and API handlers.

4. **Attendance Integration & Conflict Warnings**:
   - Approved full-day leave sets employee attendance status to `ON_LEAVE`.
   - Approval MUST be blocked if clock-in/out records already exist for the selected leave dates.
   - Approved half-day leave preserves clock-in/out records.

5. **Rejection & Manual Entry Validation**:
   - Rejection reasons MUST be trimmed, non-empty, and validated between 5 and 500 characters.
   - Manual leave additions and balance adjustments MUST require a mandatory audit reason and display a Change Summary Preview before saving.

6. **Audit Trail**:
   - All balance adjustments, leave type creation/archiving, policy changes, and request approvals/rejections MUST create immutable `LeaveAuditLog` records.

7. **Universal Leave Cancellation & Quota Restoration**:
   - `APPROVED` and `PENDING_APPROVAL` leave requests can be cancelled by employees from the Employee Leave Portal or by HR / Super Admin from the Leave Review Drawer and Requests Table.
   - Cancellation of an approved leave MUST restore consumed quota to the employee's available balance (`used` decreased, `availableBalance` increased), reset full-day attendance from `ON_LEAVE` to active, and record an immutable `LeaveAuditLog` entry.

8. **Immediate Success Notifications**:
   - Every state transition (Approval, Rejection, Employee Cancellation, Admin Revocation/Cancellation, and Leave Application Submission) MUST display an immediate, clear success toast message indicating the employee name, dates, and balance adjustment impact.

9. **Standardized Leave Policy Configuration Matrix & Policy Parameters**:
   All Leave Type creation, editing, viewing, and evaluation logic MUST support and adhere to the following two-tier configuration structure:
   - **General Settings**:
     - *Basic Identification*: `name` (required string), `shortName` / `code` (required uppercase alphanumeric), `description` (optional string), `isPaid` (boolean, Paid vs. Unpaid LWP), `displayColor` (hex color code).
     - *Leaves Count*: `leavesAllowedPerYear` (annual quota, float >= 0), `weekendsBetweenLeave` (`NOT_CONSIDERED` | `CONSIDERED`), `holidaysBetweenLeave` (`NOT_CONSIDERED` | `CONSIDERED`).
     - *Accrual*: `creditableOnAccrualBasis` (boolean), `accrualFrequency` (`MONTHLY` | `QUARTERLY` | `YEARLY`), `accrualAmount` (float >= 0).
     - *Applicability*: `allowedUnderProbation` (boolean), `allowedUnderNoticePeriod` (boolean).
     - *Leave Encashment*: `encashmentEnabled` (boolean), `encashmentMinBalance` (float), `encashmentMaxDays` (float).
     - *Carry Forward*: `carryForwardEnabled` (boolean), `maximumCarryForward` (float), `carryForwardExpiryDays` (integer).
   - **Advanced Settings**:
     - *Leaves Count & Caps*: `maxLeavesAllowedInMonth` (float / unlimited), `continuousLeavesAllowed` (max consecutive days in single application, float / unlimited).
     - *Applicability*: `negativeLeavesAllowed` (boolean), `negativeBalanceLimit` (float <= 0).
     - *Miscellaneous Application Rules*: `futureDatedLeavesAllowed` (boolean), `futureDatedAllowedAfterDays` (notice buffer days, integer >= 0), `backdatedLeavesAllowed` (boolean), `backdatedAllowedUpToDays` (past window allowed, integer >= 0), `applyLeavesForNextYearTill` (date/boundary cutoff).
   - *Strict Invariant Adherence*: Demographic eligibility parameters (Gender, category, department/location, employment type) remain strictly excluded per Rule 3.

10. **Annual Lump-Sum Allocation & Policy Assignment Invariant**:
    - All leave allocations operate strictly on an **Annual Lump-Sum** model for a 1-year cycle. Periodic monthly accrual buttons and background accrual jobs MUST NOT be used.
    - Leave Type configuration establishes the baseline policy matrix (`leavesAllowedPerYear`).
    - An explicit **"Assign Leave Policy to Employees"** workflow MUST exist in the Employee Balances view to allocate leave entitlements to selected employees (individually, by department, or organization-wide) with optional proration for mid-year joiners.
    - Assigning a leave policy creates or updates the employee's `LeaveBalance` (setting `openingBalance` and `availableBalance` to the annual quota) and writes an immutable `POLICY_ASSIGNMENT` audit log.

11. **Disambiguation of Leave Actions**:
    - **Absence Recording (Manual Leave Entry)**: Labeled as **"Record Employee Absence / Manual Leave"**. Purpose: Log an approved absence on behalf of an employee (e.g., employee unable to access portal). This action *deducts* days from their balance and marks attendance.
    - **Quota Allocation (Policy Assignment)**: Labeled as **"Assign Leave Policy to Employees"**. Purpose: Grant/entitle annual leave quota to employees. This action *establishes or increases* balance.
    - Forms and action buttons MUST make this distinction prominent to avoid confusing absence submission with quota assignment.
