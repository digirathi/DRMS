import { NextRequest, NextResponse } from 'next/server';
import { allowAttendanceAccess, AuthenticatedRequest } from '../../../../../middleware/roleMiddleware';
import { mockCorrectionRequests } from '../../../../../data/mockAttendance';

async function handler(req: AuthenticatedRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || 'ALL';

  let filtered = [...mockCorrectionRequests];

  if (status !== 'ALL') {
    filtered = filtered.filter((r) => r.status === status);
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    requests: filtered
  });
}

export async function GET(req: NextRequest) {
  return allowAttendanceAccess(req as AuthenticatedRequest, () => handler(req as AuthenticatedRequest));
}
