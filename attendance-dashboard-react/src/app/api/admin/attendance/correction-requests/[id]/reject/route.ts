import { NextRequest, NextResponse } from 'next/server';
import { allowAttendanceAccess, AuthenticatedRequest } from '../../../../../../../middleware/roleMiddleware';
import { mockAttendanceHistoryRecords, mockCorrectionRequests, mockAuditLogs } from '../../../../../../../data/mockAttendance';

async function handler(req: AuthenticatedRequest, requestId: string) {
  try {
    const body = await req.json();
    const { rejectionReason } = body;

    if (!rejectionReason || rejectionReason.trim().length < 5) {
      return NextResponse.json(
        { success: false, message: 'Rejection reason is required (minimum 5 characters).' },
        { status: 400 }
      );
    }

    const reqIdx = mockCorrectionRequests.findIndex((r) => r.id === requestId);
    if (reqIdx === -1) {
      return NextResponse.json({ success: false, message: 'Correction request not found.' }, { status: 404 });
    }

    const currentReq = mockCorrectionRequests[reqIdx];
    currentReq.status = 'REJECTED';
    currentReq.reviewerId = req.user?.id || 'USR-001';
    currentReq.reviewerName = req.user?.name || 'Super Admin';
    currentReq.reviewerRole = req.user?.role || 'SUPER_ADMIN';
    currentReq.rejectionReason = rejectionReason.trim();
    currentReq.updatedAt = new Date().toISOString();

    const attIdx = mockAttendanceHistoryRecords.findIndex((a) => a.id === currentReq.attendanceId);
    if (attIdx !== -1) {
      mockAttendanceHistoryRecords[attIdx].correctionStatus = 'REJECTED';
    }

    mockAuditLogs.unshift({
      id: `AUD-${Date.now()}`,
      attendanceId: currentReq.attendanceId,
      employeeId: currentReq.employeeId,
      action: 'REJECT_CORRECTION_REQUEST',
      fieldName: currentReq.correctionType,
      oldValue: currentReq.currentValue,
      newValue: currentReq.requestedValue,
      reason: `Rejected request: ${rejectionReason.trim()}`,
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
      message: 'Correction request rejected.',
      request: currentReq
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return allowAttendanceAccess(req as AuthenticatedRequest, () => handler(req as AuthenticatedRequest, params.id));
}
