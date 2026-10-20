// Public demo fixtures: identities and financial identifiers are placeholders.
// ============================================================================
// DigiRathi DRMS - Mock Data & Calculation Engine for Payroll
// ============================================================================

import {
  EmployeeCompensationProfile,
  SalaryStructure,
  VariableAdjustment,
  PayrollAuditLog,
  StatutoryRulesConfig,
  PayrollItem
} from '@/types/payroll';

export const mockStatutoryConfig: StatutoryRulesConfig = {
  epfEnabled: true,
  epfRateEe: 0.12,
  epfRateEr: 0.12,
  epfWageCeiling: 15000,
  epfEnforceCeiling: true,
  esicEnabled: true,
  esicRateEe: 0.0075,
  esicRateEr: 0.0325,
  esicThreshold: 21000,
  ptEnabled: true,
  ptMonthly: 200,
  ptFeb: 300,
  tdsRegime: 'NEW'
};

export const mockSalaryStructures: SalaryStructure[] = [
  {
    id: 'struct-tech',
    name: 'Standard Tech & Engineering',
    description: 'Optimized for core software engineering roles with standard 40/20/40 component split.',
    basicPct: 40,
    hraPct: 20,
    specialPct: 40,
    hasEpf: true,
    hasEsic: true,
    hasPt: true,
    employeesCount: 2
  },
  {
    id: 'struct-lead',
    name: 'Leadership & Executive',
    description: 'Tailored for senior directors and department leads with high basic and HRA allocation.',
    basicPct: 50,
    hraPct: 25,
    specialPct: 25,
    hasEpf: true,
    hasEsic: false,
    hasPt: true,
    employeesCount: 1
  },
  {
    id: 'struct-prod',
    name: 'Product & Design Tier',
    description: 'Standard structure for product managers, researchers, and UI/UX designers.',
    basicPct: 45,
    hraPct: 22.5,
    specialPct: 32.5,
    hasEpf: true,
    hasEsic: true,
    hasPt: true,
    employeesCount: 1
  },
  {
    id: 'struct-ops',
    name: 'Operations & Support',
    description: 'Suitable for administrative, operations, and entry-level roles with statutory ESIC coverage.',
    basicPct: 50,
    hraPct: 25,
    specialPct: 25,
    hasEpf: true,
    hasEsic: true,
    hasPt: true,
    employeesCount: 3
  }
];

export const mockCompensationProfiles: EmployeeCompensationProfile[] = [
  {
    employeeId: 'DR-1001',
    name: 'Demo Person 13',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    doj: '2024-03-15',
    annualCtc: 1440000,
    monthlyGross: 120000,
    structureId: 'struct-tech',
    structureName: 'Standard Tech & Engineering',
    bankDetails: {
      bankName: "Demo Bank",
      accountNumber: '00000000000002',
      ifsc: 'DEMO0000001',
      accountType: 'Salary Account'
    },
    statutory: {
      pan: 'DEMOA0000A',
      uan: '000000000003',
      esic: 'N/A (Exempt)',
      taxRegime: 'NEW'
    },
    status: 'Active'
  },
  {
    employeeId: 'DR-1002',
    name: 'Demo Person 14',
    department: 'Product',
    designation: 'Product Lead',
    doj: '2025-01-10',
    annualCtc: 1800000,
    monthlyGross: 150000,
    structureId: 'struct-lead',
    structureName: 'Leadership & Executive',
    bankDetails: {
      bankName: "Demo Bank",
      accountNumber: '000000000004',
      ifsc: 'DEMO0000001',
      accountType: 'Salary Account'
    },
    statutory: {
      pan: 'DEMOA0000A',
      uan: '000000000005',
      esic: 'N/A (Exempt)',
      taxRegime: 'NEW'
    },
    status: 'Active'
  },
  {
    employeeId: 'DR-1003',
    name: 'Demo Person 16',
    department: 'Design',
    designation: 'UI/UX Designer',
    doj: '2026-05-01',
    annualCtc: 960000,
    monthlyGross: 80000,
    structureId: 'struct-prod',
    structureName: 'Product & Design Tier',
    bankDetails: {
      bankName: "Demo Bank",
      accountNumber: '00000000006',
      ifsc: 'DEMO0000001',
      accountType: 'Savings Account'
    },
    statutory: {
      pan: 'DEMOA0000A',
      uan: '000000000007',
      esic: 'N/A (Exempt)',
      taxRegime: 'NEW'
    },
    status: 'Active'
  },
  {
    employeeId: 'DR-1004',
    name: 'Demo Person 17',
    department: 'Engineering',
    designation: 'Frontend Developer',
    doj: '2023-11-01',
    annualCtc: 780000,
    monthlyGross: 65000,
    structureId: 'struct-tech',
    structureName: 'Standard Tech & Engineering',
    bankDetails: {
      bankName: "Demo Bank",
      accountNumber: '000000000000008',
      ifsc: 'DEMO0000001',
      accountType: 'Salary Account'
    },
    statutory: {
      pan: 'DEMOA0000A',
      uan: '000000000009',
      esic: 'N/A (Exempt)',
      taxRegime: 'NEW'
    },
    status: 'Active'
  },
  {
    employeeId: 'DR-1005',
    name: 'Demo Person 18',
    department: 'Human Resources',
    designation: 'HR Specialist',
    doj: '2024-06-01',
    annualCtc: 600000,
    monthlyGross: 50000,
    structureId: 'struct-ops',
    structureName: 'Operations & Support',
    bankDetails: {
      bankName: "Demo Bank",
      accountNumber: '0000000010',
      ifsc: 'DEMO0000001',
      accountType: 'Salary Account'
    },
    statutory: {
      pan: 'DEMOA0000A',
      uan: '000000000011',
      esic: 'N/A (Exempt)',
      taxRegime: 'NEW'
    },
    status: 'Active'
  },
  {
    employeeId: 'DR-1006',
    name: 'Demo Person 19',
    department: 'Sales',
    designation: 'Sales Executive',
    doj: '2025-02-15',
    annualCtc: 480000,
    monthlyGross: 40000,
    structureId: 'struct-ops',
    structureName: 'Operations & Support',
    bankDetails: {
      bankName: "Demo Bank",
      accountNumber: '00000000000012',
      ifsc: 'DEMO0000001',
      accountType: 'Salary Account'
    },
    statutory: {
      pan: 'DEMOA0000A',
      uan: '000000000013',
      esic: 'N/A (Exempt)',
      taxRegime: 'NEW'
    },
    status: 'Active'
  },
  {
    employeeId: 'DR-1007',
    name: 'Demo Person 21',
    department: 'Operations',
    designation: 'Trainee Associate',
    doj: '2026-06-15',
    annualCtc: 240000,
    monthlyGross: 20000,
    structureId: 'struct-ops',
    structureName: 'Operations & Support',
    bankDetails: {
      bankName: "Demo Bank",
      accountNumber: '000000000014',
      ifsc: 'DEMO0000001',
      accountType: 'Savings Account'
    },
    statutory: {
      pan: 'DEMOA0000A',
      uan: '000000000015',
      esic: '00000000000000016',
      taxRegime: 'NEW'
    },
    status: 'Active'
  }
];

