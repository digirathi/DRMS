import { NextRequest, NextResponse } from 'next/server';
import { readDemoIdentity } from './demoIdentity';

export function payrollAccessError(req: NextRequest) {
  const user = readDemoIdentity(req);
  return user && ['SUPER_ADMIN', 'HR'].includes(user.role) ? null : NextResponse.json(
    { success: false, message: 'You do not have permission to access payroll.' }, { status: 403 }
  );
}
