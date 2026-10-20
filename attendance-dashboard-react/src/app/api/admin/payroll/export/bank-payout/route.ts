import { payrollAccessError } from '@/middleware/payrollAuthMiddleware';
import { NextRequest, NextResponse } from 'next/server';
import { mockCompensationProfiles, calculatePayrollItem } from '@/data/mockPayroll';

export async function GET(request: NextRequest) {
  const denied=payrollAccessError(request); if(denied) return denied;
  const headers = [
    'Debit Account',
    'Beneficiary Name',
    'Beneficiary Account Number',
    'IFSC Code',
    'Net Payout Amount (INR)',
    'Payment Mode',
    'Narration'
  ];

  const rows = [headers];

  mockCompensationProfiles.forEach((emp) => {
    const item = calculatePayrollItem(emp);
    rows.push([
      '00000000000001',
      item.name,
      emp.bankDetails.accountNumber,
      emp.bankDetails.ifsc,
      String(item.netPay),
      'NEFT',
      `SALARY AUG 2026 ${item.employeeId}`
    ]);
  });

  const csvContent = rows
    .map((r) => r.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="DigiRathi_Bank_Payout_Aug_2026.csv"'
    }
  });
}
