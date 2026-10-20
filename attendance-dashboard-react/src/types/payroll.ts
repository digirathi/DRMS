// ============================================================================
// DigiRathi DRMS - TypeScript Interfaces for Enterprise Payroll Management
// ============================================================================

export type PayrollTabId =
  | 'dashboard'
  | 'register'
  | 'structures'
  | 'profiles'
  | 'payslips'
  | 'reports';

export type PayrollRunStatus = 'DRAFT' | 'UNDER_REVIEW' | 'FINALIZED' | 'PAID';

export type TaxRegime = 'NEW' | 'OLD';

export type AdjustmentType = 'BONUS' | 'OVERTIME' | 'REIMBURSEMENT' | 'DEDUCTION';

export interface BankAccountDetails {
  bankName: string;
  accountNumber: string;
  ifsc: string;
  accountType: string;
}

export interface StatutoryIdentifiers {
  pan: string;
  uan: string;
  esic: string;
  taxRegime: TaxRegime;
}

export interface EmployeeCompensationProfile {
  employeeId: string;
  name: string;
  department: string;
  designation: string;
  doj: string;
  annualCtc: number;
  monthlyGross: number;
  structureId: string;
  structureName: string;
  bankDetails: BankAccountDetails;
  statutory: StatutoryIdentifiers;
  status: 'Active' | 'Inactive' | 'On Notice';
}

export interface SalaryStructure {
  id: string;
  name: string;
  description: string;
  basicPct: number;
  hraPct: number;
  specialPct: number;
  hasEpf: boolean;
  hasEsic: boolean;
  hasPt: boolean;
  employeesCount: number;
}

export interface VariableAdjustment {
  id: string;
  employeeId: string;
  employeeName: string;
  type: AdjustmentType;
  label: string;
  amount: number;
  month: number;
  year: number;
  reason: string;
  approvedBy: string;
  date: string;
}

export interface PayrollItem {
  employeeId: string;
  name: string;
  department: string;
  designation: string;
  doj: string;
  bankDetails: BankAccountDetails;
  statutory: StatutoryIdentifiers;
  daysInMonth: number;
  payableDays: number;
  lwpDays: number;
  basic: number;
  hra: number;
  special: number;
  baseGross: number;
  bonus: number;
  overtime: number;
  grossPay: number;
  lwpDeduction: number;
  epfEmployee: number;
  epfEmployer: number;
  esicEmployee: number;
  esicEmployer: number;
  pt: number;
  tds: number;
  adhocDeduction: number;
  totalDeductions: number;
  netPay: number;
  totalCtcMonth: number;
  isOnHold: boolean;
  status: 'PAYABLE' | 'ON_HOLD' | PayrollRunStatus;
}

export interface PayrollRun {
  id: string;
  cycleMonth: number;
  cycleYear: number;
  cycleName: string;
  status: PayrollRunStatus;
  totalEmployees: number;
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPayout: number;
  totalLwpSavings: number;
  createdAt: string;
  finalizedAt?: string | null;
  finalizedBy?: string | null;
  items: PayrollItem[];
}

export interface StatutoryRulesConfig {
  epfEnabled: boolean;
  epfRateEe: number;
  epfRateEr: number;
  epfWageCeiling: number;
  epfEnforceCeiling: boolean;
  esicEnabled: boolean;
  esicRateEe: number;
  esicRateEr: number;
  esicThreshold: number;
  ptEnabled: boolean;
  ptMonthly: number;
  ptFeb: number;
  tdsRegime: TaxRegime;
}

export interface PayrollAuditLog {
  id: string;
  action: string;
  cycle: string;
  performedBy: string;
  userRole: string;
  reason: string;
  timestamp: string;
}
