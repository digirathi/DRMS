import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../../../middleware/leaveAuthMiddleware';
import {
  mockLeaveRequests,
  mockLeaveAuditLogs,
  mockLeaveNotifications
} from '../../../../../../../data/mockLeave';

async function handler(req: AuthenticatedLeaveRequest, params: { requestId: string }) {
  const requestIndex = mockLeaveRequests.findIndex((r) => r.id === params.requestId);

  if (requestIndex === -1) {
    return NextResponse.json(
      { success: false, message: 'Leave request not found.' },
      { status: 404 }
    );
  }

  const leaveReq = mockLeaveRequests[requestIndex];

  if (leaveReq.status !== 'PENDING_APPROVAL') {
    return NextResponse.json(
      {
        success: false,
        message: 'This leave request cannot accept more info requests in its current status.'
      },
      { status: 400 }
    );
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    // missing body
  }

  const message = (body.message || '').trim();

  if (!message || message.length < 5) {
    return NextResponse.json(
      {
        success: false,
        message: 'Message to employee is required (minimum 5 characters).'
      },
      { status: 400 }
    );
  }

  const updatedRequest = {
    ...leaveReq,
    status: 'MORE_INFORMATION_REQUIRED' as const,
    version: leaveReq.version + 1,
    moreInfoMessage: message,
    processedById: req.user?.id || 'usr-admin-1',
    processedByName: req.user?.name || 'Super Admin',
    processedByRole: req.user?.role || 'SUPER_ADMIN',
    processedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  mockLeaveRequests[requestIndex] = updatedRequest;

  mockLeaveAuditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: leaveReq.employeeId,
    requestId: leaveReq.id,
    leaveTypeId: leaveReq.leaveTypeId,
    action: 'REQUEST_MORE_INFO',
    oldValue: 'PENDING_APPROVAL',
    newValue: 'MORE_INFORMATION_REQUIRED',
    performedBy: req.user?.name || 'Super Admin',
    userRole: req.user?.role || 'SUPER_ADMIN',
    reason: message,
    ipAddress: '127.0.0.1',
    deviceInfo: req.headers.get('user-agent') || 'Browser',
    createdAt: new Date().toISOString()
  });

  mockLeaveNotifications.unshift({
    id: `nt-${Date.now()}`,
    recipientId: leaveReq.employeeId,
    userRole: 'EMPLOYEE',
    title: 'More Information Required for Leave',
    message: `Administrator requested details for your ${leaveReq.leaveTypeName} request: ${message}`,
    type: 'MORE_INFO_REQUESTED',
    requestId: leaveReq.id,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({
    success: true,
    message: 'Requested more information from employee.',
    data: updatedRequest
  });
}

export async function POST(req: NextRequest, { params }: { params: { requestId: string } }) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => handler(req as AuthenticatedLeaveRequest, params));
}
