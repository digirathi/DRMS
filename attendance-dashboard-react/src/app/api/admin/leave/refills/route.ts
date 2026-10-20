import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../middleware/leaveAuthMiddleware';
import { mockAutoRefillConfigs, mockAutoRefillRuns } from '../../../../../data/mockLeave';

async function handler(req: AuthenticatedLeaveRequest) {
  return NextResponse.json({
    success: true,
    configs: mockAutoRefillConfigs,
    runs: mockAutoRefillRuns
  });
}

export async function GET(req: NextRequest) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => handler(req as AuthenticatedLeaveRequest));
}
