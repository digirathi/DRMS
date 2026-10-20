import { NextRequest, NextResponse } from 'next/server';
import { allowAttendanceAccess, AuthenticatedRequest } from '../../../../../../../middleware/roleMiddleware';
import { mockAttendanceHistoryRecords, mockCorrectionRequests, mockAuditLogs } from '../../../../../../../data/mockAttendance';

async function handler(req: AuthenticatedRequest, requestId: string) {
  try {
    const body = await req.json();
    const { reviewNote } = body;

    if (!reviewNote || reviewNote.trim().length < 5) {
      return NextResponse.json(
        { success: false, message: 'Review note is required (minimum 5 characters).' },
        { status: 400 }
      );
    }

    const reqIdx = mockCorrectionRequests.findIndex((r) => r.id === requestId);
    if (reqIdx === -1) {
      return NextResponse.json({ success: false, message: 'Correction request not found.' }, { status: 404 });
    }

    const currentReq = mockCorrectionRequests[reqIdx];

    // Transaction Step 1: Update Correction Request State
    currentReq.status = 'APPROVED';
    currentReq.reviewerId = req.user?.id || 'USR-001';
    currentReq.reviewerName = req.user?.name || 'Super Admin';
    currentReq.reviewerRole = req.user?.role || 'SUPER_ADMIN';
    currentReq.reviewNote = reviewNote.trim();
    currentReq.updatedAt = new Date().toISOString();

    // Transaction Step 2: Update Target Attendance Record & Recalculate Working Hours / Status
    const attIdx = mockAttendanceHistoryRecords.findIndex((a) => a.id === currentReq.attendanceId);
    if (attIdx !== -1) {
      const att = mockAttendanceHistoryRecords[attIdx];
      att.correctionStatus = 'APPROVED';
      att.lastModifiedBy = `${req.user?.name} (${req.user?.role})`;
      att.lastModifiedAt = new Date().toISOString();

      if (currentReq.correctionType === 'MISSING_CLOCK_OUT' || currentReq.correctionType === 'INCORRECT_CLOCK_OUT') {
        const timeMatch = currentReq.requestedValue.match(/(\d{1,2}:\d{2}\s?[AP]M)/i);
        if (timeMatch) {
          const dateStr = att.date || att.createdAt.slice(0, 10);
          att.clockOutAt = `${dateStr}T18:30:00Z`;
          att.status = 'COMPLETED';
        }
      } else if (currentReq.correctionType === 'INCORRECT_ATTENDANCE_STATUS') {
        att.status = 'ON_LEAVE';
        att.clockInAt = null;
        att.clockOutAt = null;
      }
    }

    // Transaction Step 3: Insert Immutable Audit Log Entry
    mockAuditLogs.unshift({
      id: `AUD-${Date.now()}`,
      attendanceId: currentReq.attendanceId,
      employeeId: currentReq.employeeId,
      action: 'APPROVE_CORRECTION_REQUEST',
      fieldName: currentReq.correctionType,
      oldValue: currentReq.currentValue,
      newValue: currentReq.requestedValue,
      reason: `Approved request: ${reviewNote.trim()}`,
      editedByUserId: req.user?.id || 'USR-001',
      editedByName: req.user?.name || 'Super Admin',
      editedByRole: req.user?.role || 'SUPER_ADMIN',
      ipAddress: '192.168.1.100',
      deviceInfo: 'Web Console Admin',
      correctionRequestId: currentReq.id,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Correction request approved and attendance record updated successfully.',
      request: currentReq
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return allowAttendanceAccess(req as AuthenticatedRequest, () => handler(req as AuthenticatedRequest, params.id));
}
