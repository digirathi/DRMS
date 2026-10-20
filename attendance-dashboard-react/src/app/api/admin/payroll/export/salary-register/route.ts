import { payrollAccessError } from '@/middleware/payrollAuthMiddleware';
import { NextRequest, NextResponse } from 'next/server';
import { mockCompensationProfiles, calculatePayrollItem } from '@/data/mockPayroll';

export async function GET(request: NextRequest) {
  const denied=payrollAccessError(request); if(denied) return denied;
  const headers = [
    'Employee ID',
    'Employee Name',
    'Department',
    'Designation',
    'Calendar Days',
    'Payable Days',
    'LWP Days',
    'Basic',
    'HRA',
    'Special Allowance',
    'Performance Bonus',
    'Overtime Pay',
    'Gross Pay',
    'LWP Deduction',
    'EPF Employee (12%)',
    'ESIC Employee',
    'Professional Tax',
    'TDS',
    'Other Deductions',
    'Total Deductions',
    'Net Take Home',
    'EPF Employer',
    'ESIC Employer',
    'Total Monthly CTC',
    'Status'
  ];

  const rows = [headers];

  mockCompensationProfiles.forEach((emp) => {
    const item = calculatePayrollItem(emp);
    rows.push([
      item.employeeId,
      item.name,
      item.department,
      item.designation,
      String(item.daysInMonth),
      String(item.payableDays),
      String(item.lwpDays),
      String(item.basic),
      String(item.hra),
      String(item.special),
      String(item.bonus),
      String(item.overtime),
      String(item.grossPay),
      String(item.lwpDeduction),
      String(item.epfEmployee),
      String(item.esicEmployee),
      String(item.pt),
      String(item.tds),
      String(item.adhocDeduction),
      String(item.totalDeductions),
      String(item.netPay),
      String(item.epfEmployer),
      String(item.esicEmployer),
      String(item.totalCtcMonth),
      item.status
    ]);
  });

  const csvContent = rows
    .map((r) => r.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="DigiRathi_Salary_Register_Aug_2026.csv"'
    }
  });
}
