import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../middleware/leaveAuthMiddleware';
import { mockHolidays, mockLeaveAuditLogs } from '../../../../../data/mockLeave';
import { Holiday } from '../../../../../types/leave';

async function getHandler(req: AuthenticatedLeaveRequest) {
  return NextResponse.json({
    success: true,
    data: mockHolidays
  });
}

async function postHandler(req: AuthenticatedLeaveRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid payload.' }, { status: 400 });
  }

  const { name, date, dayType = 'FULL_DAY', description, recurringAnnually = true, isActive = true } = body;

  if (!name || !date) {
    return NextResponse.json({ success: false, message: 'Holiday Name and Date are required.' }, { status: 400 });
  }

  const newHoliday: Holiday = {
    id: `hol-${Date.now()}`,
    name: name.trim(),
    date,
    dayType,
    description: description?.trim() || undefined,
    recurringAnnually: Boolean(recurringAnnually),
    isActive: Boolean(isActive),
    createdAt: new Date().toISOString()
  };

  mockHolidays.unshift(newHoliday);

  mockLeaveAuditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: 'ALL',
    action: 'HOLIDAY_CREATE',
    oldValue: null,
    newValue: JSON.stringify(newHoliday),
    performedBy: req.user?.name || 'Super Admin',
    userRole: req.user?.role || 'SUPER_ADMIN',
    reason: `Created holiday ${newHoliday.name} for ${newHoliday.date}`,
    ipAddress: '127.0.0.1',
    deviceInfo: req.headers.get('user-agent') || 'Browser',
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({
    success: true,
    message: 'Holiday created successfully.',
    data: newHoliday
  });
}

export async function GET(req: NextRequest) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => getHandler(req as AuthenticatedLeaveRequest));
}

export async function POST(req: NextRequest) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => postHandler(req as AuthenticatedLeaveRequest));
}
