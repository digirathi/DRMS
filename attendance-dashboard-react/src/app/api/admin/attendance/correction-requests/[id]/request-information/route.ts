import { NextRequest, NextResponse } from 'next/server';
import { allowAttendanceAccess, AuthenticatedRequest } from '../../../../../../../middleware/roleMiddleware';
import { mockAttendanceHistoryRecords, mockCorrectionRequests } from '../../../../../../../data/mockAttendance';

async function handler(req: AuthenticatedRequest, requestId: string) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, message: 'Message to employee is required (minimum 5 characters).' },
        { status: 400 }
      );
    }

    const reqIdx = mockCorrectionRequests.findIndex((r) => r.id === requestId);
    if (reqIdx === -1) {
      return NextResponse.json({ success: false, message: 'Correction request not found.' }, { status: 404 });
    }

    const currentReq = mockCorrectionRequests[reqIdx];
    currentReq.status = 'MORE_INFO_REQUIRED';
    currentReq.reviewerId = req.user?.id || 'USR-001';
    currentReq.reviewerName = req.user?.name || 'Super Admin';
    currentReq.reviewerRole = req.user?.role || 'SUPER_ADMIN';
    currentReq.moreInfoMessage = message.trim();
    currentReq.updatedAt = new Date().toISOString();

    const attIdx = mockAttendanceHistoryRecords.findIndex((a) => a.id === currentReq.attendanceId);
    if (attIdx !== -1) {
      mockAttendanceHistoryRecords[attIdx].correctionStatus = 'MORE_INFO_REQUIRED';
    }

    return NextResponse.json({
      success: true,
      message: 'Requested more information from employee.',
      request: currentReq
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return allowAttendanceAccess(req as AuthenticatedRequest, () => handler(req as AuthenticatedRequest, params.id));
}
