import { payrollAccessError } from '@/middleware/payrollAuthMiddleware';
import { NextRequest, NextResponse } from 'next/server';
import {
  mockCompensationProfiles,
  mockVariableAdjustments,
  calculatePayrollItem
} from '@/data/mockPayroll';

export async function GET(request: NextRequest) {
  const denied = payrollAccessError(request); if (denied) return denied;
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = parseInt(searchParams.get('month') || '8', 10);
    const year = parseInt(searchParams.get('year') || '2026', 10);

    const items = mockCompensationProfiles.map((p) =>
      calculatePayrollItem(p, mockVariableAdjustments)
    );

    const totalGross = items.reduce((s, i) => s + i.grossPay, 0);
    const totalDeductions = items.reduce((s, i) => s + i.totalDeductions, 0);
    const totalNet = items.reduce((s, i) => s + i.netPay, 0);
    const totalLwp = items.reduce((s, i) => s + i.lwpDeduction, 0);

    return NextResponse.json({
      success: true,
      cycleMonth: month,
      cycleYear: year,
      totalEmployees: items.length,
      totalGross,
      totalDeductions,
      totalNet,
      totalLwp,
      items
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch payroll calculations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const denied = payrollAccessError(request); if (denied) return denied;
  try {
    const body = await request.json();
    const { month, year } = body;

    const items = mockCompensationProfiles.map((p) =>
      calculatePayrollItem(p, mockVariableAdjustments)
    );

    return NextResponse.json({
      success: true,
      message: `Payroll run generated for ${month}/${year}`,
      cycleMonth: month,
      cycleYear: year,
      status: 'DRAFT',
      totalEmployees: items.length,
      items
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to generate payroll run' },
      { status: 500 }
    );
  }
}
