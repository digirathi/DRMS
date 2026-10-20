export type UserRole = 'SUPER_ADMIN' | 'HR' | 'EMPLOYEE' | 'MANAGER' | 'TEAM_LEADER';

export type LeaveDayType = 'FULL_DAY' | 'FIRST_HALF' | 'SECOND_HALF';

export type LeaveStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'MORE_INFORMATION_REQUIRED'
  | 'APPROVED'
  | 'REJECTED'
  | 'WITHDRAWAL_REQUESTED'
  | 'CANCELLATION_REQUESTED'
  | 'CANCELLED'
  | 'WITHDRAWN'
  | 'EXPIRED';

export type RefillFrequency = 'WEEKLY' | 'MONTHLY';

export type LeaveActionType =
  | 'CREATE_REQUEST'
  | 'EDIT_REQUEST'
  | 'REQUEST_MORE_INFO'
  | 'RESUBMIT_REQUEST'
  | 'APPROVE_REQUEST'
  | 'REJECT_REQUEST'
  | 'WITHDRAW_REQUEST'
  | 'REQUEST_CANCELLATION'
  | 'APPROVE_CANCELLATION'
  | 'REJECT_CANCELLATION'
  | 'MANUAL_ADD_LEAVE'
  | 'MANUAL_BALANCE_CREDIT'
  | 'MANUAL_BALANCE_DEDUCT'
  | 'MANUAL_BALANCE_RESET'
  | 'AUTO_REFILL_SUCCESS'
  | 'AUTO_REFILL_FAILURE'
  | 'POLICY_CREATE'
  | 'POLICY_UPDATE'
  | 'POLICY_DELETE'
  | 'POLICY_ASSIGNMENT'
  | 'TYPE_ACTIVATE'
  | 'TYPE_DEACTIVATE'
  | 'PROBATION_SETTING_UPDATE'
  | 'PROBATION_OVERRIDE'
  | 'HOLIDAY_CREATE'
  | 'HOLIDAY_UPDATE';

export interface LeaveType {
  id: string;
  name: string;
  shortName?: string | null;
  code: string;
  description: string | null;
  isPaid: boolean;
  isActive: boolean;
  displayColor: string | null;
  
  // General Settings
  annualAllocation: number;
  leavesAllowedPerYear?: number;
  weekendsBetweenLeave?: 'NOT_CONSIDERED' | 'CONSIDERED';
  holidaysBetweenLeave?: 'NOT_CONSIDERED' | 'CONSIDERED';
  creditableOnAccrualBasis?: boolean;
  accrualFrequency?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  accrualAmount?: number | null;
  allowedUnderProbation?: boolean;
  allowedUnderNoticePeriod?: boolean;
  encashmentEnabled: boolean;
  encashmentMinBalance?: number | null;
  encashmentMaxDays?: number | null;
  carryForwardEnabled: boolean;
  maximumCarryForward: number | null;
  carryForwardExpiryDays: number | null;

  // Advanced Settings
  maxLeavesAllowedInMonth?: number | null;
  continuousLeavesAllowed?: number | null;
  negativeLeavesAllowed?: boolean;
  negativeBalanceLimit?: number | null;
  futureDatedLeavesAllowed?: boolean;
  futureDatedAllowedAfterDays?: number | null;
  backdatedLeavesAllowed?: boolean;
  backdatedAllowedUpToDays?: number | null;
  applyLeavesForNextYearTill?: string | null;

  // Legacy compatibility fields
  minimumDuration?: number;
  maximumDuration?: number | null;
  maximumConsecutiveDays?: number | null;
  minimumNoticeDays?: number;
  allowHalfDay?: boolean;
  allowNegativeBalance?: boolean;
  attachmentRequired?: boolean;
  attachmentRequiredAfterDays?: number | null;
  countWeekends?: boolean;
  countHolidays?: boolean;
  sandwichRuleEnabled?: boolean;
  availableDuringProbation?: boolean;
  autoRefillEnabled?: boolean;
  autoRefillFrequency?: RefillFrequency | null;
  autoRefillAmount?: number | null;
  refillDayOfWeek?: number | null;
  refillDayOfMonth?: number | null;
  refillDuringProbation?: boolean;
  maximumBalanceCap?: number | null;

  createdAt: string;
  updatedAt: string;
  usageCount?: number;
}


export interface LeaveRequestAction {
  id: string;
  requestId: string;
  actionType: LeaveActionType;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  note: string | null;
  oldStatus: LeaveStatus | null;
  newStatus: LeaveStatus | null;
  createdAt: string;
}

