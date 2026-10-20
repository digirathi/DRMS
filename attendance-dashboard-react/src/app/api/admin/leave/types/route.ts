import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../middleware/leaveAuthMiddleware';
import { mockLeaveTypes, mockLeaveAuditLogs } from '../../../../../data/mockLeave';
import { LeaveType } from '../../../../../types/leave';

async function getHandler(req: AuthenticatedLeaveRequest) {
  return NextResponse.json({
    success: true,
    data: mockLeaveTypes
  });
}

async function postHandler(req: AuthenticatedLeaveRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON payload.' }, { status: 400 });
  }

  const {
    name,
    code,
    description,
    isPaid = true,
    isActive = true,
    displayColor = '#6366f1',
    annualAllocation = 12,
    minimumDuration = 0.5,
    maximumDuration = null,
    maximumConsecutiveDays = null,
    minimumNoticeDays = 1,
    allowHalfDay = true,
    allowNegativeBalance = false,
    negativeBalanceLimit = 0,
    carryForwardEnabled = false,
    maximumCarryForward = null,
    carryForwardExpiryDays = null,
    encashmentEnabled = false,
    attachmentRequired = false,
    attachmentRequiredAfterDays = null,
    countWeekends = false,
    countHolidays = false,
    sandwichRuleEnabled = false,
    availableDuringProbation = true,
    autoRefillEnabled = false,
    autoRefillFrequency = null,
    autoRefillAmount = null,
    refillDayOfWeek = null,
    refillDayOfMonth = null,
    refillDuringProbation = false,
    maximumBalanceCap = null
  } = body;

  if (typeof name !== 'string' || !name.trim() || typeof code !== 'string' || !/^[A-Za-z0-9]+$/.test(code.trim()) || !Number.isFinite(Number(annualAllocation)) || Number(annualAllocation)<0 || Number(negativeBalanceLimit)>0) {
    return NextResponse.json(
      { success: false, message: 'Leave Type Name and Leave Code are mandatory.' },
      { status: 400 }
    );
  }

  // Check code uniqueness
  const existingCode = mockLeaveTypes.find((t) => t.code.toUpperCase() === code.toUpperCase().trim());
  if (existingCode) {
    return NextResponse.json(
      { success: false, message: `Leave type with code '${code}' already exists.` },
      { status: 400 }
    );
  }

  const newType: LeaveType = {
    id: `lt-${Date.now()}`,
    name: name.trim(),
    code: code.trim().toUpperCase(),
    description: description?.trim() || null,
    isPaid: Boolean(isPaid),
    isActive: Boolean(isActive),
    displayColor: displayColor || '#6366f1',
    annualAllocation: Number(annualAllocation),
    minimumDuration: Number(minimumDuration),
    maximumDuration: maximumDuration ? Number(maximumDuration) : null,
    maximumConsecutiveDays: maximumConsecutiveDays ? Number(maximumConsecutiveDays) : null,
    minimumNoticeDays: Number(minimumNoticeDays),
    allowHalfDay: Boolean(allowHalfDay),
    allowNegativeBalance: Boolean(allowNegativeBalance),
    negativeBalanceLimit: negativeBalanceLimit ? Number(negativeBalanceLimit) : null,
    carryForwardEnabled: Boolean(carryForwardEnabled),
    maximumCarryForward: maximumCarryForward ? Number(maximumCarryForward) : null,
    carryForwardExpiryDays: carryForwardExpiryDays ? Number(carryForwardExpiryDays) : null,
    encashmentEnabled: Boolean(encashmentEnabled),
    attachmentRequired: Boolean(attachmentRequired),
    attachmentRequiredAfterDays: attachmentRequiredAfterDays ? Number(attachmentRequiredAfterDays) : null,
    countWeekends: Boolean(countWeekends),
    countHolidays: Boolean(countHolidays),
    sandwichRuleEnabled: Boolean(sandwichRuleEnabled),
    availableDuringProbation: Boolean(availableDuringProbation),
    creditableOnAccrualBasis: false, accrualFrequency: 'YEARLY', accrualAmount: 0,
    autoRefillEnabled: false,
    autoRefillFrequency: null,
    autoRefillAmount: 0,
    refillDayOfWeek: refillDayOfWeek ? Number(refillDayOfWeek) : null,
    refillDayOfMonth: refillDayOfMonth ? Number(refillDayOfMonth) : null,
    refillDuringProbation: Boolean(refillDuringProbation),
    maximumBalanceCap: maximumBalanceCap ? Number(maximumBalanceCap) : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0
  };

  mockLeaveTypes.unshift(newType);

  // Create Audit Entry
  mockLeaveAuditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: 'N/A',
    leaveTypeId: newType.id,
    action: 'POLICY_CREATE',
    oldValue: null,
    newValue: JSON.stringify({ name: newType.name, code: newType.code }),
    performedBy: req.user?.name || 'Super Admin',
    userRole: req.user?.role || 'SUPER_ADMIN',
    reason: `Created new leave type: ${newType.name}`,
    ipAddress: '127.0.0.1',
    deviceInfo: req.headers.get('user-agent') || 'Browser',
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({
    success: true,
    message: 'Leave type created successfully.',
    data: newType
  });
}

export async function GET(req: NextRequest) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => getHandler(req as AuthenticatedLeaveRequest));
}

export async function POST(req: NextRequest) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => postHandler(req as AuthenticatedLeaveRequest));
}
