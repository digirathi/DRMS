import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../../middleware/leaveAuthMiddleware';
import { mockLeaveTypes, mockLeaveAuditLogs, mockLeaveBalances } from '../../../../../../data/mockLeave';
import { LeaveBalance } from '../../../../../../types/leave';

async function handler(req: AuthenticatedLeaveRequest, params: { leaveTypeId: string }) {
  const typeIndex = mockLeaveTypes.findIndex((t) => t.id === params.leaveTypeId);

  if (typeIndex === -1) {
    return NextResponse.json({ success: false, message: 'Leave type not found.' }, { status: 404 });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON body.' }, { status: 400 });
  }

  const { modificationReason, applyToExistingBalances, ...updates } = body;

  if (typeof modificationReason !== 'string' || modificationReason.trim().length < 5 || modificationReason.trim().length > 500) {
    return NextResponse.json(
      {
        success: false,
        message: 'Reason for policy modification is required (minimum 5 characters).'
      },
      { status: 400 }
    );
  }

  const permitted = ['name','shortName','code','description','isPaid','isActive','displayColor','annualAllocation','leavesAllowedPerYear','weekendsBetweenLeave','holidaysBetweenLeave','allowedUnderProbation','allowedUnderNoticePeriod','encashmentEnabled','encashmentMinBalance','encashmentMaxDays','carryForwardEnabled','maximumCarryForward','carryForwardExpiryDays','maxLeavesAllowedInMonth','continuousLeavesAllowed','negativeLeavesAllowed','allowNegativeBalance','negativeBalanceLimit','futureDatedLeavesAllowed','futureDatedAllowedAfterDays','backdatedLeavesAllowed','backdatedAllowedUpToDays','applyLeavesForNextYearTill','minimumDuration','maximumDuration','maximumConsecutiveDays','minimumNoticeDays','allowHalfDay','attachmentRequired','attachmentRequiredAfterDays','countWeekends','countHolidays','sandwichRuleEnabled','availableDuringProbation'];
  const safeUpdates=Object.fromEntries(Object.entries(updates).filter(([key])=>permitted.includes(key)));
  const currentType = mockLeaveTypes[typeIndex];
  const oldSummary = JSON.stringify(currentType);

  const updatedType = {
    ...currentType,
    ...safeUpdates,
    creditableOnAccrualBasis:false, accrualFrequency:'YEARLY' as const, accrualAmount:0, autoRefillEnabled:false,
    updatedAt: new Date().toISOString()
  };

  mockLeaveTypes[typeIndex] = updatedType;

  // Create Audit Entry
  mockLeaveAuditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: 'N/A',
    leaveTypeId: updatedType.id,
    action: 'POLICY_UPDATE',
    oldValue: oldSummary,
    newValue: JSON.stringify(updatedType),
    performedBy: req.user?.name || 'Super Admin',
    userRole: req.user?.role || 'SUPER_ADMIN',
    reason: `${modificationReason.trim()} ${applyToExistingBalances ? '(Applied to existing balances)' : '(Prospective application)'}`,
    ipAddress: '127.0.0.1',
    deviceInfo: req.headers.get('user-agent') || 'Browser',
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({
    success: true,
    message: 'Leave policy updated successfully.',
    data: updatedType
  });
}

async function deleteHandler(req: AuthenticatedLeaveRequest, params: { leaveTypeId: string }) {
  const typeIndex = mockLeaveTypes.findIndex((t) => t.id === params.leaveTypeId);

  if (typeIndex === -1) {
    return NextResponse.json({ success: false, message: 'Leave policy not found.' }, { status: 404 });
  }

  const currentType = mockLeaveTypes[typeIndex];

  // Remove from mockLeaveTypes
  mockLeaveTypes.splice(typeIndex, 1);

  // Remove from mockLeaveBalances in-place
  const remainingBalances = mockLeaveBalances.filter((b: LeaveBalance) => b.leaveTypeId !== params.leaveTypeId);
  const removedBalCount = mockLeaveBalances.length - remainingBalances.length;
  mockLeaveBalances.length = 0;
  mockLeaveBalances.push(...remainingBalances);

  // Create Audit Entry
  mockLeaveAuditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: 'N/A',
    leaveTypeId: params.leaveTypeId,
    action: 'POLICY_DELETE',
    oldValue: JSON.stringify(currentType),
    newValue: null,
    performedBy: req.user?.name || 'Super Admin',
    userRole: req.user?.role || 'SUPER_ADMIN',
    reason: `Permanently deleted leave policy "${currentType.name}" (${currentType.code}) and cleared ${removedBalCount} balance allocations.`,
    ipAddress: '127.0.0.1',
    deviceInfo: req.headers.get('user-agent') || 'Browser',
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({
    success: true,
    message: `Leave policy "${currentType.name}" has been permanently deleted.`
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { leaveTypeId: string } }) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => handler(req as AuthenticatedLeaveRequest, params));
}

export async function DELETE(req: NextRequest, { params }: { params: { leaveTypeId: string } }) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => deleteHandler(req as AuthenticatedLeaveRequest, params));
}

