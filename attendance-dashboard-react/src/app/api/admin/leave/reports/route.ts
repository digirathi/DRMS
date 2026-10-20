import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../middleware/leaveAuthMiddleware';
import {
  mockLeaveRequests,
  mockLeaveBalances,
  mockBalanceTransactions,
  mockAutoRefillRuns,
  mockLeaveAuditLogs
} from '../../../../../data/mockLeave';

async function handler(req: AuthenticatedLeaveRequest) {
  const { searchParams } = new URL(req.url);

  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const department = searchParams.get('department') || 'ALL';
  const leaveTypeId = searchParams.get('leaveTypeId') || 'ALL';

  let requests = [...mockLeaveRequests];
  let balances = [...mockLeaveBalances];

  if (department !== 'ALL') {
    requests = requests.filter((r) => r.department === department);
    balances = balances.filter((b) => b.department === department);
  }

  if (leaveTypeId !== 'ALL') {
    requests = requests.filter((r) => r.leaveTypeId === leaveTypeId);
    balances = balances.filter((b) => b.leaveTypeId === leaveTypeId);
  }

  if (startDate && endDate) {
    requests = requests.filter((r) => r.startDate >= startDate && r.endDate <= endDate);
  }

  const totalRequestedDays = requests.reduce((sum, r) => sum + r.totalDays, 0);
  const totalApprovedDays = requests.filter((r) => r.status === 'APPROVED').reduce((sum, r) => sum + r.totalDays, 0);
  const totalPaidDays = requests.filter((r) => r.status === 'APPROVED' && r.isPaid).reduce((sum, r) => sum + r.totalDays, 0);
  const totalUnpaidDays = requests.filter((r) => r.status === 'APPROVED' && !r.isPaid).reduce((sum, r) => sum + r.totalDays, 0);
  const totalPendingDays = requests.filter((r) => r.status === 'PENDING_APPROVAL').reduce((sum, r) => sum + r.totalDays, 0);
  const totalRejectedDays = requests.filter((r) => r.status === 'REJECTED').reduce((sum, r) => sum + r.totalDays, 0);

  // Group by Leave Type
  const usageByLeaveType = mockLeaveRequests
    .filter((r) => r.status === 'APPROVED')
    .reduce((acc: any, r) => {
      acc[r.leaveTypeName] = (acc[r.leaveTypeName] || 0) + r.totalDays;
      return acc;
    }, {});

  // Group by Department
  const usageByDepartment = mockLeaveRequests
    .filter((r) => r.status === 'APPROVED')
    .reduce((acc: any, r) => {
      acc[r.department] = (acc[r.department] || 0) + r.totalDays;
      return acc;
    }, {});

  return NextResponse.json({
    success: true,
    data: {
      metrics: {
        totalRequestedDays,
        totalApprovedDays,
        totalPaidDays,
        totalUnpaidDays,
        totalPendingDays,
        totalRejectedDays,
        approvalRate: requests.length ? Math.round((requests.filter((r) => r.status === 'APPROVED').length / requests.length) * 100) : 0
      },
      usageByLeaveType,
      usageByDepartment,
      manualAdjustments: mockBalanceTransactions.filter((tx) => tx.transactionType.startsWith('MANUAL_')),
      autoRefillHistory: mockAutoRefillRuns,
      auditLogsCount: mockLeaveAuditLogs.length
    }
  });
}

export async function GET(req: NextRequest) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => handler(req as AuthenticatedLeaveRequest));
}
