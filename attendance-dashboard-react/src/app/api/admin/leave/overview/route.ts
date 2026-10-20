import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../middleware/leaveAuthMiddleware';
import {
  getOverviewSummaryStats,
  getDepartmentLeaveStats,
  getMonthlyLeaveTrends,
  getLowBalanceEmployees,
  mockLeaveRequests,
  mockHolidays
} from '../../../../../data/mockLeave';

async function handler(req: AuthenticatedLeaveRequest) {
  const summary = getOverviewSummaryStats();
  const departmentStats = getDepartmentLeaveStats();
  const monthlyTrends = getMonthlyLeaveTrends();
  const lowBalanceEmployees = getLowBalanceEmployees();

  const todayStr = '2026-07-28';

  // Employees on leave today
  const onLeaveToday = mockLeaveRequests.filter(
    (r) => r.status === 'APPROVED' && r.startDate <= todayStr && r.endDate >= todayStr
  );

  // Upcoming approved leave
  const upcomingApproved = mockLeaveRequests.filter(
    (r) => r.status === 'APPROVED' && r.startDate > todayStr
  );

  // Pending approval queue
  const pendingQueue = mockLeaveRequests.filter(
    (r) => r.status === 'PENDING_APPROVAL' || r.status === 'CANCELLATION_REQUESTED'
  );

  // Upcoming holidays
  const upcomingHolidays = mockHolidays.filter((h) => h.isActive && h.date >= todayStr);

  return NextResponse.json({
    success: true,
    data: {
      summary,
      departmentStats,
      monthlyTrends,
      lowBalanceEmployees,
      onLeaveToday,
      upcomingApproved,
      pendingQueue,
      upcomingHolidays
    }
  });
}

export async function GET(req: NextRequest) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => handler(req as AuthenticatedLeaveRequest));
}
