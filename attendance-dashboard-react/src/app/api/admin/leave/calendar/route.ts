import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../middleware/leaveAuthMiddleware';
import { mockLeaveRequests, mockHolidays } from '../../../../../data/mockLeave';

async function handler(req: AuthenticatedLeaveRequest) {
  const { searchParams } = new URL(req.url);
  const department = searchParams.get('department') || 'ALL';
  const leaveTypeId = searchParams.get('leaveTypeId') || 'ALL';

  let requests = mockLeaveRequests.filter(
    (r) => r.status === 'APPROVED' || r.status === 'PENDING_APPROVAL' || r.status === 'CANCELLATION_REQUESTED'
  );

  if (department !== 'ALL') {
    requests = requests.filter((r) => r.department === department);
  }

  if (leaveTypeId !== 'ALL') {
    requests = requests.filter((r) => r.leaveTypeId === leaveTypeId);
  }

  // Strip confidential employee reason for shared calendar view payload
  const calendarEvents = requests.map((r) => ({
    id: r.id,
    employeeId: r.employeeId,
    employeeName: r.employeeName,
    department: r.department,
    leaveTypeId: r.leaveTypeId,
    leaveTypeName: r.leaveTypeName,
    isPaid: r.isPaid,
    startDate: r.startDate,
    endDate: r.endDate,
    dayType: r.dayType,
    totalDays: r.totalDays,
    status: r.status,
    // Confidential fields hidden from public event object
    reason: undefined
  }));

  const activeHolidays = mockHolidays.filter((h) => h.isActive);

  return NextResponse.json({
    success: true,
    events: calendarEvents,
    holidays: activeHolidays
  });
}

export async function GET(req: NextRequest) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => handler(req as AuthenticatedLeaveRequest));
}
