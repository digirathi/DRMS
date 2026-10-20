import { NextRequest, NextResponse } from 'next/server';
import { allowAttendanceAccess, AuthenticatedRequest } from '../../../../../../middleware/roleMiddleware';
import { mockAuditLogs } from '../../../../../../data/mockAttendance';

async function handler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  const attendanceId = params.id;

  // Filter audit logs for attendanceId in reverse chronological order
  const logs = mockAuditLogs
    .filter((log) => log.attendanceId === attendanceId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({
    success: true,
    attendanceId,
    total: logs.length,
    logs
  });
}

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  return allowAttendanceAccess(req as AuthenticatedRequest, () =>
    handler(req as AuthenticatedRequest, context)
  );
}
