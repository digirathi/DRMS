import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../../../middleware/leaveAuthMiddleware';
import {
  mockLeaveRequests,
  mockLeaveBalances,
  mockBalanceTransactions,
  mockLeaveAuditLogs,
  mockLeaveNotifications
} from '../../../../../../../data/mockLeave';
import { mockAttendanceHistoryRecords } from '../../../../../../../data/mockAttendance';

async function handler(req: AuthenticatedLeaveRequest, params: { requestId: string }) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    // optional body
  }

  const requestIndex = mockLeaveRequests.findIndex((r) => r.id === params.requestId);

  if (requestIndex === -1) {
    return NextResponse.json(
      { success: false, message: 'Leave request not found.' },
      { status: 404 }
    );
  }

  const leaveReq = mockLeaveRequests[requestIndex];



  const action=body?.action || 'APPROVE';
  const reason=typeof body?.reason === 'string' ? body.reason.trim() : '';
  if(!['APPROVE','REJECT'].includes(action)) return NextResponse.json({success:false,message:'Invalid cancellation action.'},{status:400});
  if(!['APPROVED','PENDING_APPROVAL','CANCELLATION_REQUESTED'].includes(leaveReq.status) || (action==='REJECT' && leaveReq.status!=='CANCELLATION_REQUESTED')) return NextResponse.json({success:false,message:'This leave request has already been processed by another approver.'},{status:409});
  if(action==='REJECT' && (reason.length<5 || reason.length>500)) return NextResponse.json({success:false,message:'Rejection reason is mandatory and must be between 5 and 500 characters.'},{status:400});
  const restoredDays=leaveReq.status==='PENDING_APPROVAL' ? 0 : leaveReq.totalDays;

  if (action === 'REJECT') {
    const updatedRequest = {
      ...leaveReq,
      status: 'APPROVED' as const, // revert back to approved leave
      version: leaveReq.version + 1,
      processedById: req.user?.id || 'usr-admin-1',
      processedByName: req.user?.name || 'Super Admin',
      processedByRole: req.user?.role || 'SUPER_ADMIN',
      processedAt: new Date().toISOString(),
      rejectionReason: reason || 'Cancellation request rejected.',
      updatedAt: new Date().toISOString()
    };

    mockLeaveRequests[requestIndex] = updatedRequest;

    mockLeaveAuditLogs.unshift({
      id: `lal-${Date.now()}`,
      employeeId: leaveReq.employeeId,
      requestId: leaveReq.id,
      leaveTypeId: leaveReq.leaveTypeId,
      action: 'REJECT_CANCELLATION',
      oldValue: leaveReq.status,
      newValue: 'APPROVED',
      performedBy: req.user?.name || 'Super Admin',
      userRole: req.user?.role || 'SUPER_ADMIN',
      reason: reason || 'Cancellation request rejected',
      ipAddress: '127.0.0.1',
      deviceInfo: req.headers.get('user-agent') || 'Browser',
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Leave cancellation request rejected.',
      data: updatedRequest
    });
  }

  // Action === 'APPROVE' (Default): Restore balance & update attendance
  const balanceIndex = mockLeaveBalances.findIndex(
    (b) => b.employeeId === leaveReq.employeeId && b.leaveTypeId === leaveReq.leaveTypeId
  );

  let currentBal = 0;
  if (balanceIndex !== -1) {
    currentBal = mockLeaveBalances[balanceIndex].availableBalance;
    mockLeaveBalances[balanceIndex].availableBalance += restoredDays;
    mockLeaveBalances[balanceIndex].used = Math.max(0, mockLeaveBalances[balanceIndex].used - restoredDays);
    if(leaveReq.status==='PENDING_APPROVAL') mockLeaveBalances[balanceIndex].pending=Math.max(0,mockLeaveBalances[balanceIndex].pending-leaveReq.totalDays);
    mockLeaveBalances[balanceIndex].lastUpdated = new Date().toISOString();
  }

  const newBal = currentBal + restoredDays;

  // Balance transaction
  mockBalanceTransactions.unshift({
    id: `lbt-${Date.now()}`,
    balanceId: balanceIndex !== -1 ? mockLeaveBalances[balanceIndex].id : 'lb-temp',
    employeeId: leaveReq.employeeId,
    leaveTypeId: leaveReq.leaveTypeId,
    transactionType: 'APPROVE_CANCELLATION',
    amount: restoredDays,
    previousBalance: currentBal,
    newBalance: newBal,
    effectiveDate: leaveReq.startDate,
    reason: `Leave cancellation approved: ${reason || 'Restored balance'}`,
    performedById: req.user?.id || 'usr-admin-1',
    performedByName: req.user?.name || 'Super Admin',
    performedByRole: req.user?.role || 'SUPER_ADMIN',
    createdAt: new Date().toISOString()
  });

  if(restoredDays && leaveReq.dayType==='FULL_DAY') {
    mockAttendanceHistoryRecords.filter(a=>a.employeeId===leaveReq.employeeId && a.date && a.date>=leaveReq.startDate && a.date<=leaveReq.endDate && a.status==='ON_LEAVE').forEach(a=>{a.status='NOT_CLOCKED_IN';a.adminRemark='Leave cancelled - attendance reset.';});
  }

  const updatedRequest = {
    ...leaveReq,
    status: 'CANCELLED' as const,
    version: leaveReq.version + 1,
    processedById: req.user?.id || 'usr-admin-1',
    processedByName: req.user?.name || 'Super Admin',
    processedByRole: req.user?.role || 'SUPER_ADMIN',
    processedAt: new Date().toISOString(),
    approvalNote: reason || 'Cancellation approved and leave balance restored.',
    updatedAt: new Date().toISOString()
  };

  mockLeaveRequests[requestIndex] = updatedRequest;

  mockLeaveAuditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: leaveReq.employeeId,
    requestId: leaveReq.id,
    leaveTypeId: leaveReq.leaveTypeId,
    action: 'APPROVE_CANCELLATION',
    oldValue: 'CANCELLATION_REQUESTED',
    newValue: 'CANCELLED',
    performedBy: req.user?.name || 'Super Admin',
    userRole: req.user?.role || 'SUPER_ADMIN',
    reason: reason || 'Approved leave cancellation and restored balance',
    ipAddress: '127.0.0.1',
    deviceInfo: req.headers.get('user-agent') || 'Browser',
    createdAt: new Date().toISOString()
  });

  mockLeaveNotifications.unshift({
    id: `nt-${Date.now()}`,
    recipientId: leaveReq.employeeId,
    userRole: 'EMPLOYEE',
    title: 'Leave Cancellation Approved',
    message: `Your cancellation request for ${leaveReq.leaveTypeName} (${leaveReq.startDate}) has been approved. Balance restored.`,
    type: 'CANCELLATION_APPROVED',
    requestId: leaveReq.id,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({
    success: true,
    message: `${leaveReq.employeeName}: ${leaveReq.startDate} to ${leaveReq.endDate} cancelled. ${restoredDays} day(s) restored.`,
    data: updatedRequest
  });
}

export async function POST(req: NextRequest, { params }: { params: { requestId: string } }) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => handler(req as AuthenticatedLeaveRequest, params));
}