export interface LeaveAttachment {
  id: string;
  requestId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  joiningDate?: string;
  officeLocationId?: string;
  officeLocationName?: string;
  leaveTypeId: string;
  leaveTypeName: string;
  isPaid: boolean;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  dayType: LeaveDayType;
  totalDays: number;
  currentBalance: number;
  balanceAfterApp: number;
  reason: string;
  handoverPerson?: string;
  handoverNote?: string;
  emergencyContact?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  status: LeaveStatus;
  version: number;
  submittedAt: string;
  processedById?: string;
  processedByName?: string;
  processedByRole?: UserRole;
  processedAt?: string;
  approvalNote?: string;
  rejectionReason?: string;
  moreInfoMessage?: string;
  employeeResubmitNote?: string;
  cancellationReason?: string;
  hasAttendanceConflict?: boolean;
  hasOverlappingLeave?: boolean;
  createdAt: string;
  updatedAt: string;
  actions?: LeaveRequestAction[];
  attachments?: LeaveAttachment[];
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  leaveTypeId: string;
  leaveTypeName: string;
  openingBalance: number;
  refilled: number;
  carriedForward: number;
  used: number;
  pending: number;
  manuallyAdjusted: number;
  availableBalance: number;
  expiringBalance: number;
  lastUpdated: string;
}

export interface LeaveBalanceTransaction {
  id: string;
  balanceId: string;
  employeeId: string;
  leaveTypeId: string;
  transactionType: LeaveActionType;
  amount: number;
  previousBalance: number;
  newBalance: number;
  effectiveDate: string;
  reason: string;
  internalNote?: string;
  performedById: string;
  performedByName: string;
  performedByRole: UserRole;
  idempotencyKey?: string;
  createdAt: string;
}

export interface LeaveAutoRefillConfig {
  id: string;
  leaveTypeId: string;
  leaveTypeName?: string;
  enabled: boolean;
  frequency: RefillFrequency;
  amount: number;
  refillDayOfWeek?: number | null; // 1-7
  refillDayOfMonth?: number | null; // 1-28 or 99
  startDate: string;
  maxCap?: number | null;
  carryUnusedForward: boolean;
  refillInProbation: boolean;
  prorateFirstRefill: boolean;
  stopWhenInactive: boolean;
  createdAt: string;
}

export interface LeaveAutoRefillRun {
  id: string;
  configId: string;
  leaveTypeId: string;
  leaveTypeName: string;
  period: string; // YYYY-MM or YYYY-WW
  runDate: string;
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  successCount: number;
  failureCount: number;
  totalAmountAdded: number;
  errorMessage?: string;
}

export interface ProbationSettings {
  id: string;
  enabled: boolean;
  duration: number;
  durationUnit: 'DAYS' | 'MONTHS';
  calculateFrom: 'JOINING_DATE';
  defaultLeaveAvailabilityProbation: boolean;
  notifyBeforeCompletionDays: number;
  updatedAt: string;
}

export interface EmployeeProbationOverride {
  id: string;
  employeeId: string;
  employeeName: string;
  originalEndDate: string;
  overrideEndDate: string;
  reason: string;
  overriddenById: string;
  overriddenByName: string;
  createdAt: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  dayType: LeaveDayType;
  description?: string;
  recurringAnnually: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface LeaveAuditLog {
  id: string;
  employeeId: string;
  employeeName?: string;
  requestId?: string;
  leaveTypeId?: string;
  action: LeaveActionType;
  oldValue?: string | null;
  newValue?: string | null;
  performedBy: string;
  userRole: UserRole;
  reason: string;
  ipAddress: string;
  deviceInfo: string;
  createdAt: string;
}

export interface LeaveNotification {
  id: string;
  recipientId: string;
  userRole: UserRole;
  title: string;
  message: string;
  type: string;
  requestId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface OverviewSummaryCards {
  employeesOnLeaveToday: number;
  pendingLeaveRequests: number;
  approvedUpcomingLeaves: number;
  rejectedRequests: number;
  unpaidLeaveDays: number;
  employeesLowBalance: number;
  requestsRequiringReview: number;
  leaveConflicts: number;
  totalLeaveTypes: number;
  upcomingHolidays: number;
}

export interface DepartmentLeaveStat {
  department: string;
  totalEmployees: number;
  onLeaveToday: number;
  pendingRequests: number;
  utilizationRate: number;
}

export interface MonthlyLeaveTrend {
  month: string;
  approvedDays: number;
  pendingDays: number;
  rejectedDays: number;
}

export interface LowBalanceEmployee {
  employeeId: string;
  employeeName: string;
  department: string;
  leaveTypeName: string;
  availableBalance: number;
  allocated: number;
}

export interface RequestFilterParams {
  search?: string;
  department?: string;
  leaveTypeId?: string;
  status?: string;
  isPaid?: string; // 'ALL' | 'PAID' | 'UNPAID'
  startDate?: string;
  endDate?: string;
  approver?: string;
  officeLocation?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ApiForbiddenResponse {
  success: false;
  message: 'You do not have permission to access leave management.';
}

export interface ApiConflictResponse {
  success: false;
  message: 'This leave request has already been processed by another approver.';
}
