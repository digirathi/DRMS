export type UserRole = 'SUPER_ADMIN' | 'HR' | 'EMPLOYEE' | 'MANAGER' | 'TEAM_LEADER';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  department?: string;
}

export type WorkMode = 'OFFICE' | 'WFH' | null;

export type AttendanceStatus =
  | 'COMPLETED'
  | 'CLOCKED_IN'
  | 'MISSING_CLOCK_IN'
  | 'MISSING_CLOCK_OUT'
  | 'INCOMPLETE_HOURS'
  | 'NOT_CLOCKED_IN'
  | 'ON_LEAVE'
  | 'WEEK_OFF'
  | 'HOLIDAY'
  | 'MANUALLY_CORRECTED'
  | 'CLOCKED_OUT';

export type VerificationStatus =
  | 'IP_VERIFIED'
  | 'GPS_VERIFIED'
  | 'IP_AND_GPS_VERIFIED'
  | 'VERIFICATION_FAILED'
  | 'NOT_VERIFIED'
  | 'NOT_REQUIRED'
  | null;

export type CorrectionStatus =
  | 'NO_REQUEST'
  | 'PENDING_REVIEW'
  | 'MORE_INFO_REQUIRED'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'EXPIRED';

export type CorrectionType =
  | 'INCORRECT_CLOCK_IN'
  | 'INCORRECT_CLOCK_OUT'
  | 'MISSING_CLOCK_IN'
  | 'MISSING_CLOCK_OUT'
  | 'INCORRECT_WORK_MODE'
  | 'INCORRECT_ATTENDANCE_STATUS'
  | 'OTHER';

export interface CorrectionRequest {
  id: string;
  attendanceId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  attendanceDate: string; // YYYY-MM-DD
  correctionType: CorrectionType;
  currentValue: string;
  requestedValue: string;
  reason: string;
  attachmentUrl?: string | null;
  status: CorrectionStatus;
  submittedAt: string; // ISO String
  reviewerId?: string | null;
  reviewerName?: string | null;
  reviewerRole?: UserRole | null;
  reviewNote?: string | null;
  rejectionReason?: string | null;
  moreInfoMessage?: string | null;
  employeeReply?: string | null;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date?: string; // YYYY-MM-DD
  workMode: WorkMode;
  clockInAt: string | null; // ISO Date String
  clockOutAt: string | null; // ISO Date String
  status: AttendanceStatus;
  verification: VerificationStatus;
  gpsVerified?: boolean | null;
  ipVerified?: boolean | null;
  latitude?: number | null;
  longitude?: number | null;
  officeLocationId?: string | null;
  officeLocationName?: string | null;
  ipAddress?: string | null;
  deviceInfo?: string | null;
  adminRemark?: string | null;
  correctionStatus?: CorrectionStatus;
  correctionRequestId?: string | null;
  lastModifiedBy?: string | null;
  lastModifiedAt?: string | null;
  workingHoursFormatted?: string;
  createdAt: string;
  updatedAt: string;
}

export type AuditActionType =
  | 'EDIT_ATTENDANCE'
  | 'ADD_MISSING_CLOCK_IN'
  | 'ADD_MISSING_CLOCK_OUT'
  | 'CHANGE_WORK_MODE'
  | 'MARK_LEAVE'
  | 'REMOVE_LEAVE'
  | 'CHANGE_STATUS'
  | 'APPROVE_CORRECTION_REQUEST'
  | 'REJECT_CORRECTION_REQUEST';

export interface AuditLog {
  id: string;
  attendanceId: string;
  employeeId: string;
  action: AuditActionType;
  fieldName?: string;
  oldValue: string | null;
  newValue: string | null;
  reason: string;
  editedByUserId: string;
  editedByName: string;
  editedByRole: UserRole;
  ipAddress: string;
  deviceInfo: string;
  correctionRequestId?: string | null;
  createdAt: string;
}

export type RangeType = 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface HistoryFilterState {
  rangeType: RangeType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  search: string;
  department: string;
  workMode: 'ALL' | 'OFFICE' | 'WFH' | 'NOT_SELECTED';
  status: string;
  officeLocation: string;
  correctionStatus: string;
}

export interface HistorySummaryData {
  totalRecords: number;
  presentDays: number;
  officeDays: number;
  wfhDays: number;
  leaveDays: number;
  missingClockOuts: number;
  incompleteRecords: number;
  pendingCorrections: number;
}

export interface FilterState {
  search: string;
  department: string;
  officeLocation: string;
  workMode: 'ALL' | 'OFFICE' | 'WFH' | 'NOT_SELECTED';
  status: 'ALL' | AttendanceStatus | 'OFFICE_MODE' | 'WFH_MODE';
  date: string; // YYYY-MM-DD
}

export interface SummaryData {
  totalEmployees: number;
  clockedIn: number;
  clockedOut: number;
  notClockedIn: number;
  workingFromOffice: number;
  workingFromHome: number;
  onLeave: number;
  missingClockOut: number;
}
