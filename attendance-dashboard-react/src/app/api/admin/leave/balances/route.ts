import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../middleware/leaveAuthMiddleware';
import { mockLeaveBalances } from '../../../../../data/mockLeave';

async function handler(req: AuthenticatedLeaveRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get('search')?.toLowerCase().trim() || '';
  const department = searchParams.get('department') || 'ALL';
  const leaveTypeId = searchParams.get('leaveTypeId') || 'ALL';
  const lowBalanceOnly = searchParams.get('lowBalanceOnly') === 'true';

  let filtered = [...mockLeaveBalances];

  if (search) {
    filtered = filtered.filter(
      (b) =>
        b.employeeName.toLowerCase().includes(search) ||
        b.employeeCode.toLowerCase().includes(search) ||
        b.employeeId.toLowerCase().includes(search) ||
        b.department.toLowerCase().includes(search)
    );
  }

  if (department !== 'ALL') {
    filtered = filtered.filter((b) => b.department === department);
  }

  if (leaveTypeId !== 'ALL') {
    filtered = filtered.filter((b) => b.leaveTypeId === leaveTypeId);
  }

  if (lowBalanceOnly) {
    filtered = filtered.filter((b) => b.availableBalance <= 2);
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    records: filtered
  });
}

export async function GET(req: NextRequest) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => handler(req as AuthenticatedLeaveRequest));
}
