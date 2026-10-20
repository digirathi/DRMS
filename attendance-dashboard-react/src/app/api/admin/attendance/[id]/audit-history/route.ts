import { NextRequest, NextResponse } from 'next/server';
import { allowAttendanceAccess, AuthenticatedRequest } from '../../../../../../middleware/roleMiddleware';
import { mockAuditLogs } from '../../../../../../data/mockAttendance';

async function handler(req: AuthenticatedRequest, attendanceId: string) {
  const logs = mockAuditLogs.filter((log) => log.attendanceId === attendanceId);

  return NextResponse.json({
    success: true,
    attendanceId,
    total: logs.length,
    logs
  });
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return allowAttendanceAccess(req as AuthenticatedRequest, () => handler(req as AuthenticatedRequest, params.id));
}
