import { Attendance, AttendanceStatus } from '../types/attendance';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Validates mandatory reason for manual attendance modification.
 * Rules: Must be between 5 and 500 characters after trimming leading/trailing spaces.
 */
export function validateModificationReason(reason: string): ValidationResult {
  const trimmed = (reason || '').trim();
  if (!trimmed) {
    return {
      isValid: false,
      message: 'Reason for modification is mandatory.'
    };
  }
  if (trimmed.length < 5) {
    return {
      isValid: false,
      message: 'Reason for modification must be at least 5 characters long.'
    };
  }
  if (trimmed.length > 500) {
    return {
      isValid: false,
      message: 'Reason for modification cannot exceed 500 characters.'
    };
  }
  return { isValid: true };
}

/**
 * Checks if attendance record has clock-in or clock-out activity.
 */
export function hasAttendanceActivity(record: Partial<Attendance>): boolean {
  return Boolean(record.clockInAt || record.clockOutAt);
}

/**
 * Validates leave marking logic.
 * Full-day leave cannot be marked if attendance activity already exists.
 */
export function validateMarkLeave(record: Partial<Attendance>): ValidationResult {
  if (hasAttendanceActivity(record)) {
    return {
      isValid: false,
      message:
        'This employee already has attendance activity for this date. Remove the attendance entry before marking full-day leave.'
    };
  }
  return { isValid: true };
}

/**
 * Enforces clean full-day leave display values.
 */
export function validateLeaveConsistency(record: Attendance): ValidationResult {
  if (record.status === 'ON_LEAVE') {
    if (
      record.clockInAt !== null ||
      record.clockOutAt !== null ||
      record.workMode !== null ||
      record.verification !== null
    ) {
      return {
        isValid: false,
        message:
          'Contradictory record: Full-day leave cannot contain work mode, clock-in, clock-out, or verification data.'
      };
    }
  }
  return { isValid: true };
}

/**
 * Validates clock times so that clock-out is strictly after clock-in.
 */
export function validateClockTimes(
  clockInAt: string | null,
  clockOutAt: string | null
): ValidationResult {
  if (clockInAt && clockOutAt) {
    const inMs = new Date(clockInAt).getTime();
    const outMs = new Date(clockOutAt).getTime();
    if (isNaN(inMs) || isNaN(outMs)) {
      return { isValid: false, message: 'Invalid date/time format provided.' };
    }
    if (outMs <= inMs) {
      return {
        isValid: false,
        message: 'Clock-out time cannot be earlier than or equal to clock-in time.'
      };
    }
  }
  return { isValid: true };
}

/**
 * Calculates formatted working hours string "00h 00m".
 * Clock In -> Clock Out = Working Hours.
 * Server time used as source of truth for currently clocked-in records.
 */
export function calculateWorkingHours(
  clockInAt: string | null,
  clockOutAt: string | null,
  status: AttendanceStatus,
  serverNow: number = Date.now()
): string {
  if (
    status === 'ON_LEAVE' ||
    status === 'WEEK_OFF' ||
    status === 'HOLIDAY' ||
    status === 'NOT_CLOCKED_IN' ||
    !clockInAt
  ) {
    return '00h 00m';
  }

  const startMs = new Date(clockInAt).getTime();
  const endMs = clockOutAt ? new Date(clockOutAt).getTime() : serverNow;

  if (isNaN(startMs) || isNaN(endMs) || endMs < startMs) {
    return '00h 00m';
  }

  const diffMins = Math.floor((endMs - startMs) / (1000 * 60));
  const hrs = Math.floor(diffMins / 60);
  const mins = diffMins % 60;

  return `${String(hrs).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`;
}

/**
 * Date Range Helper: Weekly Range (Monday to Sunday)
 */
export function getWeeklyRange(refDate: Date = new Date()) {
  const d = new Date(refDate);
  const day = d.getDay();
  // Calculate Monday (in JS, Sunday is 0)
  const diffToMon = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diffToMon));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const formatISO = (dt: Date) => dt.toISOString().slice(0, 10);
  const formatLabelDate = (dt: Date) =>
    dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return {
    startDate: formatISO(monday),
    endDate: formatISO(sunday),
    mondayObj: monday,
    sundayObj: sunday,
    label: `${formatLabelDate(monday)} – ${formatLabelDate(sunday)}`
  };
}

/**
 * Date Range Helper: Monthly Range
 */
export function getMonthlyRange(year: number, monthIndex: number) {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);

  const formatISO = (dt: Date) => {
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const d = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const monthName = firstDay.toLocaleDateString('en-US', { month: 'long' });

  return {
    startDate: formatISO(firstDay),
    endDate: formatISO(lastDay),
    label: `${monthName} ${year}`
  };
}

/**
 * Date Range Helper: Yearly Range
 */
export function getYearlyRange(year: number) {
  return {
    startDate: `${year}-01-01`,
    endDate: `${year}-12-31`,
    label: `${year}`
  };
}

/**
 * Display Date formatters
 */
export function formatDateDisplay(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  try {
    const dateObj = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`);
    if (isNaN(dateObj.getTime())) return dateStr;
    return dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function formatTimeDisplay(isoStr: string | null | undefined): string {
  if (!isoStr) return '—';
  try {
    const dateObj = new Date(isoStr);
    if (isNaN(dateObj.getTime())) return '—';
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return '—';
  }
}
