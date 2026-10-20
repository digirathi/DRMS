import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../../middleware/leaveAuthMiddleware';
import { mockHolidays, mockLeaveAuditLogs } from '../../../../../../data/mockLeave';

async function handler(req: AuthenticatedLeaveRequest, params: { holidayId: string }) {
  const index = mockHolidays.findIndex((h) => h.id === params.holidayId);

  if (index === -1) {
    return NextResponse.json({ success: false, message: 'Holiday not found.' }, { status: 404 });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid payload.' }, { status: 400 });
  }

  const oldSummary = JSON.stringify(mockHolidays[index]);

  mockHolidays[index] = {
    ...mockHolidays[index],
    ...body
  };

  mockLeaveAuditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: 'ALL',
    action: 'HOLIDAY_UPDATE',
    oldValue: oldSummary,
    newValue: JSON.stringify(mockHolidays[index]),
    performedBy: req.user?.name || 'Super Admin',
    userRole: req.user?.role || 'SUPER_ADMIN',
    reason: `Updated holiday ${mockHolidays[index].name}`,
    ipAddress: '127.0.0.1',
    deviceInfo: req.headers.get('user-agent') || 'Browser',
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({
    success: true,
    message: 'Holiday updated successfully.',
    data: mockHolidays[index]
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { holidayId: string } }) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => handler(req as AuthenticatedLeaveRequest, params));
}
