import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../../../middleware/leaveAuthMiddleware';
import { mockLeaveTypes, mockLeaveRequests, mockLeaveAuditLogs } from '../../../../../../../data/mockLeave';

async function handler(req: AuthenticatedLeaveRequest, params: { leaveTypeId: string }) {
  const typeIndex = mockLeaveTypes.findIndex((t) => t.id === params.leaveTypeId);

  if (typeIndex === -1) {
    return NextResponse.json({ success: false, message: 'Leave type not found.' }, { status: 404 });
  }

  const leaveType = mockLeaveTypes[typeIndex];

  // Prevent permanent deletion if used in requests
  const isUsed = mockLeaveRequests.some((r) => r.leaveTypeId === leaveType.id);

  // Soft archive / deactivate
  mockLeaveTypes[typeIndex].isActive = false;
  mockLeaveTypes[typeIndex].updatedAt = new Date().toISOString();

  mockLeaveAuditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: 'N/A',
    leaveTypeId: leaveType.id,
    action: 'TYPE_DEACTIVATE',
    oldValue: 'ACTIVE',
    newValue: 'ARCHIVED',
    performedBy: req.user?.name || 'Super Admin',
    userRole: req.user?.role || 'SUPER_ADMIN',
    reason: `Archived leave type ${leaveType.name}. ${isUsed ? 'Permanent deletion blocked because leave type is referenced by historical leave requests.' : ''}`,
    ipAddress: '127.0.0.1',
    deviceInfo: req.headers.get('user-agent') || 'Browser',
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({
    success: true,
    message: isUsed
      ? `Leave type '${leaveType.name}' was archived instead of permanently deleted as it is linked to existing leave requests.`
      : `Leave type '${leaveType.name}' archived successfully.`,
    data: mockLeaveTypes[typeIndex]
  });
}

export async function POST(req: NextRequest, { params }: { params: { leaveTypeId: string } }) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => handler(req as AuthenticatedLeaveRequest, params));
}
