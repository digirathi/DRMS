import { NextRequest, NextResponse } from 'next/server';
import { allowAttendanceAccess, AuthenticatedRequest } from '../../../../../middleware/roleMiddleware';
import { mockAttendanceRecords, mockAuditLogs } from '../../../../../data/mockAttendance';
import { Attendance, AuditLog, AuditActionType } from '../../../../../types/attendance';
import {
  validateClockTimes,
  validateModificationReason,
  hasAttendanceActivity
} from '../../../../../utils/attendanceValidation';

// GET Handler
async function getHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  const record = mockAttendanceRecords.find((rec) => rec.id === params.id);
  if (!record) {
    return NextResponse.json({ success: false, message: 'Record not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, record });
}

// PATCH Handler
async function patchHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  const recordIndex = mockAttendanceRecords.findIndex((rec) => rec.id === params.id);
  if (recordIndex === -1) {
    return NextResponse.json({ success: false, message: 'Record not found' }, { status: 404 });
  }

  const record = mockAttendanceRecords[recordIndex];
  const body = await req.json();

  const action: AuditActionType = body.action || 'EDIT_ATTENDANCE';
  const reason: string = body.reason || body.changeReason || '';
  const changes = body.changes || body.updatedFields || {};

  // 1. Mandatory Reason Validation
  const reasonVal = validateModificationReason(reason);
  if (!reasonVal.isValid) {
    return NextResponse.json(
      { success: false, message: reasonVal.message || 'A valid reason for modification is required.' },
      { status: 400 }
    );
  }

  let newWorkMode = changes.workMode !== undefined ? changes.workMode : record.workMode;
  let newClockInAt = changes.clockInAt !== undefined ? changes.clockInAt : record.clockInAt;
  let newClockOutAt = changes.clockOutAt !== undefined ? changes.clockOutAt : record.clockOutAt;
  let newStatus = changes.status !== undefined ? changes.status : record.status;
  let newVerification = changes.verification !== undefined ? changes.verification : record.verification;

  // 2. Specific Action Handler Logic
  if (action === 'MARK_LEAVE' || newStatus === 'ON_LEAVE') {
    // Validation rule: Block if attendance activity already exists
    if (hasAttendanceActivity(record) && action === 'MARK_LEAVE' && (record.clockInAt || record.clockOutAt)) {
      return NextResponse.json(
        {
          success: false,
          message:
            'This employee already has attendance activity for this date. Remove the attendance entry before marking full-day leave.'
        },
        { status: 400 }
      );
    }

    newWorkMode = null;
    newClockInAt = null;
    newClockOutAt = null;
    newVerification = null;
    newStatus = 'ON_LEAVE';
  } else if (action === 'ADD_MISSING_CLOCK_OUT') {
    if (!newClockOutAt) {
      return NextResponse.json(
        { success: false, message: 'Clock-out timestamp is required.' },
        { status: 400 }
      );
    }
    const timeVal = validateClockTimes(newClockInAt, newClockOutAt);
    if (!timeVal.isValid) {
      return NextResponse.json(
        { success: false, message: timeVal.message },
        { status: 400 }
      );
    }
    newStatus = 'CLOCKED_OUT';
  } else if (action === 'CHANGE_WORK_MODE') {
    if (newWorkMode === 'WFH') {
      newVerification = 'NOT_REQUIRED';
    } else if (newWorkMode === 'OFFICE' && (!newVerification || newVerification === 'NOT_REQUIRED')) {
      newVerification = 'IP_VERIFIED';
    }
  }

  // 3. Time order validation for non-leave actions
  if (newStatus !== 'ON_LEAVE' && newClockInAt && newClockOutAt) {
    const timeVal = validateClockTimes(newClockInAt, newClockOutAt);
    if (!timeVal.isValid) {
      return NextResponse.json(
        { success: false, message: timeVal.message },
        { status: 400 }
      );
    }
  }

  // Prepare oldValue & newValue diff descriptions
  const oldValueStr = `Mode: ${record.workMode || '—'}, Status: ${record.status}, In: ${record.clockInAt || '—'}, Out: ${record.clockOutAt || '—'}`;
  const newValueStr = `Mode: ${newWorkMode || '—'}, Status: ${newStatus}, In: ${newClockInAt || '—'}, Out: ${newClockOutAt || '—'}`;

  // Apply changes to record
  const updatedRecord: Attendance = {
    ...record,
    workMode: newWorkMode,
    clockInAt: newClockInAt,
    clockOutAt: newClockOutAt,
    status: newStatus,
    verification: newVerification,
    adminRemark: changes.adminRemark !== undefined ? changes.adminRemark : record.adminRemark,
    updatedAt: new Date().toISOString()
  };

  mockAttendanceRecords[recordIndex] = updatedRecord;

  // Create immutable Audit Log Entry
  const auditLog: AuditLog = {
    id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
    attendanceId: record.id,
    employeeId: record.employeeId,
    action,
    oldValue: oldValueStr,
    newValue: newValueStr,
    reason: reason.trim(),
    editedByUserId: req.user?.id || 'USR-001',
    editedByName: req.user?.name || 'Authorized Admin',
    editedByRole: (req.user?.role as 'SUPER_ADMIN' | 'HR') || 'HR',
    ipAddress: '127.0.0.1',
    deviceInfo: req.headers.get('user-agent') || 'Chrome 150 on Windows 11',
    createdAt: new Date().toISOString()
  };

  mockAuditLogs.unshift(auditLog);

  return NextResponse.json({
    success: true,
    message: 'Attendance record modified successfully',
    record: updatedRecord,
    auditLog
  });
}

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  return allowAttendanceAccess(req as AuthenticatedRequest, () => getHandler(req as AuthenticatedRequest, context));
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  return allowAttendanceAccess(req as AuthenticatedRequest, () => patchHandler(req as AuthenticatedRequest, context));
}
