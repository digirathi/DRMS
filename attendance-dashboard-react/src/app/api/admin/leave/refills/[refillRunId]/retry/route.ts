import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../../../middleware/leaveAuthMiddleware';
import { mockAutoRefillRuns, mockLeaveAuditLogs } from '../../../../../../../data/mockLeave';

export async function POST(req: NextRequest) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, async () => NextResponse.json({success:false,message:'Periodic refills are disabled. Use annual policy assignment.'},{status:410}));
}
