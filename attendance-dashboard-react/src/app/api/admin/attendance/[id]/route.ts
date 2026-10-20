import { NextRequest, NextResponse } from 'next/server';
import { allowAttendanceAccess, AuthenticatedRequest } from '../../../../../middleware/roleMiddleware';
import { mockAttendanceHistoryRecords, mockAuditLogs } from '../../../../../data/mockAttendance';
import { calculateWorkingHours, validateModificationReason } from '../../../../../utils/attendanceValidation';

async function handler(req: AuthenticatedRequest, attendanceId: string) {
  try {
    const body = await req.json();
    const { action, changes, reason } = body;

    // Validate Mandatory Reason (5-500 chars, min 5 chars, trimmed)
    const reasonVal = validateModificationReason(reason);
    if (!reasonVal.isValid) {
      return NextResponse.json({ success: false, message: reasonVal.message }, { status: 400 });
    }

    const recordIdx = mockAttendanceHistoryRecords.findIndex((r) => r.id === attendanceId);
    if (recordIdx === -1) {
      return NextResponse.json({ success: false, message: 'Attendance record not found.' }, { status: 404 });
    }

    const rec = mockAttendanceHistoryRecords[recordIdx];
    const oldClockIn = rec.clockInAt;
    const oldClockOut = rec.clockOutAt;
    const oldStatus = rec.status;
    const oldWorkMode = rec.workMode;

    // Single Database Transaction Simulation: Apply changes
    if (changes) {
      if ('clockInAt' in changes) rec.clockInAt = changes.clockInAt;
      if ('clockOutAt' in changes) rec.clockOutAt = changes.clockOutAt;
      if ('workMode' in changes) rec.workMode = changes.workMode;
      if ('status' in changes) rec.status = changes.status;
      if ('adminRemark' in changes) rec.adminRemark = changes.adminRemark;
    }

    // Recalculate Working Hours & Status (No Shift Logic)
    if (rec.clockInAt && rec.clockOutAt && rec.status !== 'ON_LEAVE') {
      rec.status = 'COMPLETED';
    } else if (rec.clockInAt && !rec.clockOutAt && rec.status !== 'ON_LEAVE') {
      rec.status = 'CLOCKED_IN';
    }

    rec.lastModifiedBy = `${req.user?.name} (${req.user?.role})`;
    rec.lastModifiedAt = new Date().toISOString();
    rec.workingHoursFormatted = calculateWorkingHours(rec.clockInAt, rec.clockOutAt, rec.status);
    rec.updatedAt = new Date().toISOString();

    // Insert Immutable Audit Log Record
    mockAuditLogs.unshift({
      id: `AUD-${Date.now()}`,
      attendanceId: rec.id,
      employeeId: rec.employeeId,
      action: action || 'EDIT_ATTENDANCE',
      fieldName: 'manualCorrection',
      oldValue: `In: ${oldClockIn || '—'}, Out: ${oldClockOut || '—'}, Status: ${oldStatus}, Mode: ${oldWorkMode || '—'}`,
      newValue: `In: ${rec.clockInAt || '—'}, Out: ${rec.clockOutAt || '—'}, Status: ${rec.status}, Mode: ${rec.workMode || '—'}`,
      reason: reason.trim(),
      editedByUserId: req.user?.id || 'USR-001',
      editedByName: req.user?.name || 'Super Admin',
      editedByRole: req.user?.role || 'SUPER_ADMIN',
      ipAddress: '192.168.1.100',
      deviceInfo: 'Chrome / Windows 11',
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Attendance record updated successfully.',
      record: rec
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return allowAttendanceAccess(req as AuthenticatedRequest, () => handler(req as AuthenticatedRequest, params.id));
}
