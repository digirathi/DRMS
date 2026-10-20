import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../../../middleware/leaveAuthMiddleware';
import { mockBalanceTransactions } from '../../../../../../../data/mockLeave';

async function handler(req: AuthenticatedLeaveRequest, params: { balanceId: string }) {
  const transactions = mockBalanceTransactions.filter((tx) => tx.balanceId === params.balanceId);

  return NextResponse.json({
    success: true,
    total: transactions.length,
    records: transactions
  });
}

export async function GET(req: NextRequest, { params }: { params: { balanceId: string } }) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => handler(req as AuthenticatedLeaveRequest, params));
}
