import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../../middleware/leaveAuthMiddleware';
import {
  mockLeaveBalances,
  mockBalanceTransactions,
  mockLeaveAuditLogs
} from '../../../../../../data/mockLeave';

async function handler(req: AuthenticatedLeaveRequest, params: { balanceId: string }) {
  const balIndex = mockLeaveBalances.findIndex((b) => b.id === params.balanceId);

  if (balIndex === -1) {
    return NextResponse.json({ success: false, message: 'Leave balance record not found.' }, { status: 404 });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid payload.' }, { status: 400 });
  }

  const { adjustmentType, days, effectiveDate, reason, internalNote } = body;

  if (!days || Number(days) <= 0 || !reason || reason.trim().length < 5) {
    return NextResponse.json(
      {
        success: false,
        message: 'Number of days (> 0) and Reason for Balance Adjustment (minimum 5 chars) are required.'
      },
      { status: 400 }
    );
  }

  const currentBal = mockLeaveBalances[balIndex];
  const numDays = Number(days);
  const isCredit = adjustmentType === 'CREDIT';
  const changeAmount = isCredit ? numDays : -numDays;

  const previousAvailable = currentBal.availableBalance;
  const newAvailable = Math.max(0, previousAvailable + changeAmount);

  currentBal.manuallyAdjusted += changeAmount;
  currentBal.availableBalance = newAvailable;
  currentBal.lastUpdated = new Date().toISOString();

  // Create immutable transaction
  const tx = {
    id: `lbt-${Date.now()}`,
    balanceId: currentBal.id,
    employeeId: currentBal.employeeId,
    leaveTypeId: currentBal.leaveTypeId,
    transactionType: isCredit ? ('MANUAL_BALANCE_CREDIT' as const) : ('MANUAL_BALANCE_DEDUCT' as const),
    amount: changeAmount,
    previousBalance: previousAvailable,
    newBalance: newAvailable,
    effectiveDate: effectiveDate || new Date().toISOString().slice(0, 10),
    reason: reason.trim(),
    internalNote: internalNote?.trim() || undefined,
    performedById: req.user?.id || 'usr-admin-1',
    performedByName: req.user?.name || 'Super Admin',
    performedByRole: req.user?.role || 'SUPER_ADMIN',
    createdAt: new Date().toISOString()
  };

  mockBalanceTransactions.unshift(tx);

  // Audit Log
  mockLeaveAuditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: currentBal.employeeId,
    leaveTypeId: currentBal.leaveTypeId,
    action: isCredit ? 'MANUAL_BALANCE_CREDIT' : 'MANUAL_BALANCE_DEDUCT',
    oldValue: `${previousAvailable} days`,
    newValue: `${newAvailable} days`,
    performedBy: req.user?.name || 'Super Admin',
    userRole: req.user?.role || 'SUPER_ADMIN',
    reason: reason.trim(),
    ipAddress: '127.0.0.1',
    deviceInfo: req.headers.get('user-agent') || 'Browser',
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({
    success: true,
    message: `Leave balance ${isCredit ? 'credited' : 'deducted'} successfully.`,
    data: currentBal,
    transaction: tx
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { balanceId: string } }) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => handler(req as AuthenticatedLeaveRequest, params));
}
