import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../../../middleware/leaveAuthMiddleware';
import {
  mockLeaveRequests,
  mockLeaveBalances,
  mockLeaveAuditLogs,
  mockLeaveNotifications
} from '../../../../../../../data/mockLeave';

async function handler(req: AuthenticatedLeaveRequest, params: { requestId: string }) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    // missing body
  }

  const requestIndex = mockLeaveRequests.findIndex((r) => r.id === params.requestId);

  if (requestIndex === -1) {
    return NextResponse.json(
      { success: false, message: 'Leave request not found.' },
      { status: 404 }
    );
  }

  const leaveReq = mockLeaveRequests[requestIndex];

  // Concurrency check
  if (leaveReq.status !== 'PENDING_APPROVAL' && leaveReq.status !== 'CANCELLATION_REQUESTED') {
    return NextResponse.json(
      {
        success: false,
        message: 'This leave request has already been processed by another approver.'
      },
      { status: 409 }
    );
  }



  const rejectionReason = typeof body?.rejectionReason === 'string' ? body.rejectionReason.trim() : '';

  // Rejection Reason Validation: Min 5, Max 500, non-empty
  if (!rejectionReason || rejectionReason.length < 5 || rejectionReason.length > 500) {
    return NextResponse.json(
      {
        success: false,
        message: 'Rejection reason is mandatory and must be between 5 and 500 characters.'
      },
      { status: 400 }
    );
  }

  if(leaveReq.status === 'PENDING_APPROVAL') {
    const balance=mockLeaveBalances.find(b=>b.employeeId===leaveReq.employeeId && b.leaveTypeId===leaveReq.leaveTypeId);
    if(balance) balance.pending=Math.max(0,balance.pending-leaveReq.totalDays);
  }
  const updatedRequest = {
    ...leaveReq,
    status: leaveReq.status === 'CANCELLATION_REQUESTED' ? 'APPROVED' as const : 'REJECTED' as const,
    version: leaveReq.version + 1,
    processedById: req.user?.id || 'usr-admin-1',
    processedByName: req.user?.name || 'Super Admin',
    processedByRole: req.user?.role || 'SUPER_ADMIN',
    processedAt: new Date().toISOString(),
    rejectionReason: rejectionReason,
    updatedAt: new Date().toISOString()
  };

  mockLeaveRequests[requestIndex] = updatedRequest;

  // Create Audit Record
  mockLeaveAuditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: leaveReq.employeeId,
    requestId: leaveReq.id,
    leaveTypeId: leaveReq.leaveTypeId,
    action: leaveReq.status === 'CANCELLATION_REQUESTED' ? 'REJECT_CANCELLATION' : 'REJECT_REQUEST',
    oldValue: leaveReq.status,
    newValue: updatedRequest.status,
    performedBy: req.user?.name || 'Super Admin',
    userRole: req.user?.role || 'SUPER_ADMIN',
    reason: rejectionReason,
    ipAddress: '127.0.0.1',
    deviceInfo: req.headers.get('user-agent') || 'Browser',
    createdAt: new Date().toISOString()
  });

  // Create Notification
  mockLeaveNotifications.unshift({
    id: `nt-${Date.now()}`,
    recipientId: leaveReq.employeeId,
    userRole: 'EMPLOYEE',
    title: 'Leave Request Rejected',
    message: `Your ${leaveReq.leaveTypeName} request was rejected. Reason: ${rejectionReason}`,
    type: 'LEAVE_REJECTED',
    requestId: leaveReq.id,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({
    success: true,
    message: 'Leave request rejected.',
    data: updatedRequest
  });
}

export async function POST(req: NextRequest, { params }: { params: { requestId: string } }) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => handler(req as AuthenticatedLeaveRequest, params));
}
