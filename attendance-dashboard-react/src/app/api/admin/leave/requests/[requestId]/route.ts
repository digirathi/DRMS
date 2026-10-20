import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../../middleware/leaveAuthMiddleware';
import { mockLeaveRequests } from '../../../../../../data/mockLeave';

async function handler(req: AuthenticatedLeaveRequest, params: { requestId: string }) {
  const request = mockLeaveRequests.find((r) => r.id === params.requestId);

  if (!request) {
    return NextResponse.json(
      { success: false, message: 'Leave request not found.' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: request
  });
}

export async function GET(req: NextRequest, { params }: { params: { requestId: string } }) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => handler(req as AuthenticatedLeaveRequest, params));
}