export const mockVariableAdjustments: VariableAdjustment[] = [
  {
    id: 'adj-1',
    employeeId: 'DR-1001',
    employeeName: 'Demo Person 13',
    type: 'BONUS',
    label: 'Quarterly Performance Bonus',
    amount: 10000,
    month: 8,
    year: 2026,
    reason: 'Outstanding delivery on multi-tenant leave architecture.',
    approvedBy: 'Demo Person 15 (Super Admin)',
    date: '2026-08-25'
  },
  {
    id: 'adj-2',
    employeeId: 'DR-1004',
    employeeName: 'Demo Person 17',
    type: 'OVERTIME',
    label: 'Critical Release Overtime (14h)',
    amount: 3500,
    month: 8,
    year: 2026,
    reason: 'Weekend production incident support.',
    approvedBy: 'Demo Person 01 (Manager)',
    date: '2026-08-20'
  },
  {
    id: 'adj-3',
    employeeId: 'DR-1005',
    employeeName: 'Demo Person 18',
    type: 'REIMBURSEMENT',
    label: 'HR Tech Summit Travel Reimbursement',
    amount: 4200,
    month: 8,
    year: 2026,
    reason: 'Client recruitment travel expenses approved.',
    approvedBy: 'Demo Person 15 (Super Admin)',
    date: '2026-08-18'
  }
];

export const mockPayrollAuditLogs: PayrollAuditLog[] = [
  {
    id: 'pal-101',
    action: 'RUN_FINALIZED',
    cycle: 'July 2026',
    performedBy: 'Demo Person 15',
    userRole: 'SUPER_ADMIN',
    reason: 'Finalized July 2026 payroll run and locked bank disbursement register.',
    timestamp: '2026-07-31T18:30:00Z'
  },
  {
    id: 'pal-102',
    action: 'PAYSLIPS_PUBLISHED',
    cycle: 'July 2026',
    performedBy: 'Demo Person 15',
    userRole: 'SUPER_ADMIN',
    reason: 'Dispatched 7 digital payslips to employee self-service portal.',
    timestamp: '2026-08-01T09:15:00Z'
  }
];

