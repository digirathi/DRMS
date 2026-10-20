import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../middleware/leaveAuthMiddleware';
import { mockLeaveAuditLogs } from '../../../../../data/mockLeave';

async function handler(req: AuthenticatedLeaveRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get('search')?.toLowerCase().trim() || '';
  const action = searchParams.get('action') || 'ALL';
  const role = searchParams.get('role') || 'ALL';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  let filtered = [...mockLeaveAuditLogs];

  if (search) {
    filtered = filtered.filter(
      (log) =>
        log.performedBy.toLowerCase().includes(search) ||
        log.employeeId.toLowerCase().includes(search) ||
        log.reason.toLowerCase().includes(search) ||
        (log.requestId && log.requestId.toLowerCase().includes(search))
    );
  }

  if (action !== 'ALL') {
    filtered = filtered.filter((log) => log.action === action);
  }

  if (role !== 'ALL') {
    filtered = filtered.filter((log) => log.userRole === role);
  }

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    success: true,
    total,
    page,
    limit,
    records: paginated
  });
}

export async function GET(req: NextRequest) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => handler(req as AuthenticatedLeaveRequest));
}