export function calculatePayrollItem(
  emp: EmployeeCompensationProfile,
  adjustments: VariableAdjustment[] = mockVariableAdjustments,
  onHoldIds: Set<string> = new Set(),
  runStatus: 'DRAFT' | 'FINALIZED' = 'DRAFT'
): PayrollItem {
  const daysInMonth = 31;
  const lwpDays = emp.employeeId === 'DR-1005' ? 3 : 0;
  const payableDays = Math.max(0, daysInMonth - lwpDays);

  const struct = mockSalaryStructures.find((s) => s.id === emp.structureId) || mockSalaryStructures[0];
  const baseGross = emp.monthlyGross;
  const basic = Math.round(baseGross * (struct.basicPct / 100));
  const hra = Math.round(baseGross * (struct.hraPct / 100));
  const special = Math.max(0, baseGross - basic - hra);

  const empAdjs = adjustments.filter((a) => a.employeeId === emp.employeeId && a.month === 8 && a.year === 2026);
  const bonus = empAdjs
    .filter((a) => a.type === 'BONUS' || a.type === 'REIMBURSEMENT')
    .reduce((s, a) => s + (Number(a.amount) || 0), 0);
  const overtime = empAdjs
    .filter((a) => a.type === 'OVERTIME')
    .reduce((s, a) => s + (Number(a.amount) || 0), 0);
  const adhocDeduction = empAdjs
    .filter((a) => a.type === 'DEDUCTION')
    .reduce((s, a) => s + (Number(a.amount) || 0), 0);

  const grossPay = baseGross + bonus + overtime;
  const lwpDeduction = lwpDays > 0 ? Math.round((baseGross / daysInMonth) * lwpDays) : 0;

  const epfWages = mockStatutoryConfig.epfEnforceCeiling
    ? Math.min(basic, mockStatutoryConfig.epfWageCeiling)
    : basic;
  const epfEmployee = mockStatutoryConfig.epfEnabled ? Math.round(epfWages * mockStatutoryConfig.epfRateEe) : 0;
  const epfEmployer = mockStatutoryConfig.epfEnabled ? Math.round(epfWages * mockStatutoryConfig.epfRateEr) : 0;

  let esicEmployee = 0;
  let esicEmployer = 0;
  if (mockStatutoryConfig.esicEnabled && baseGross <= mockStatutoryConfig.esicThreshold) {
    esicEmployee = Math.round(grossPay * mockStatutoryConfig.esicRateEe);
    esicEmployer = Math.round(grossPay * mockStatutoryConfig.esicRateEr);
  }

  const pt = mockStatutoryConfig.ptEnabled ? mockStatutoryConfig.ptMonthly : 0;

  const annualTaxable = Math.max(0, baseGross * 12 - 75000);
  let annualTax = 0;
  if (annualTaxable > 300000) {
    annualTax += Math.min(annualTaxable - 300000, 400000) * 0.05;
    if (annualTaxable > 700000) {
      annualTax += Math.min(annualTaxable - 700000, 300000) * 0.1;
      if (annualTaxable > 1000000) {
        annualTax += Math.min(annualTaxable - 1000000, 200000) * 0.15;
        if (annualTaxable > 1200000) {
          annualTax += Math.min(annualTaxable - 1200000, 300000) * 0.2;
        }
      }
    }
  }
  const tds = Math.round(annualTax / 12);

  const totalDeductions = lwpDeduction + epfEmployee + esicEmployee + pt + tds + adhocDeduction;
  const netPay = Math.max(0, grossPay - totalDeductions);
  const totalCtcMonth = grossPay + epfEmployer + esicEmployer;
  const isOnHold = onHoldIds.has(emp.employeeId);

  return {
    employeeId: emp.employeeId,
    name: emp.name,
    department: emp.department,
    designation: emp.designation,
    doj: emp.doj,
    bankDetails: emp.bankDetails,
    statutory: emp.statutory,
    daysInMonth,
    payableDays,
    lwpDays,
    basic,
    hra,
    special,
    baseGross,
    bonus,
    overtime,
    grossPay,
    lwpDeduction,
    epfEmployee,
    epfEmployer,
    esicEmployee,
    esicEmployer,
    pt,
    tds,
    adhocDeduction,
    totalDeductions,
    netPay,
    totalCtcMonth,
    isOnHold,
    status: isOnHold ? 'ON_HOLD' : runStatus
  };
}

export function numberToIndianWords(num: number): string {
  num = Math.round(Number(num) || 0);
  if (num === 0) return 'Zero Rupees Only';

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function numToWordsUnder1000(n: number): string {
    let str = '';
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 20)] + ' ';
      n %= 20;
    }
    if (n > 0) {
      str += ones[n] + ' ';
    }
    return str.trim();
  }

  let words = '';
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const remainder = num;

  if (crore > 0) words += numToWordsUnder1000(crore) + ' Crore ';
  if (lakh > 0) words += numToWordsUnder1000(lakh) + ' Lakh ';
  if (thousand > 0) words += numToWordsUnder1000(thousand) + ' Thousand ';
  if (remainder > 0) words += numToWordsUnder1000(remainder) + ' ';

  return 'Rupees ' + words.trim() + ' Only';
}

export function formatIndianCurrency(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(val) || 0);
}
