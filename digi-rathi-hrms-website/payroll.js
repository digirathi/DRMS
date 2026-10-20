// Public demo fixtures: identities and financial identifiers are placeholders.
// ============================================================================
// DigiRathi DRMS - Enterprise Payroll Management Module (Indian Compliance)
// ============================================================================

(function() {
  "use strict";

  // Number to Indian Currency Words Helper
  function numberToIndianWords(num) {
    num = Math.round(Number(num) || 0);
    if (num === 0) return "Zero Rupees Only";
    
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
                  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    function numToWordsUnder1000(n) {
      let str = "";
      if (n >= 100) {
        str += ones[Math.floor(n / 100)] + " Hundred ";
        n %= 100;
      }
      if (n >= 20) {
        str += tens[Math.floor(n / 20)] + " ";
        n %= 20;
      }
      if (n > 0) {
        str += ones[n] + " ";
      }
      return str.trim();
    }

    let words = "";
    const crore = Math.floor(num / 10000000);
    num %= 10000000;
    const lakh = Math.floor(num / 100000);
    num %= 100000;
    const thousand = Math.floor(num / 1000);
    num %= 1000;
    const remainder = num;

    if (crore > 0) words += numToWordsUnder1000(crore) + " Crore ";
    if (lakh > 0) words += numToWordsUnder1000(lakh) + " Lakh ";
    if (thousand > 0) words += numToWordsUnder1000(thousand) + " Thousand ";
    if (remainder > 0) words += numToWordsUnder1000(remainder) + " ";

    return "Rupees " + words.trim() + " Only";
  }

  // Initial Compensation Profiles for Employees
  const initialCompensationProfiles = [
    {
      employeeId: "DR-1001",
      name: "Demo Person 13",
      department: "Engineering",
      designation: "Senior Software Engineer",
      doj: "2024-03-15",
      annualCtc: 1440000,
      monthlyGross: 120000,
      structureId: "struct-tech",
      structureName: "Standard Tech & Engineering",
      bankDetails: {
        bankName: "Demo Bank",
        accountNumber: "00000000000002",
        ifsc: "DEMO0000001",
        accountType: "Salary Account"
      },
      statutory: {
        pan: "DEMOA0000A",
        uan: "000000000003",
        esic: "N/A (Exempt)",
        taxRegime: "NEW"
      },
      status: "Active"
    },
    {
      employeeId: "DR-1002",
      name: "Demo Person 14",
      department: "Product",
      designation: "Product Lead",
      doj: "2025-01-10",
      annualCtc: 1800000,
      monthlyGross: 150000,
      structureId: "struct-lead",
      structureName: "Leadership & Executive",
      bankDetails: {
        bankName: "Demo Bank",
        accountNumber: "000000000004",
        ifsc: "DEMO0000001",
        accountType: "Salary Account"
      },
      statutory: {
        pan: "DEMOA0000A",
        uan: "000000000005",
        esic: "N/A (Exempt)",
        taxRegime: "NEW"
      },
      status: "Active"
    },
    {
      employeeId: "DR-1003",
      name: "Demo Person 16",
      department: "Design",
      designation: "UI/UX Designer",
      doj: "2026-05-01",
      annualCtc: 960000,
      monthlyGross: 80000,
      structureId: "struct-prod",
      structureName: "Product & Design Tier",
      bankDetails: {
        bankName: "Demo Bank",
        accountNumber: "00000000006",
        ifsc: "DEMO0000001",
        accountType: "Savings Account"
      },
      statutory: {
        pan: "DEMOA0000A",
        uan: "000000000007",
        esic: "N/A (Exempt)",
        taxRegime: "NEW"
      },
      status: "Active"
    },
    {
      employeeId: "DR-1004",
      name: "Demo Person 17",
      department: "Engineering",
      designation: "Frontend Developer",
      doj: "2023-11-01",
      annualCtc: 780000,
      monthlyGross: 65000,
      structureId: "struct-tech",
      structureName: "Standard Tech & Engineering",
      bankDetails: {
        bankName: "Demo Bank",
        accountNumber: "000000000000008",
        ifsc: "DEMO0000001",
        accountType: "Salary Account"
      },
      statutory: {
        pan: "DEMOA0000A",
        uan: "000000000009",
        esic: "N/A (Exempt)",
        taxRegime: "NEW"
      },
      status: "Active"
    },
    {
      employeeId: "DR-1005",
      name: "Demo Person 18",
      department: "Human Resources",
      designation: "HR Specialist",
      doj: "2024-06-01",
      annualCtc: 600000,
      monthlyGross: 50000,
      structureId: "struct-ops",
      structureName: "Operations & Support",
      bankDetails: {
        bankName: "Demo Bank",
        accountNumber: "0000000010",
        ifsc: "DEMO0000001",
        accountType: "Salary Account"
      },
      statutory: {
        pan: "DEMOA0000A",
        uan: "000000000011",
        esic: "N/A (Exempt)",
        taxRegime: "NEW"
      },
      status: "Active"
    },
    {
      employeeId: "DR-1006",
      name: "Demo Person 19",
      department: "Sales",
      designation: "Sales Executive",
      doj: "2025-02-15",
      annualCtc: 480000,
      monthlyGross: 40000,
      structureId: "struct-ops",
      structureName: "Operations & Support",
      bankDetails: {
        bankName: "Demo Bank",
        accountNumber: "00000000000012",
        ifsc: "DEMO0000001",
        accountType: "Salary Account"
      },
      statutory: {
        pan: "DEMOA0000A",
        uan: "000000000013",
        esic: "N/A (Exempt)",
        taxRegime: "NEW"
      },
      status: "Active"
    },
    {
      employeeId: "DR-1007",
      name: "Demo Person 21",
      department: "Operations",
      designation: "Trainee Associate",
      doj: "2026-06-15",
      annualCtc: 240000,
      monthlyGross: 20000,
      structureId: "struct-ops",
      structureName: "Operations & Support",
      bankDetails: {
        bankName: "Demo Bank",
        accountNumber: "000000000014",
        ifsc: "DEMO0000001",
        accountType: "Savings Account"
      },
      statutory: {
        pan: "DEMOA0000A",
        uan: "000000000015",
        esic: "00000000000000016",
        taxRegime: "NEW"
      },
      status: "Active"
    }
  ];

  // Salary Structure Templates
  const initialSalaryStructures = [
    {
      id: "struct-tech",
      name: "Standard Tech & Engineering",
      description: "Optimized for core software engineering roles with standard 40/20/40 component split.",
      basicPct: 40,
      hraPct: 20,
      specialPct: 40,
      hasEpf: true,
      hasEsic: true,
      hasPt: true,
      employeesCount: 2
    },
    {
      id: "struct-lead",
      name: "Leadership & Executive",
      description: "Tailored for senior directors and department leads with high basic and HRA allocation.",
      basicPct: 50,
      hraPct: 25,
      specialPct: 25,
      hasEpf: true,
      hasEsic: false,
      hasPt: true,
      employeesCount: 1
    },
    {
      id: "struct-prod",
      name: "Product & Design Tier",
      description: "Standard structure for product managers, researchers, and UI/UX designers.",
      basicPct: 45,
      hraPct: 22.5,
      specialPct: 32.5,
      hasEpf: true,
      hasEsic: true,
      hasPt: true,
      employeesCount: 1
    },
    {
      id: "struct-ops",
      name: "Operations & Support",
      description: "Suitable for administrative, operations, and entry-level roles with statutory ESIC coverage.",
      basicPct: 50,
      hraPct: 25,
      specialPct: 25,
      hasEpf: true,
      hasEsic: true,
      hasPt: true,
      employeesCount: 3
    }
  ];

  // Ad-hoc Variable Pay Adjustments (August 2026)
  const initialVariableAdjustments = [
    {
      id: "adj-1",
      employeeId: "DR-1001",
      employeeName: "Demo Person 13",
      type: "BONUS",
      label: "Quarterly Performance Bonus",
      amount: 10000,
      month: 8,
      year: 2026,
      reason: "Outstanding delivery on multi-tenant leave architecture.",
      approvedBy: "Demo Person 15 (Super Admin)",
      date: "2026-08-25"
    },
    {
      id: "adj-2",
      employeeId: "DR-1004",
      employeeName: "Demo Person 17",
      type: "OVERTIME",
      label: "Critical Release Overtime (14h)",
      amount: 3500,
      month: 8,
      year: 2026,
      reason: "Weekend production incident support.",
      approvedBy: "Demo Person 01 (Manager)",
      date: "2026-08-20"
    },
    {
      id: "adj-3",
      employeeId: "DR-1005",
      employeeName: "Demo Person 18",
      type: "REIMBURSEMENT",
      label: "HR Tech Summit Travel Reimbursement",
      amount: 4200,
      month: 8,
      year: 2026,
      reason: "Client recruitment travel expenses approved.",
      approvedBy: "Demo Person 15 (Super Admin)",
      date: "2026-08-18"
    }
  ];

  // Immutable Audit Logs
  const initialPayrollAuditLogs = [
    {
      id: "pal-101",
      action: "RUN_FINALIZED",
      cycle: "July 2026",
      performedBy: "Demo Person 15",
      userRole: "SUPER_ADMIN",
      reason: "Finalized July 2026 payroll run and locked bank disbursement register.",
      timestamp: "2026-07-31T18:30:00Z"
    },
    {
      id: "pal-102",
      action: "PAYSLIPS_PUBLISHED",
      cycle: "July 2026",
      performedBy: "Demo Person 15",
      userRole: "SUPER_ADMIN",
      reason: "Dispatched 7 digital payslips to employee self-service portal.",
      timestamp: "2026-08-01T09:15:00Z"
    }
  ];

  // Global Payroll State
  window.payrollStore = {
    activeTab: "dashboard", // "dashboard" | "register" | "structures" | "profiles" | "payslips" | "reports"
    userRole: "SUPER_ADMIN",
    selectedMonth: 8,
    selectedYear: 2026,
    filters: {
      search: "",
      department: "ALL",
      status: "ALL"
    },
    activeModal: null, // "wizard" | "adjustPay" | "payslip" | "reviseSalary"
    wizardStep: 1,
    selectedEmployeeId: null,
    onHoldEmployees: new Set(),
    profiles: initialCompensationProfiles,
    structures: initialSalaryStructures,
    adjustments: initialVariableAdjustments,
    auditLogs: initialPayrollAuditLogs,
    currentRunStatus: "DRAFT", // "DRAFT" | "FINALIZED"
    finalizedAt: null,
    finalizedBy: null,
    payslipsPublished: false,
    statutoryConfig: {
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
      tdsRegime: "NEW"
    }
  };

  // --------------------------------------------------------------------------
  // Calculation Engine
  // --------------------------------------------------------------------------
  window.calculatePayrollItem = function(emp) {
    const store = window.payrollStore;
    const daysInMonth = 31; // August
    
    // Attendance & Leave Integration
    // Check leaveStore for unpaid leave applications in this month
    let lwpDays = 0;
    if (window.leaveStore && window.leaveStore.requests) {
      const monthPrefix = `${store.selectedYear}-${String(store.selectedMonth).padStart(2, "0")}`;
      const unpaids = window.leaveStore.requests.filter(r => 
        (r.employeeCode === emp.employeeId || r.employeeId === emp.employeeId) &&
        !r.isPaid && r.status === "APPROVED" &&
        (r.startDate.startsWith(monthPrefix) || r.endDate.startsWith(monthPrefix))
      );
      lwpDays = unpaids.reduce((sum, r) => sum + (Number(r.totalDays) || 0), 0);
    }
    // Specific preset for Demo Person 18 who has approved unpaid leave of 3 days
    if (emp.employeeId === "DR-1005" && lwpDays === 0) {
      lwpDays = 3;
    }

    const payableDays = Math.max(0, daysInMonth - lwpDays);

    // Structure split
    const struct = store.structures.find(s => s.id === emp.structureId) || store.structures[0];
    const baseGross = emp.monthlyGross;
    const basic = Math.round(baseGross * (struct.basicPct / 100));
    const hra = Math.round(baseGross * (struct.hraPct / 100));
    const special = Math.max(0, baseGross - basic - hra);

    // Variable pay / Adjustments
    const empAdjs = store.adjustments.filter(a => a.employeeId === emp.employeeId && a.month === store.selectedMonth && a.year === store.selectedYear);
    const bonus = empAdjs.filter(a => a.type === "BONUS" || a.type === "REIMBURSEMENT").reduce((s, a) => s + Number(a.amount || 0), 0);
    const overtime = empAdjs.filter(a => a.type === "OVERTIME").reduce((s, a) => s + Number(a.amount || 0), 0);
    const adhocDeduction = empAdjs.filter(a => a.type === "DEDUCTION").reduce((s, a) => s + Number(a.amount || 0), 0);

    // Gross Pay
    const grossPay = baseGross + bonus + overtime;

    // Deductions:
    // 1. Loss of Pay (LWP)
    const lwpDeduction = lwpDays > 0 ? Math.round((baseGross / daysInMonth) * lwpDays) : 0;

    // 2. EPF
    let epfWages = basic;
    if (store.statutoryConfig.epfEnforceCeiling) {
      epfWages = Math.min(basic, store.statutoryConfig.epfWageCeiling);
    }
    const epfEmployee = store.statutoryConfig.epfEnabled ? Math.round(epfWages * store.statutoryConfig.epfRateEe) : 0;
    const epfEmployer = store.statutoryConfig.epfEnabled ? Math.round(epfWages * store.statutoryConfig.epfRateEr) : 0;

    // 3. ESIC (Applicable if Gross <= 21,000)
    let esicEmployee = 0;
    let esicEmployer = 0;
    if (store.statutoryConfig.esicEnabled && baseGross <= store.statutoryConfig.esicThreshold) {
      esicEmployee = Math.round(grossPay * store.statutoryConfig.esicRateEe);
      esicEmployer = Math.round(grossPay * store.statutoryConfig.esicRateEr);
    }

    // 4. Professional Tax
    const pt = store.statutoryConfig.ptEnabled ? (store.selectedMonth === 2 ? store.statutoryConfig.ptFeb : store.statutoryConfig.ptMonthly) : 0;

    // 5. Estimated TDS under New Tax Regime
    const annualTaxable = Math.max(0, (baseGross * 12) - 75000); // 75k standard deduction
    let annualTax = 0;
    if (annualTaxable > 300000) {
      annualTax += Math.min(annualTaxable - 300000, 400000) * 0.05;
      if (annualTaxable > 700000) {
        annualTax += Math.min(annualTaxable - 700000, 300000) * 0.10;
        if (annualTaxable > 1000000) {
          annualTax += Math.min(annualTaxable - 1000000, 200000) * 0.15;
          if (annualTaxable > 1200000) {
            annualTax += Math.min(annualTaxable - 1200000, 300000) * 0.20;
          }
        }
      }
    }
    const tds = Math.round(annualTax / 12);

    const totalDeductions = lwpDeduction + epfEmployee + esicEmployee + pt + tds + adhocDeduction;
    const netPay = Math.max(0, grossPay - totalDeductions);
    const totalCtcMonth = grossPay + epfEmployer + esicEmployer;
    const isOnHold = store.onHoldEmployees.has(emp.employeeId);

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
      status: isOnHold ? "ON_HOLD" : store.currentRunStatus
    };
  };

  // --------------------------------------------------------------------------
  // Global Event Handlers
  // --------------------------------------------------------------------------
  window.switchPayrollTab = function(tabId) {
    window.payrollStore.activeTab = tabId;
    window.renderPayrollSuite();
  };

  window.filterPayrollDepartment = function(dept) {
    window.payrollStore.filters.department = dept;
    window.renderPayrollSuite();
  };

  window.filterPayrollStatus = function(status) {
    window.payrollStore.filters.status = status;
    window.renderPayrollSuite();
  };

  window.searchPayrollRegister = function(query) {
    window.payrollStore.filters.search = query.toLowerCase().trim();
    window.renderPayrollSuite();
  };

  window.toggleEmployeeHold = function(empId) {
    const store = window.payrollStore;
    if (store.onHoldEmployees.has(empId)) {
      store.onHoldEmployees.delete(empId);
      showToast("✓ Removed employee from hold. Included in current payout.", "success");
    } else {
      store.onHoldEmployees.add(empId);
      showToast("ℹ️ Employee payout put on hold. Excluded from disbursement.", "info");
    }
    window.renderPayrollSuite();
  };

  window.openRunPayrollWizard = function() {
    window.payrollStore.wizardStep = 1;
    window.payrollStore.activeModal = "wizard";
    window.renderPayrollSuite();
  };

  window.nextPayrollWizardStep = function() {
    if (window.payrollStore.wizardStep < 4) {
      window.payrollStore.wizardStep++;
      window.renderPayrollSuite();
    }
  };

  window.prevPayrollWizardStep = function() {
    if (window.payrollStore.wizardStep > 1) {
      window.payrollStore.wizardStep--;
      window.renderPayrollSuite();
    }
  };

  window.finishRunPayroll = function() {
    window.payrollStore.activeModal = null;
    showToast("✓ Payroll calculation completed for August 2026. Register updated!", "success");
    window.payrollStore.activeTab = "register";
    window.renderPayrollSuite();
  };

  window.finalizeCurrentPayrollRun = function() {
    const store = window.payrollStore;
    if (!confirm("Are you sure you want to finalize and lock the August 2026 Payroll Run? This will lock all compensation calculations, generate immutable audit records, and enable bank disbursement.")) {
      return;
    }
    store.currentRunStatus = "FINALIZED";
    store.finalizedAt = new Date().toISOString();
    store.finalizedBy = currentUser().name;
    store.auditLogs.unshift({
      id: `pal-${Date.now()}`,
      action: "RUN_FINALIZED",
      cycle: "August 2026",
      performedBy: currentUser().name,
      userRole: appState.role === "Super Admin" ? "SUPER_ADMIN" : "HR_ADMIN",
      reason: `Finalized August 2026 payroll run for ${store.profiles.length} employees.`,
      timestamp: new Date().toISOString()
    });
    showToast("✓ August 2026 Payroll Run is now FINALIZED and LOCKED!", "success");
    window.renderPayrollSuite();
  };

  window.publishAllPayslips = function() {
    const store = window.payrollStore;
    store.payslipsPublished = true;
    store.auditLogs.unshift({
      id: `pal-${Date.now()}`,
      action: "PAYSLIPS_PUBLISHED",
      cycle: "August 2026",
      performedBy: currentUser().name,
      userRole: appState.role === "Super Admin" ? "SUPER_ADMIN" : "HR_ADMIN",
      reason: `Published all digital payslips to employee self-service portal for August 2026.`,
      timestamp: new Date().toISOString()
    });
    showToast("✓ All 7 payslips successfully published to Employee Portals!", "success");
    window.renderPayrollSuite();
  };

  window.openAdjustPayModal = function(empId) {
    window.payrollStore.selectedEmployeeId = empId;
    window.payrollStore.activeModal = "adjustPay";
    window.renderPayrollSuite();
  };

  window.savePayAdjustment = function(event) {
    event.preventDefault();
    const form = event.target;
    const type = form.adjustType.value;
    const label = form.adjustLabel.value.trim();
    const amount = Number(form.adjustAmount.value) || 0;
    const reason = form.adjustReason.value.trim();
    const empId = window.payrollStore.selectedEmployeeId;
    const emp = window.payrollStore.profiles.find(p => p.employeeId === empId);

    if (amount <= 0) {
      alert("Adjustment amount must be greater than zero.");
      return;
    }
    if (!reason || reason.length < 5) {
      alert("Please provide a mandatory audit reason (at least 5 characters).");
      return;
    }

    window.payrollStore.adjustments.push({
      id: `adj-${Date.now()}`,
      employeeId: empId,
      employeeName: emp ? emp.name : "Employee",
      type: type,
      label: label,
      amount: amount,
      month: window.payrollStore.selectedMonth,
      year: window.payrollStore.selectedYear,
      reason: reason,
      approvedBy: currentUser().name,
      date: new Date().toISOString().slice(0, 10)
    });

    window.payrollStore.auditLogs.unshift({
      id: `pal-${Date.now()}`,
      action: "VARIABLE_ADJUSTMENT",
      cycle: "August 2026",
      performedBy: currentUser().name,
      userRole: appState.role === "Super Admin" ? "SUPER_ADMIN" : "HR_ADMIN",
      reason: `Added ${type} (${label}) of ₹${amount.toLocaleString()} for ${emp.name}. Reason: ${reason}`,
      timestamp: new Date().toISOString()
    });

    window.payrollStore.activeModal = null;
    showToast(`✓ Added ₹${amount.toLocaleString()} ${label} for ${emp.name}.`, "success");
    window.renderPayrollSuite();
  };

  window.openPayslipModal = function(empId) {
    window.payrollStore.selectedEmployeeId = empId;
    window.payrollStore.activeModal = "payslip";
    window.renderPayrollSuite();
  };

  window.openReviseSalaryModal = function(empId) {
    window.payrollStore.selectedEmployeeId = empId;
    window.payrollStore.activeModal = "reviseSalary";
    window.renderPayrollSuite();
  };

  window.saveSalaryRevision = function(event) {
    event.preventDefault();
    const form = event.target;
    const newCtc = Number(form.newAnnualCtc.value) || 0;
    const effectiveDate = form.effectiveDate.value;
    const reason = form.revisionReason.value.trim();
    const empId = window.payrollStore.selectedEmployeeId;
    const emp = window.payrollStore.profiles.find(p => p.employeeId === empId);

    if (newCtc <= 0) {
      alert("Please enter a valid Annual CTC.");
      return;
    }
    if (!reason || reason.length < 5) {
      alert("Please specify the revision reason / increment audit note.");
      return;
    }

    const oldCtc = emp.annualCtc;
    emp.annualCtc = newCtc;
    emp.monthlyGross = Math.round(newCtc / 12);

    window.payrollStore.auditLogs.unshift({
      id: `pal-${Date.now()}`,
      action: "SALARY_REVISION",
      cycle: "August 2026",
      performedBy: currentUser().name,
      userRole: appState.role === "Super Admin" ? "SUPER_ADMIN" : "HR_ADMIN",
      reason: `Revised CTC for ${emp.name} from ₹${oldCtc.toLocaleString()} to ₹${newCtc.toLocaleString()} effective ${effectiveDate}. Reason: ${reason}`,
      timestamp: new Date().toISOString()
    });

    window.payrollStore.activeModal = null;
    showToast(`✓ Revised salary for ${emp.name} to ₹${newCtc.toLocaleString()} / year.`, "success");
    window.renderPayrollSuite();
  };

  window.closePayrollModal = function() {
    window.payrollStore.activeModal = null;
    window.renderPayrollSuite();
  };

  window.printPayslip = function() {
    window.print();
  };

  // CSV Exporters
  window.exportBankPayoutCSV = function() {
    const store = window.payrollStore;
    const rows = [["Debit Account", "Beneficiary Name", "Beneficiary Account Number", "IFSC Code", "Net Payout Amount (INR)", "Payment Mode", "Narration"]];
    
    store.profiles.forEach(emp => {
      const item = window.calculatePayrollItem(emp);
      if (!item.isOnHold) {
        rows.push([
          "00000000000001", // DEMO corporate account - not a payment instruction
          item.name,
          emp.bankDetails.accountNumber,
          emp.bankDetails.ifsc,
          item.netPay,
          "NEFT",
          `SALARY AUG 2026 ${item.employeeId}`
        ]);
      }
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.map(val => `"${val}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DigiRathi_Bank_Payout_Aug_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    store.auditLogs.unshift({
      id: `pal-${Date.now()}`,
      action: "BANK_FILE_EXPORT",
      cycle: "August 2026",
      performedBy: currentUser().name,
      userRole: appState.role === "Super Admin" ? "SUPER_ADMIN" : "HR_ADMIN",
      reason: `Downloaded Bank Payout NEFT/RTGS CSV for August 2026 cycle.`,
      timestamp: new Date().toISOString()
    });
    showToast("✓ Bank Payout CSV downloaded successfully!", "success");
  };

  window.exportSalaryRegisterCSV = function() {
    const store = window.payrollStore;
    const headers = [
      "Employee ID", "Employee Name", "Department", "Designation", "Calendar Days", "Payable Days", "LWP Days",
      "Basic", "HRA", "Special Allowance", "Performance Bonus", "Overtime Pay", "Gross Pay",
      "LWP Deduction", "EPF Employee (12%)", "ESIC Employee", "Professional Tax", "TDS", "Other Deductions", "Total Deductions",
      "Net Take Home", "EPF Employer", "ESIC Employer", "Total Monthly CTC", "Status"
    ];
    const rows = [headers];

    store.profiles.forEach(emp => {
      const item = window.calculatePayrollItem(emp);
      rows.push([
        item.employeeId, item.name, item.department, item.designation, item.daysInMonth, item.payableDays, item.lwpDays,
        item.basic, item.hra, item.special, item.bonus, item.overtime, item.grossPay,
        item.lwpDeduction, item.epfEmployee, item.esicEmployee, item.pt, item.tds, item.adhocDeduction, item.totalDeductions,
        item.netPay, item.epfEmployer, item.esicEmployer, item.totalCtcMonth, item.status
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.map(val => `"${val}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DigiRathi_Salary_Register_Aug_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("✓ Salary Register CSV downloaded successfully!", "success");
  };

  // --------------------------------------------------------------------------
  // Main Renderer: renderPayrollSuite
  // --------------------------------------------------------------------------
  window.renderPayrollSuite = function() {
    const container = document.getElementById("payroll");
    if (!container) return;

    const store = window.payrollStore;
    const items = store.profiles.map(p => window.calculatePayrollItem(p));
    
    // Aggregate KPIs
    const totalGross = items.reduce((s, i) => s + i.grossPay, 0);
    const totalDeductions = items.reduce((s, i) => s + i.totalDeductions, 0);
    const totalNetPayout = items.filter(i => !i.isOnHold).reduce((s, i) => s + i.netPay, 0);
    const totalEmployees = items.length;
    const heldCount = items.filter(i => i.isOnHold).length;
    const totalLwpDeduction = items.reduce((s, i) => s + i.lwpDeduction, 0);

    // Outline SVG Icons
    const icons = {
      dashboard: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`,
      register: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>`,
      structures: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
      profiles: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      payslips: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
      reports: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
      zap: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
      lock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
      download: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
      eye: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
      edit: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
      pause: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
      check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
    };

    // Tabs Header List
    const tabs = [
      { id: "dashboard", label: "Dashboard", icon: icons.dashboard },
      { id: "register", label: "Salary Register", icon: icons.register },
      { id: "structures", label: "Salary Structures", icon: icons.structures },
      { id: "profiles", label: "Compensation Profiles", icon: icons.profiles },
      { id: "payslips", label: "Payslip Hub", icon: icons.payslips },
      { id: "reports", label: "Statutory & Bank", icon: icons.reports }
    ];

    // Status Badge Style
    const isFinalized = store.currentRunStatus === "FINALIZED";
    const statusPill = isFinalized 
      ? `<span style="background:rgba(16,185,129,0.15); color:#10b981; border:1px solid rgba(16,185,129,0.3); padding:4px 10px; border-radius:999px; font-size:0.75rem; font-weight:700; display:inline-flex; align-items:center; gap:4px;">${icons.lock} FINALIZED & LOCKED</span>`
      : `<span style="background:rgba(245,158,11,0.15); color:#f59e0b; border:1px solid rgba(245,158,11,0.3); padding:4px 10px; border-radius:999px; font-size:0.75rem; font-weight:700; display:inline-flex; align-items:center; gap:4px;">${icons.zap} ACTIVE DRAFT (AUG 2026)</span>`;

    // Tab Contents HTML
    let tabContentHtml = "";

    // ------------------------------------------------------------------------
    // TAB 1: DASHBOARD
    // ------------------------------------------------------------------------
    if (store.activeTab === "dashboard") {
      tabContentHtml = `
        <div style="display:flex; flex-direction:column; gap:20px;">
          <!-- KPI Stats Grid -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:14px;">
            <div style="background:var(--panel-raised); border:1px solid var(--line); border-radius:16px; padding:16px;">
              <div style="font-size:0.75rem; font-weight:700; color:var(--muted-text); text-transform:uppercase; letter-spacing:0.05em;">Total Net Payout</div>
              <div style="font-size:1.6rem; font-weight:800; color:#10b981; margin:6px 0 2px;">${moneyDisplay(totalNetPayout)}</div>
              <div style="font-size:0.72rem; color:var(--muted-text);">${items.length - heldCount} of ${items.length} employees included</div>
            </div>

            <div style="background:var(--panel-raised); border:1px solid var(--line); border-radius:16px; padding:16px;">
              <div style="font-size:0.75rem; font-weight:700; color:var(--muted-text); text-transform:uppercase; letter-spacing:0.05em;">Total Gross Pay</div>
              <div style="font-size:1.6rem; font-weight:800; color:var(--text); margin:6px 0 2px;">${moneyDisplay(totalGross)}</div>
              <div style="font-size:0.72rem; color:var(--muted-text);">Includes Basic, HRA, Special & Bonus</div>
            </div>

            <div style="background:var(--panel-raised); border:1px solid var(--line); border-radius:16px; padding:16px;">
              <div style="font-size:0.75rem; font-weight:700; color:var(--muted-text); text-transform:uppercase; letter-spacing:0.05em;">Total Deductions</div>
              <div style="font-size:1.6rem; font-weight:800; color:#ef4444; margin:6px 0 2px;">${moneyDisplay(totalDeductions)}</div>
              <div style="font-size:0.72rem; color:var(--muted-text);">EPF, ESIC, PT, TDS & LWP</div>
            </div>

            <div style="background:var(--panel-raised); border:1px solid var(--line); border-radius:16px; padding:16px;">
              <div style="font-size:0.75rem; font-weight:700; color:var(--muted-text); text-transform:uppercase; letter-spacing:0.05em;">Attendance LWP Impact</div>
              <div style="font-size:1.6rem; font-weight:800; color:#f59e0b; margin:6px 0 2px;">${moneyDisplay(totalLwpDeduction)}</div>
              <div style="font-size:0.72rem; color:var(--muted-text);">Loss of pay deducted for absences</div>
            </div>
          </div>

          <!-- Pre-Flight Checklist & Quick Actions -->
          <div style="display:grid; grid-template-columns:2fr 1fr; gap:16px;">
            <div style="background:var(--panel-raised); border:1px solid var(--line); border-radius:16px; padding:18px;">
              <h3 style="font-size:0.95rem; font-weight:800; margin:0 0 12px; display:flex; align-items:center; gap:8px;">
                ${icons.register} Payroll Pre-Flight Lifecycle Checklist
              </h3>
              <div style="display:flex; flex-direction:column; gap:10px; font-size:0.8rem;">
                <div style="display:flex; align-items:center; justify-content:space-between; padding:10px; background:var(--panel-soft); border-radius:10px; border:1px solid var(--line);">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="color:#10b981;">${icons.check}</span>
                    <div>
                      <strong>Sample attendance & leave cutoff</strong>
                      <div style="font-size:0.7rem; color:var(--muted-text);">31 calendar days, 0 pending unreviewed leaves in August.</div>
                    </div>
                  </div>
                  <span style="font-size:0.7rem; font-weight:700; color:#10b981; background:rgba(16,185,129,0.1); padding:3px 8px; border-radius:6px;">DEMO DATA</span>
                </div>

                <div style="display:flex; align-items:center; justify-content:space-between; padding:10px; background:var(--panel-soft); border-radius:10px; border:1px solid var(--line);">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="color:#10b981;">${icons.check}</span>
                    <div>
                      <strong>Variable Pay & Reimbursements Reviewed</strong>
                      <div style="font-size:0.7rem; color:var(--muted-text);">3 adjustments approved (Bonuses & Overtime: ₹17,700).</div>
                    </div>
                  </div>
                  <button onclick="window.switchPayrollTab('register')" style="font-size:0.7rem; background:transparent; border:1px solid var(--line); color:var(--primary); padding:3px 8px; border-radius:6px; cursor:pointer;">Review Pay</button>
                </div>

                <div style="display:flex; align-items:center; justify-content:space-between; padding:10px; background:var(--panel-soft); border-radius:10px; border:1px solid var(--line);">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="color:#10b981;">${icons.check}</span>
                    <div>
                      <strong>Sample statutory deductions</strong>
                      <div style="font-size:0.7rem; color:var(--muted-text);">EPF 12% with wage cap, ESIC under ₹21k, PT ₹200, New Regime TDS.</div>
                    </div>
                  </div>
                  <span style="font-size:0.7rem; font-weight:700; color:#10b981; background:rgba(16,185,129,0.1); padding:3px 8px; border-radius:6px;">DEMO ESTIMATE</span>
                </div>

                <div style="display:flex; align-items:center; justify-content:space-between; padding:10px; background:var(--panel-soft); border-radius:10px; border:1px solid var(--line);">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="color:${isFinalized ? '#10b981' : '#f59e0b'};">${isFinalized ? icons.check : icons.lock}</span>
                    <div>
                      <strong>Final Approval & Lock</strong>
                      <div style="font-size:0.7rem; color:var(--muted-text);">${isFinalized ? `Finalized by ${store.finalizedBy}` : 'Pending final lock before disbursal'}</div>
                    </div>
                  </div>
                  ${!isFinalized ? `<button onclick="window.finalizeCurrentPayrollRun()" class="primary-button" style="padding:4px 10px; font-size:0.75rem;">Lock Payroll</button>` : `<span style="font-size:0.7rem; font-weight:700; color:#10b981;">LOCKED</span>`}
                </div>
              </div>
            </div>

            <!-- Quick Actions Panel -->
            <div style="background:var(--panel-raised); border:1px solid var(--line); border-radius:16px; padding:18px; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <h3 style="font-size:0.95rem; font-weight:800; margin:0 0 8px;">Run Actions</h3>
                <p style="font-size:0.75rem; color:var(--muted-text); margin:0 0 14px;">Direct execution shortcuts for the active August 2026 cycle.</p>
                <div style="display:flex; flex-direction:column; gap:8px;">
                  <button onclick="window.openRunPayrollWizard()" class="primary-button" style="display:flex; align-items:center; justify-content:center; gap:6px; font-size:0.78rem; padding:9px;">
                    ${icons.zap} Run Payroll Wizard
                  </button>
                  <button onclick="window.exportBankPayoutCSV()" class="secondary-button" style="display:flex; align-items:center; justify-content:center; gap:6px; font-size:0.78rem; padding:9px;">
                    ${icons.download} Download Bank Payout CSV
                  </button>
                  <button onclick="window.publishAllPayslips()" class="secondary-button" style="display:flex; align-items:center; justify-content:center; gap:6px; font-size:0.78rem; padding:9px;">
                    ${icons.payslips} Publish All Payslips
                  </button>
                </div>
              </div>
              <div style="margin-top:14px; padding-top:10px; border-top:1px solid var(--line); font-size:0.7rem; color:var(--muted-text);">
                Corporate Bank: <strong>HDFC Corporate Net Banking</strong>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // ------------------------------------------------------------------------
    // TAB 2: SALARY REGISTER
    // ------------------------------------------------------------------------
    else if (store.activeTab === "register") {
      const depts = ["ALL", ...new Set(store.profiles.map(p => p.department))];
      const filtered = items.filter(i => {
        const matchDept = store.filters.department === "ALL" || i.department === store.filters.department;
        const matchStatus = store.filters.status === "ALL" || (store.filters.status === "HOLD" && i.isOnHold) || (store.filters.status === "ACTIVE" && !i.isOnHold);
        const matchSearch = !store.filters.search || i.name.toLowerCase().includes(store.filters.search) || i.employeeId.toLowerCase().includes(store.filters.search);
        return matchDept && matchStatus && matchSearch;
      });

      tabContentHtml = `
        <div style="background:var(--panel-raised); border:1px solid var(--line); border-radius:18px; padding:18px;">
          <!-- Filter Toolbar -->
          <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px; margin-bottom:14px;">
            <div style="display:flex; flex-wrap:wrap; align-items:center; gap:8px;">
              <input type="text" placeholder="Search employee name / code..." value="${escapeAttr(store.filters.search)}" oninput="window.searchPayrollRegister(this.value)" 
                     style="background:var(--panel-soft); border:1px solid var(--line); border-radius:10px; padding:6px 12px; font-size:0.75rem; color:var(--text); width:200px;" />
              <select aria-label="Payroll department" onchange="window.filterPayrollDepartment(this.value)" style="background:var(--panel-soft); border:1px solid var(--line); border-radius:10px; padding:6px 10px; font-size:0.75rem; color:var(--text);">
                ${depts.map(d => `<option value="${d}" ${store.filters.department === d ? 'selected' : ''}>Dept: ${d}</option>`).join("")}
              </select>
              <select aria-label="Payroll status" onchange="window.filterPayrollStatus(this.value)" style="background:var(--panel-soft); border:1px solid var(--line); border-radius:10px; padding:6px 10px; font-size:0.75rem; color:var(--text);">
                <option value="ALL" ${store.filters.status === 'ALL' ? 'selected' : ''}>All Statuses</option>
                <option value="ACTIVE" ${store.filters.status === 'ACTIVE' ? 'selected' : ''}>Active / Payable</option>
                <option value="HOLD" ${store.filters.status === 'HOLD' ? 'selected' : ''}>On Hold</option>
              </select>
            </div>

            <div style="display:flex; align-items:center; gap:8px;">
              <button onclick="window.exportSalaryRegisterCSV()" class="secondary-button" style="font-size:0.75rem; padding:6px 12px; display:inline-flex; align-items:center; gap:6px;">
                ${icons.download} Export Register CSV
              </button>
            </div>
          </div>

          <!-- Register Table -->
          <div class="table-wrap" style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:0.75rem;">
              <thead>
                <tr style="border-bottom:1px solid var(--line); color:var(--muted-text); text-align:left;">
                  <th style="padding:10px 8px;">Employee</th>
                  <th style="padding:10px 8px;">Days</th>
                  <th style="padding:10px 8px;">Basic</th>
                  <th style="padding:10px 8px;">HRA</th>
                  <th style="padding:10px 8px;">Special / Bonus</th>
                  <th style="padding:10px 8px; font-weight:700; color:var(--text);">Gross Pay</th>
                  <th style="padding:10px 8px;">LWP / Deduct</th>
                  <th style="padding:10px 8px;">EPF (EE)</th>
                  <th style="padding:10px 8px;">ESIC / PT / TDS</th>
                  <th style="padding:10px 8px; font-weight:800; color:#10b981;">Net Take-Home</th>
                  <th style="padding:10px 8px;">Status</th>
                  <th style="padding:10px 8px; text-align:right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(item => `
                  <tr style="border-bottom:1px solid var(--line); ${item.isOnHold ? 'opacity:0.6; background:rgba(239,68,68,0.03);' : ''}">
                    <td style="padding:10px 8px;">
                      <div style="font-weight:700; color:var(--text);">${escapeHtml(item.name)}</div>
                      <div style="font-size:0.68rem; color:var(--muted-text);">${item.employeeId} &bull; ${item.department}</div>
                    </td>
                    <td style="padding:10px 8px;">
                      <div>${item.payableDays} / ${item.daysInMonth}d</div>
                      ${item.lwpDays > 0 ? `<div style="font-size:0.65rem; color:#ef4444; font-weight:700;">-${item.lwpDays}d LWP</div>` : `<div style="font-size:0.65rem; color:#10b981;">0 LWP</div>`}
                    </td>
                    <td style="padding:10px 8px;">${moneyDisplay(item.basic)}</td>
                    <td style="padding:10px 8px;">${moneyDisplay(item.hra)}</td>
                    <td style="padding:10px 8px;">
                      <div>${moneyDisplay(item.special)}</div>
                      ${item.bonus + item.overtime > 0 ? `<div style="font-size:0.65rem; color:#10b981;">+${moneyDisplay(item.bonus + item.overtime)}</div>` : ''}
                    </td>
                    <td style="padding:10px 8px; font-weight:700; color:var(--text);">${moneyDisplay(item.grossPay)}</td>
                    <td style="padding:10px 8px; color:#ef4444;">
                      ${item.lwpDeduction > 0 ? `-${moneyDisplay(item.lwpDeduction)}` : '-'}
                      ${item.adhocDeduction > 0 ? `<div style="font-size:0.65rem;">-${moneyDisplay(item.adhocDeduction)}</div>` : ''}
                    </td>
                    <td style="padding:10px 8px;">${item.epfEmployee > 0 ? moneyDisplay(item.epfEmployee) : '-'}</td>
                    <td style="padding:10px 8px;">
                      ${moneyDisplay(item.esicEmployee + item.pt + item.tds)}
                      <div style="font-size:0.65rem; color:var(--muted-text);">${item.esicEmployee > 0 ? 'ESIC+' : ''}PT: ₹${item.pt}${item.tds > 0 ? ' TDS' : ''}</div>
                    </td>
                    <td style="padding:10px 8px; font-weight:800; font-size:0.85rem; color:#10b981;">${moneyDisplay(item.netPay)}</td>
                    <td style="padding:10px 8px;">
                      ${item.isOnHold 
                        ? `<span style="font-size:0.65rem; background:rgba(239,68,68,0.15); color:#ef4444; padding:2px 6px; border-radius:4px; font-weight:700;">ON HOLD</span>`
                        : `<span style="font-size:0.65rem; background:rgba(16,185,129,0.15); color:#10b981; padding:2px 6px; border-radius:4px; font-weight:700;">PAYABLE</span>`}
                    </td>
                    <td style="padding:10px 8px; text-align:right;">
                      <div style="display:inline-flex; align-items:center; gap:4px;">
                        <button onclick="window.openAdjustPayModal('${item.employeeId}')" title="Add Bonus / Deduction" style="background:var(--panel-soft); border:1px solid var(--line); border-radius:6px; padding:4px 6px; cursor:pointer; color:var(--text);">
                          ${icons.edit}
                        </button>
                        <button onclick="window.openPayslipModal('${item.employeeId}')" title="Preview Payslip" style="background:var(--panel-soft); border:1px solid var(--line); border-radius:6px; padding:4px 6px; cursor:pointer; color:var(--primary);">
                          ${icons.eye}
                        </button>
                        <button onclick="window.toggleEmployeeHold('${item.employeeId}')" title="${item.isOnHold ? 'Unhold' : 'Hold'}" style="background:var(--panel-soft); border:1px solid var(--line); border-radius:6px; padding:4px 6px; cursor:pointer; color:${item.isOnHold ? '#10b981' : '#ef4444'};">
                          ${icons.pause}
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    // ------------------------------------------------------------------------
    // TAB 3: SALARY STRUCTURES & STATUTORY MATRIX
    // ------------------------------------------------------------------------
    else if (store.activeTab === "structures") {
      tabContentHtml = `
        <div style="display:flex; flex-direction:column; gap:20px;">
          <!-- Salary Structure Templates -->
          <div style="background:var(--panel-raised); border:1px solid var(--line); border-radius:18px; padding:18px;">
            <div style="margin-bottom:14px;">
              <h3 style="font-size:1rem; font-weight:800; margin:0 0 4px;">Salary Structure Templates</h3>
              <p style="font-size:0.75rem; color:var(--muted-text); margin:0;">Defined compensation component ratios mapped to employee designations.</p>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:14px;">
              ${store.structures.map(struct => `
                <div style="background:var(--panel-soft); border:1px solid var(--line); border-radius:14px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">
                  <div>
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                      <h4 style="font-size:0.9rem; font-weight:800; margin:0; color:var(--text);">${escapeHtml(struct.name)}</h4>
                      <span style="font-size:0.7rem; color:var(--primary); font-weight:700; background:rgba(99,102,241,0.1); padding:2px 8px; border-radius:6px;">${struct.employeesCount} Assigned</span>
                    </div>
                    <p style="font-size:0.72rem; color:var(--muted-text); margin:6px 0 12px;">${escapeHtml(struct.description)}</p>
                    
                    <div style="display:flex; flex-direction:column; gap:6px; font-size:0.75rem;">
                      <div style="display:flex; justify-content:space-between;">
                        <span style="color:var(--muted-text);">Basic Salary:</span>
                        <strong>${struct.basicPct}% of Gross</strong>
                      </div>
                      <div style="display:flex; justify-content:space-between;">
                        <span style="color:var(--muted-text);">House Rent Allowance (HRA):</span>
                        <strong>${struct.hraPct}% of Gross</strong>
                      </div>
                      <div style="display:flex; justify-content:space-between;">
                        <span style="color:var(--muted-text);">Special / Flexible Allowance:</span>
                        <strong>${struct.specialPct}% of Gross</strong>
                      </div>
                    </div>
                  </div>

                  <div style="margin-top:14px; padding-top:10px; border-top:1px solid var(--line); display:flex; gap:6px; font-size:0.68rem;">
                    <span style="background:rgba(16,185,129,0.1); color:#10b981; padding:2px 6px; border-radius:4px;">EPF ${struct.hasEpf ? 'Yes' : 'No'}</span>
                    <span style="background:rgba(16,185,129,0.1); color:#10b981; padding:2px 6px; border-radius:4px;">ESIC ${struct.hasEsic ? 'Yes' : 'No'}</span>
                    <span style="background:rgba(16,185,129,0.1); color:#10b981; padding:2px 6px; border-radius:4px;">PT ${struct.hasPt ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Indian Statutory Rules Matrix -->
          <div style="background:var(--panel-raised); border:1px solid var(--line); border-radius:18px; padding:18px;">
            <div style="margin-bottom:14px;">
              <h3 style="font-size:1rem; font-weight:800; margin:0 0 4px;">Indian Statutory Compliance Configuration Matrix</h3>
              <p style="font-size:0.75rem; color:var(--muted-text); margin:0;">Standard rules enforced across automated monthly computations.</p>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px; font-size:0.75rem;">
              <div style="background:var(--panel-soft); border:1px solid var(--line); border-radius:12px; padding:14px;">
                <div style="font-weight:800; color:var(--text); margin-bottom:4px;">1. Provident Fund (EPF)</div>
                <div style="color:var(--muted-text); font-size:0.7rem; margin-bottom:8px;">Employees' Provident Funds and Miscellaneous Provisions Act, 1952</div>
                <div>Employee Share: <strong>12% of Basic + DA</strong></div>
                <div>Employer Share: <strong>12% (3.67% EPF + 8.33% EPS)</strong></div>
                <div>Statutory Wage Ceiling: <strong>₹15,000 / month (₹1,800 cap)</strong></div>
              </div>

              <div style="background:var(--panel-soft); border:1px solid var(--line); border-radius:12px; padding:14px;">
                <div style="font-weight:800; color:var(--text); margin-bottom:4px;">2. Employee State Insurance (ESIC)</div>
                <div style="color:var(--muted-text); font-size:0.7rem; margin-bottom:8px;">ESI Act, 1948 Health & Medical Coverage</div>
                <div>Gross Wage Limit: <strong>Gross &le; ₹21,000 / month</strong></div>
                <div>Employee Contribution: <strong>0.75% of Gross Wages</strong></div>
                <div>Employer Contribution: <strong>3.25% of Gross Wages</strong></div>
              </div>

              <div style="background:var(--panel-soft); border:1px solid var(--line); border-radius:12px; padding:14px;">
                <div style="font-weight:800; color:var(--text); margin-bottom:4px;">3. Professional Tax (PT)</div>
                <div style="color:var(--muted-text); font-size:0.7rem; margin-bottom:8px;">State Government Professional Tax Slabs</div>
                <div>Monthly Deductions: <strong>₹200 / month</strong></div>
                <div>February Adjustment: <strong>₹300 in February</strong></div>
                <div>Annual PT Total: <strong>₹2,500 / year</strong></div>
              </div>

              <div style="background:var(--panel-soft); border:1px solid var(--line); border-radius:12px; padding:14px;">
                <div style="font-weight:800; color:var(--text); margin-bottom:4px;">4. Income Tax TDS</div>
                <div style="color:var(--muted-text); font-size:0.7rem; margin-bottom:8px;">Section 192, Income Tax Act</div>
                <div>Default Tax Regime: <strong>New Tax Regime</strong></div>
                <div>Standard Deduction: <strong>₹75,000 (FY 2024-25+)</strong></div>
                <div>Zero Tax Rebate: <strong>Up to ₹7.5 LPA Net Taxable</strong></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // ------------------------------------------------------------------------
    // TAB 4: EMPLOYEE COMPENSATION PROFILES
    // ------------------------------------------------------------------------
    else if (store.activeTab === "profiles") {
      tabContentHtml = `
        <div style="background:var(--panel-raised); border:1px solid var(--line); border-radius:18px; padding:18px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <div>
              <h3 style="font-size:1rem; font-weight:800; margin:0 0 4px;">Employee Compensation & Bank Master</h3>
              <p style="font-size:0.75rem; color:var(--muted-text); margin:0;">Configured Annual CTCs, bank accounts, and statutory identifiers.</p>
            </div>
          </div>

          <div class="table-wrap" style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:0.75rem;">
              <thead>
                <tr style="border-bottom:1px solid var(--line); color:var(--muted-text); text-align:left;">
                  <th style="padding:10px 8px;">Employee</th>
                  <th style="padding:10px 8px;">Structure</th>
                  <th style="padding:10px 8px;">Annual CTC</th>
                  <th style="padding:10px 8px;">Monthly Gross</th>
                  <th style="padding:10px 8px;">Bank Details</th>
                  <th style="padding:10px 8px;">PAN / UAN</th>
                  <th style="padding:10px 8px; text-align:right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${store.profiles.map(emp => `
                  <tr style="border-bottom:1px solid var(--line);">
                    <td style="padding:10px 8px;">
                      <div style="font-weight:700; color:var(--text);">${escapeHtml(emp.name)}</div>
                      <div style="font-size:0.68rem; color:var(--muted-text);">${emp.employeeId} &bull; ${emp.department} &bull; ${emp.designation}</div>
                    </td>
                    <td style="padding:10px 8px;">
                      <span style="font-size:0.7rem; background:rgba(99,102,241,0.1); color:var(--primary); padding:2px 8px; border-radius:4px;">
                        ${escapeHtml(emp.structureName)}
                      </span>
                    </td>
                    <td style="padding:10px 8px; font-weight:800; color:var(--text);">${moneyDisplay(emp.annualCtc)}</td>
                    <td style="padding:10px 8px; font-weight:700; color:#10b981;">${moneyDisplay(emp.monthlyGross)}</td>
                    <td style="padding:10px 8px;">
                      <div>${escapeHtml(emp.bankDetails.bankName)}</div>
                      <div style="font-size:0.68rem; color:var(--muted-text); font-family:monospace;">
                        A/C: •••• ${emp.bankDetails.accountNumber.slice(-4)} &bull; ${emp.bankDetails.ifsc}
                      </div>
                    </td>
                    <td style="padding:10px 8px;">
                      <div>PAN: <strong>${emp.statutory.pan}</strong></div>
                      <div style="font-size:0.68rem; color:var(--muted-text);">UAN: ${emp.statutory.uan}</div>
                    </td>
                    <td style="padding:10px 8px; text-align:right;">
                      <button onclick="window.openReviseSalaryModal('${emp.employeeId}')" class="secondary-button" style="font-size:0.7rem; padding:4px 8px;">
                        ${icons.edit} Revise Salary
                      </button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    // ------------------------------------------------------------------------
    // TAB 5: PAYSLIPS & DOCUMENT HUB
    // ------------------------------------------------------------------------
    else if (store.activeTab === "payslips") {
      tabContentHtml = `
        <div style="background:var(--panel-raised); border:1px solid var(--line); border-radius:18px; padding:18px;">
          <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:10px; margin-bottom:16px;">
            <div>
              <h3 style="font-size:1rem; font-weight:800; margin:0 0 4px;">August 2026 Payslips Directory</h3>
              <p style="font-size:0.75rem; color:var(--muted-text); margin:0;">
                ${store.payslipsPublished ? '✓ Published to employee self-service portal.' : 'Draft state. Ready for publishing and distribution.'}
              </p>
            </div>
            <div style="display:flex; gap:8px;">
              <button onclick="window.publishAllPayslips()" class="primary-button" style="font-size:0.75rem; padding:6px 12px; display:inline-flex; align-items:center; gap:6px;">
                ${icons.payslips} Publish All to Portal
              </button>
              <button onclick="window.exportSalaryRegisterCSV()" class="secondary-button" style="font-size:0.75rem; padding:6px 12px; display:inline-flex; align-items:center; gap:6px;">
                ${icons.download} Download All (ZIP/CSV)
              </button>
            </div>
          </div>

          <!-- Payslip Cards Grid -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:14px;">
            ${items.map(item => `
              <div style="background:var(--panel-soft); border:1px solid var(--line); border-radius:14px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div>
                      <h4 style="font-size:0.9rem; font-weight:800; margin:0; color:var(--text);">${escapeHtml(item.name)}</h4>
                      <div style="font-size:0.7rem; color:var(--muted-text);">${item.employeeId} &bull; ${item.department}</div>
                    </div>
                    <span style="font-size:0.65rem; background:rgba(16,185,129,0.1); color:#10b981; font-weight:700; padding:2px 6px; border-radius:4px;">AUG 2026</span>
                  </div>

                  <div style="margin:12px 0; padding:10px; background:var(--panel-raised); border-radius:10px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <div style="font-size:0.65rem; color:var(--muted-text); text-transform:uppercase;">Net Salary</div>
                      <div style="font-size:1.2rem; font-weight:800; color:#10b981;">${moneyDisplay(item.netPay)}</div>
                    </div>
                    <div style="text-align:right; font-size:0.7rem; color:var(--muted-text);">
                      <div>Days: <strong>${item.payableDays} / ${item.daysInMonth}</strong></div>
                      <div>Deductions: <strong>${moneyDisplay(item.totalDeductions)}</strong></div>
                    </div>
                  </div>
                </div>

                <div style="display:flex; gap:8px;">
                  <button onclick="window.openPayslipModal('${item.employeeId}')" class="primary-button" style="flex:1; font-size:0.72rem; padding:6px; display:inline-flex; align-items:center; justify-content:center; gap:4px;">
                    ${icons.eye} View Digital Payslip
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    // ------------------------------------------------------------------------
    // TAB 6: STATUTORY REPORTS & BANKING
    // ------------------------------------------------------------------------
    else if (store.activeTab === "reports") {
      tabContentHtml = `
        <div style="display:flex; flex-direction:column; gap:20px;">
          <!-- Bank Payout Generator -->
          <div style="background:var(--panel-raised); border:1px solid var(--line); border-radius:18px; padding:18px;">
            <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:10px; margin-bottom:14px;">
              <div>
                <h3 style="font-size:1rem; font-weight:800; margin:0 0 4px;">Bank Payout Batch File (NEFT / RTGS)</h3>
                <p style="font-size:0.75rem; color:var(--muted-text); margin:0;">Formatted for direct upload to Indian Corporate Net Banking (HDFC, ICICI, Axis, SBI).</p>
              </div>
              <button onclick="window.exportBankPayoutCSV()" class="primary-button" style="font-size:0.75rem; padding:8px 14px; display:inline-flex; align-items:center; gap:6px;">
                ${icons.download} Export Bank Payout CSV
              </button>
            </div>

            <div style="padding:12px; background:var(--panel-soft); border-radius:12px; border:1px solid var(--line); font-size:0.75rem; display:flex; flex-wrap:wrap; justify-content:space-between; gap:12px;">
              <div>Debit Account: <strong>00000000000001 (Digi Rathi Technologies Pvt Ltd)</strong></div>
              <div>Total Beneficiaries: <strong>${items.filter(i => !i.isOnHold).length} Employees</strong></div>
              <div>Disbursement Amount: <strong style="color:#10b981;">${moneyDisplay(totalNetPayout)}</strong></div>
              <div>Cycle: <strong>August 2026</strong></div>
            </div>
          </div>

          <!-- Statutory Filing Exports Grid -->
          <div style="background:var(--panel-raised); border:1px solid var(--line); border-radius:18px; padding:18px;">
            <h3 style="font-size:1rem; font-weight:800; margin:0 0 14px;">Statutory Compliance File Exports</h3>
            
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:14px;">
              <div style="background:var(--panel-soft); border:1px solid var(--line); border-radius:14px; padding:16px;">
                <h4 style="font-size:0.88rem; font-weight:800; margin:0 0 4px;">EPF Electronic Challan (ECR)</h4>
                <p style="font-size:0.7rem; color:var(--muted-text); margin:0 0 12px;">Monthly return for EPFO portal with UAN, Gross Wages, and EE/ER contributions.</p>
                <div style="font-size:0.75rem; margin-bottom:12px;">
                  <div>Total EPF Contribution: <strong>${moneyDisplay(items.reduce((s, i) => s + i.epfEmployee + i.epfEmployer, 0))}</strong></div>
                </div>
                <button onclick="window.exportSalaryRegisterCSV()" class="secondary-button" style="width:100%; font-size:0.72rem; padding:6px; display:inline-flex; align-items:center; justify-content:center; gap:4px;">
                  ${icons.download} Download EPF ECR Statement
                </button>
              </div>

              <div style="background:var(--panel-soft); border:1px solid var(--line); border-radius:14px; padding:16px;">
                <h4 style="font-size:0.88rem; font-weight:800; margin:0 0 4px;">ESIC Monthly Return</h4>
                <p style="font-size:0.7rem; color:var(--muted-text); margin:0 0 12px;">ESIC portal return for covered employees (Gross &le; ₹21,000).</p>
                <div style="font-size:0.75rem; margin-bottom:12px;">
                  <div>Covered Employees: <strong>1 Employee (Demo Person 21)</strong></div>
                  <div>Total Contribution: <strong>${moneyDisplay(items.reduce((s, i) => s + i.esicEmployee + i.esicEmployer, 0))}</strong></div>
                </div>
                <button onclick="window.exportSalaryRegisterCSV()" class="secondary-button" style="width:100%; font-size:0.72rem; padding:6px; display:inline-flex; align-items:center; justify-content:center; gap:4px;">
                  ${icons.download} Download ESIC Return File
                </button>
              </div>

              <div style="background:var(--panel-soft); border:1px solid var(--line); border-radius:14px; padding:16px;">
                <h4 style="font-size:0.88rem; font-weight:800; margin:0 0 4px;">Professional Tax (PT) Statement</h4>
                <p style="font-size:0.7rem; color:var(--muted-text); margin:0 0 12px;">Monthly PT deduction register for State Commercial Tax department.</p>
                <div style="font-size:0.75rem; margin-bottom:12px;">
                  <div>Total PT Deducted: <strong>${moneyDisplay(items.reduce((s, i) => s + i.pt, 0))}</strong></div>
                </div>
                <button onclick="window.exportSalaryRegisterCSV()" class="secondary-button" style="width:100%; font-size:0.72rem; padding:6px; display:inline-flex; align-items:center; justify-content:center; gap:4px;">
                  ${icons.download} Download PT Statement
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // ------------------------------------------------------------------------
    // Modals Rendering
    // ------------------------------------------------------------------------
    let modalHtml = "";

    // 1. Digital Interactive Payslip Modal
    if (store.activeModal === "payslip" && store.selectedEmployeeId) {
      const emp = store.profiles.find(p => p.employeeId === store.selectedEmployeeId);
      const item = emp ? window.calculatePayrollItem(emp) : null;

      if (item) {
        modalHtml = `
          <div style="position:fixed; inset:0; z-index:120; display:flex; align-items:center; justify-content:center; padding:16px; background:rgba(2,6,23,0.85); backdrop-filter:blur(4px);">
            <div style="position:relative; width:100%; max-width:720px; max-height:92vh; overflow-y:auto; background:#ffffff; color:#0f172a; border-radius:16px; padding:28px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.7); font-family:sans-serif;">
              <!-- Payslip Actions (Non-printable) -->
              <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid #e2e8f0;">
                <div style="font-size:0.8rem; font-weight:700; color:#64748b;">Digital Payslip Preview &bull; August 2026</div>
                <div style="display:flex; gap:8px;">
                  <button onclick="window.printPayslip()" style="background:#4f46e5; color:#fff; border:none; border-radius:8px; padding:6px 12px; font-size:0.75rem; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
                    ${icons.download} Print / Save PDF
                  </button>
                  <button onclick="window.closePayrollModal()" style="background:#f1f5f9; color:#475569; border:none; border-radius:8px; padding:6px 12px; font-size:0.75rem; font-weight:700; cursor:pointer;">
                    Close
                  </button>
                </div>
              </div>

              <!-- Printable Payslip Document -->
              <div id="printablePayslip" style="background:#fff; color:#0f172a;">
                <!-- Company Header -->
                <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #0f172a; padding-bottom:14px; margin-bottom:14px;">
                  <div>
                    <h2 style="font-size:1.4rem; font-weight:900; margin:0; color:#0f172a; letter-spacing:-0.02em;">DIGIRATHI TECHNOLOGIES PVT LTD</h2>
                    <p style="font-size:0.72rem; color:#475569; margin:2px 0 0;">CIN: U72900DL2023PTC123456 &bull; GSTIN: 07AAAAA0000A1Z5</p>
                    <p style="font-size:0.72rem; color:#475569; margin:0;">Level 4, Tech Boulevard, Sector 127, Noida, Uttar Pradesh 201301</p>
                  </div>
                  <div style="text-align:right;">
                    <div style="font-size:1rem; font-weight:800; color:#4f46e5;">PAYSLIP</div>
                    <div style="font-size:0.75rem; font-weight:700; color:#0f172a;">August 2026</div>
                  </div>
                </div>

                <!-- Employee Particulars & Attendance -->
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.72rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; margin-bottom:16px;">
                  <div>
                    <div>Employee Name: <strong>${escapeHtml(item.name)}</strong></div>
                    <div>Employee ID: <strong>${item.employeeId}</strong></div>
                    <div>Department: <strong>${item.department}</strong></div>
                    <div>Designation: <strong>${item.designation}</strong></div>
                    <div>Date of Joining: <strong>${item.doj}</strong></div>
                  </div>
                  <div>
                    <div>Bank Name: <strong>${escapeHtml(item.bankDetails.bankName)}</strong></div>
                    <div>Bank A/C: <strong>•••• ${item.bankDetails.accountNumber.slice(-4)}</strong></div>
                    <div>IFSC Code: <strong>${item.bankDetails.ifsc}</strong></div>
                    <div>PAN: <strong>${item.statutory.pan}</strong> &bull; UAN: <strong>${item.statutory.uan}</strong></div>
                    <div>Calendar Days: <strong>${item.daysInMonth}</strong> &bull; Payable: <strong>${item.payableDays}</strong> &bull; LWP: <strong style="color:#ef4444;">${item.lwpDays}</strong></div>
                  </div>
                </div>

                <!-- Earnings vs Deductions Dual Table -->
                <div style="display:grid; grid-template-columns:1fr 1fr; border:1px solid #cbd5e1; border-radius:8px; overflow:hidden; font-size:0.72rem; margin-bottom:16px;">
                  <!-- Earnings Column -->
                  <div style="border-right:1px solid #cbd5e1;">
                    <div style="background:#f1f5f9; padding:8px 10px; font-weight:800; border-bottom:1px solid #cbd5e1; display:flex; justify-content:space-between;">
                      <span>EARNINGS</span>
                      <span>AMOUNT (₹)</span>
                    </div>
                    <div style="padding:10px; display:flex; flex-direction:column; gap:6px;">
                      <div style="display:flex; justify-content:space-between;">
                        <span>Basic Salary</span>
                        <strong>${item.basic.toLocaleString()}</strong>
                      </div>
                      <div style="display:flex; justify-content:space-between;">
                        <span>House Rent Allowance (HRA)</span>
                        <strong>${item.hra.toLocaleString()}</strong>
                      </div>
                      <div style="display:flex; justify-content:space-between;">
                        <span>Special Allowance</span>
                        <strong>${item.special.toLocaleString()}</strong>
                      </div>
                      ${item.bonus > 0 ? `
                        <div style="display:flex; justify-content:space-between; color:#15803d;">
                          <span>Performance Bonus / Incentive</span>
                          <strong>${item.bonus.toLocaleString()}</strong>
                        </div>
                      ` : ''}
                      ${item.overtime > 0 ? `
                        <div style="display:flex; justify-content:space-between; color:#15803d;">
                          <span>Overtime Pay</span>
                          <strong>${item.overtime.toLocaleString()}</strong>
                        </div>
                      ` : ''}
                    </div>
                    <div style="background:#f8fafc; padding:8px 10px; font-weight:800; border-top:1px solid #cbd5e1; display:flex; justify-content:space-between;">
                      <span>GROSS EARNINGS</span>
                      <span>₹${item.grossPay.toLocaleString()}</span>
                    </div>
                  </div>

                  <!-- Deductions Column -->
                  <div>
                    <div style="background:#f1f5f9; padding:8px 10px; font-weight:800; border-bottom:1px solid #cbd5e1; display:flex; justify-content:space-between;">
                      <span>DEDUCTIONS</span>
                      <span>AMOUNT (₹)</span>
                    </div>
                    <div style="padding:10px; display:flex; flex-direction:column; gap:6px;">
                      <div style="display:flex; justify-content:space-between;">
                        <span>Provident Fund (EPF Employee 12%)</span>
                        <strong>${item.epfEmployee.toLocaleString()}</strong>
                      </div>
                      <div style="display:flex; justify-content:space-between;">
                        <span>ESIC Contribution</span>
                        <strong>${item.esicEmployee.toLocaleString()}</strong>
                      </div>
                      <div style="display:flex; justify-content:space-between;">
                        <span>Professional Tax (PT)</span>
                        <strong>${item.pt.toLocaleString()}</strong>
                      </div>
                      <div style="display:flex; justify-content:space-between;">
                        <span>Income Tax (TDS)</span>
                        <strong>${item.tds.toLocaleString()}</strong>
                      </div>
                      ${item.lwpDeduction > 0 ? `
                        <div style="display:flex; justify-content:space-between; color:#b91c1c;">
                          <span>Loss of Pay (LWP - ${item.lwpDays}d)</span>
                          <strong>${item.lwpDeduction.toLocaleString()}</strong>
                        </div>
                      ` : ''}
                      ${item.adhocDeduction > 0 ? `
                        <div style="display:flex; justify-content:space-between; color:#b91c1c;">
                          <span>Other Deductions</span>
                          <strong>${item.adhocDeduction.toLocaleString()}</strong>
                        </div>
                      ` : ''}
                    </div>
                    <div style="background:#f8fafc; padding:8px 10px; font-weight:800; border-top:1px solid #cbd5e1; display:flex; justify-content:space-between;">
                      <span>TOTAL DEDUCTIONS</span>
                      <span style="color:#b91c1c;">₹${item.totalDeductions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <!-- Net Take Home Highlight Box -->
                <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:8px; padding:12px 14px; margin-bottom:16px;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <div style="font-size:0.7rem; font-weight:700; color:#047857; text-transform:uppercase;">Net Salary Payable</div>
                      <div style="font-size:1.3rem; font-weight:900; color:#065f46;">₹${item.netPay.toLocaleString()}</div>
                    </div>
                    <div style="text-align:right; font-size:0.75rem; color:#065f46; font-weight:700;">
                      Disbursement: Direct Bank Transfer
                    </div>
                  </div>
                  <div style="font-size:0.7rem; color:#065f46; margin-top:4px; font-weight:600;">
                    Amount in Words: <em>${numberToIndianWords(item.netPay)}</em>
                  </div>
                </div>

                <!-- Employer Contribution Note -->
                <div style="font-size:0.68rem; color:#64748b; margin-bottom:20px;">
                  Employer Contributions: EPF: ₹${item.epfEmployer.toLocaleString()} | ESIC: ₹${item.esicEmployer.toLocaleString()} | Total Monthly CTC: ₹${item.totalCtcMonth.toLocaleString()}
                </div>

                <!-- Signature & Footer -->
                <div style="display:flex; justify-content:space-between; align-items:flex-end; font-size:0.7rem; color:#475569; padding-top:10px; border-top:1px solid #e2e8f0;">
                  <div>
                    This is a computer-generated document and does not require a physical signature.<br/>
                    Generated on: ${new Date().toLocaleDateString("en-IN")} &bull; DigiRathi DRMS
                  </div>
                  <div style="text-align:right;">
                    <strong>For DIGIRATHI TECHNOLOGIES PVT LTD</strong><br/><br/>
                    <span>Authorized Signatory</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      }
    }

    // 2. Adjust Pay Modal
    else if (store.activeModal === "adjustPay" && store.selectedEmployeeId) {
      const emp = store.profiles.find(p => p.employeeId === store.selectedEmployeeId);
      modalHtml = `
        <div style="position:fixed; inset:0; z-index:120; display:flex; align-items:center; justify-content:center; padding:16px; background:rgba(2,6,23,0.85); backdrop-filter:blur(4px);">
          <div style="position:relative; width:100%; max-width:500px; background:var(--panel-raised); border:1px solid var(--line); border-radius:18px; padding:22px; color:var(--text);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
              <div>
                <h3 style="font-size:1.1rem; font-weight:800; margin:0 0 4px;">Adjust Variable Pay</h3>
                <p style="font-size:0.75rem; color:var(--muted-text); margin:0;">For ${emp ? emp.name : 'Employee'} (${emp ? emp.employeeId : ''}) &bull; August 2026</p>
              </div>
              <button onclick="window.closePayrollModal()" style="background:var(--panel-soft); border:1px solid var(--line); border-radius:6px; padding:4px 8px; cursor:pointer; color:var(--muted-text);">✕</button>
            </div>

            <form onsubmit="window.savePayAdjustment(event)" style="display:flex; flex-direction:column; gap:12px; font-size:0.78rem;">
              <div>
                <label style="display:block; font-weight:700; margin-bottom:4px;">Adjustment Type *</label>
                <select name="adjustType" style="width:100%; background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:7px; color:var(--text);">
                  <option value="BONUS">Performance Bonus / Incentive (+)</option>
                  <option value="OVERTIME">Overtime Pay (+)</option>
                  <option value="REIMBURSEMENT">Expense Reimbursement (+)</option>
                  <option value="DEDUCTION">Ad-hoc Deduction / Asset Recovery (-)</option>
                </select>
              </div>

              <div>
                <label style="display:block; font-weight:700; margin-bottom:4px;">Adjustment Label / Title *</label>
                <input type="text" name="adjustLabel" required placeholder="e.g. Q2 Performance Bonus" style="width:100%; background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:7px; color:var(--text);" />
              </div>

              <div>
                <label style="display:block; font-weight:700; margin-bottom:4px;">Amount (INR ₹) *</label>
                <input type="number" name="adjustAmount" required min="1" step="100" placeholder="e.g. 5000" style="width:100%; background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:7px; color:var(--text);" />
              </div>

              <div>
                <label style="display:block; font-weight:700; margin-bottom:4px;">Audit Reason *</label>
                <textarea name="adjustReason" required minlength="5" rows="3" placeholder="Mandatory audit justification for finance and compliance..." style="width:100%; background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:7px; color:var(--text);"></textarea>
              </div>

              <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:8px;">
                <button type="button" onclick="window.closePayrollModal()" class="secondary-button">Cancel</button>
                <button type="submit" class="primary-button">Save Adjustment</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }

    // 3. Revise Salary Modal
    else if (store.activeModal === "reviseSalary" && store.selectedEmployeeId) {
      const emp = store.profiles.find(p => p.employeeId === store.selectedEmployeeId);
      modalHtml = `
        <div style="position:fixed; inset:0; z-index:120; display:flex; align-items:center; justify-content:center; padding:16px; background:rgba(2,6,23,0.85); backdrop-filter:blur(4px);">
          <div style="position:relative; width:100%; max-width:520px; background:var(--panel-raised); border:1px solid var(--line); border-radius:18px; padding:22px; color:var(--text);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
              <div>
                <h3 style="font-size:1.1rem; font-weight:800; margin:0 0 4px;">Revise Compensation Package</h3>
                <p style="font-size:0.75rem; color:var(--muted-text); margin:0;">${emp ? emp.name : ''} (${emp ? emp.employeeId : ''})</p>
              </div>
              <button onclick="window.closePayrollModal()" style="background:var(--panel-soft); border:1px solid var(--line); border-radius:6px; padding:4px 8px; cursor:pointer; color:var(--muted-text);">✕</button>
            </div>

            <div style="padding:10px; background:var(--panel-soft); border-radius:8px; font-size:0.75rem; margin-bottom:12px; display:flex; justify-content:space-between;">
              <span>Current CTC: <strong>${moneyDisplay(emp ? emp.annualCtc : 0)} / yr</strong></span>
              <span>Current Monthly: <strong>${moneyDisplay(emp ? emp.monthlyGross : 0)} / mo</strong></span>
            </div>

            <form onsubmit="window.saveSalaryRevision(event)" style="display:flex; flex-direction:column; gap:12px; font-size:0.78rem;">
              <div>
                <label style="display:block; font-weight:700; margin-bottom:4px;">New Annual CTC (INR ₹) *</label>
                <input type="number" name="newAnnualCtc" required min="100000" step="10000" value="${emp ? emp.annualCtc : ''}" style="width:100%; background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:7px; color:var(--text);" />
              </div>

              <div>
                <label style="display:block; font-weight:700; margin-bottom:4px;">Effective Date *</label>
                <input type="date" name="effectiveDate" required value="2026-08-01" style="width:100%; background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:7px; color:var(--text);" />
              </div>

              <div>
                <label style="display:block; font-weight:700; margin-bottom:4px;">Revision Reason / Increment Audit Note *</label>
                <textarea name="revisionReason" required minlength="5" rows="3" placeholder="e.g. Annual appraisal increment & promotion to Senior Lead..." style="width:100%; background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:7px; color:var(--text);"></textarea>
              </div>

              <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:8px;">
                <button type="button" onclick="window.closePayrollModal()" class="secondary-button">Cancel</button>
                <button type="submit" class="primary-button">Save Salary Revision</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }

    // 4. Run Payroll 4-Step Wizard Modal
    else if (store.activeModal === "wizard") {
      const step = store.wizardStep;
      modalHtml = `
        <div style="position:fixed; inset:0; z-index:120; display:flex; align-items:center; justify-content:center; padding:16px; background:rgba(2,6,23,0.85); backdrop-filter:blur(4px);">
          <div style="position:relative; width:100%; max-width:650px; background:var(--panel-raised); border:1px solid var(--line); border-radius:18px; padding:24px; color:var(--text);">
            <!-- Wizard Header & Steps Stepper -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <div>
                <h3 style="font-size:1.15rem; font-weight:800; margin:0 0 2px;">Run Payroll Wizard &bull; August 2026</h3>
                <p style="font-size:0.75rem; color:var(--muted-text); margin:0;">Step ${step} of 4</p>
              </div>
              <button onclick="window.closePayrollModal()" style="background:var(--panel-soft); border:1px solid var(--line); border-radius:6px; padding:4px 8px; cursor:pointer; color:var(--muted-text);">✕</button>
            </div>

            <!-- Stepper Progress Bar -->
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; margin-bottom:18px;">
              <div style="height:4px; border-radius:2px; background:${step >= 1 ? 'var(--primary)' : 'var(--line)'};"></div>
              <div style="height:4px; border-radius:2px; background:${step >= 2 ? 'var(--primary)' : 'var(--line)'};"></div>
              <div style="height:4px; border-radius:2px; background:${step >= 3 ? 'var(--primary)' : 'var(--line)'};"></div>
              <div style="height:4px; border-radius:2px; background:${step >= 4 ? 'var(--primary)' : 'var(--line)'};"></div>
            </div>

            <!-- Step 1: Attendance Verification -->
            ${step === 1 ? `
              <div style="display:flex; flex-direction:column; gap:12px; font-size:0.78rem;">
                <h4 style="font-size:0.9rem; font-weight:800; margin:0;">Step 1: Attendance & Unpaid Leave Verification</h4>
                <p style="color:var(--muted-text); margin:0;">Review verified attendance metrics and approved Loss of Pay (LWP) days for August 2026.</p>
                <div style="background:var(--panel-soft); border:1px solid var(--line); border-radius:10px; padding:12px;">
                  <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                    <span>Total Calendar Days in Month:</span>
                    <strong>31 Days</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                    <span>Employees with Zero Unpaid Leave:</span>
                    <strong style="color:#10b981;">6 of 7 Employees (100% Payable)</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between;">
                    <span>Employees with Loss of Pay (LWP):</span>
                    <strong style="color:#ef4444;">1 Employee (Demo Person 18 &bull; 3 Days)</strong>
                  </div>
                </div>
                <div style="padding:10px; background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.2); border-radius:8px; color:#10b981; font-size:0.72rem;">
                  ✓ Leave & attendance records are reconciled and verified.
                </div>
              </div>
            ` : ''}

            <!-- Step 2: Variable Pay & One-Off Adjustments -->
            ${step === 2 ? `
              <div style="display:flex; flex-direction:column; gap:12px; font-size:0.78rem;">
                <h4 style="font-size:0.9rem; font-weight:800; margin:0;">Step 2: Variable Pay & One-off Adjustments</h4>
                <p style="color:var(--muted-text); margin:0;">Review performance bonuses, overtime pay, and travel expense reimbursements.</p>
                <div style="display:flex; flex-direction:column; gap:8px;">
                  ${store.adjustments.map(a => `
                    <div style="background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:10px; display:flex; justify-content:space-between; align-items:center;">
                      <div>
                        <strong>${escapeHtml(a.employeeName)}</strong> &bull; ${escapeHtml(a.label)}
                        <div style="font-size:0.68rem; color:var(--muted-text);">${escapeHtml(a.reason)}</div>
                      </div>
                      <span style="font-weight:800; color:#10b981;">+${moneyDisplay(a.amount)}</span>
                    </div>
                  `).join("")}
                </div>
              </div>
            ` : ''}

            <!-- Step 3: Statutory & Register Review -->
            ${step === 3 ? `
              <div style="display:flex; flex-direction:column; gap:12px; font-size:0.78rem;">
                <h4 style="font-size:0.9rem; font-weight:800; margin:0;">Step 3: Statutory & Register Summary</h4>
                <p style="color:var(--muted-text); margin:0;">Computed gross earnings, statutory deductions (EPF, ESIC, PT, TDS), and final net payable.</p>
                <div style="background:var(--panel-soft); border:1px solid var(--line); border-radius:10px; padding:12px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                  <div>
                    <div style="color:var(--muted-text); font-size:0.7rem;">Total Gross Salary</div>
                    <div style="font-size:1.2rem; font-weight:800; color:var(--text);">${moneyDisplay(totalGross)}</div>
                  </div>
                  <div>
                    <div style="color:var(--muted-text); font-size:0.7rem;">Total Deductions</div>
                    <div style="font-size:1.2rem; font-weight:800; color:#ef4444;">${moneyDisplay(totalDeductions)}</div>
                  </div>
                  <div>
                    <div style="color:var(--muted-text); font-size:0.7rem;">Net Take-Home Payout</div>
                    <div style="font-size:1.2rem; font-weight:800; color:#10b981;">${moneyDisplay(totalNetPayout)}</div>
                  </div>
                  <div>
                    <div style="color:var(--muted-text); font-size:0.7rem;">Employees Processed</div>
                    <div style="font-size:1.2rem; font-weight:800; color:var(--text);">${items.length} Active</div>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- Step 4: Finalize & Generate Payslips -->
            ${step === 4 ? `
              <div style="display:flex; flex-direction:column; gap:12px; font-size:0.78rem;">
                <h4 style="font-size:0.9rem; font-weight:800; margin:0;">Step 4: Confirmation & Payout Readiness</h4>
                <p style="color:var(--muted-text); margin:0;">Everything is calculated and verified. Confirming will update the active cycle register.</p>
                <div style="padding:14px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:10px; color:#10b981;">
                  <div style="font-weight:800; font-size:0.85rem; margin-bottom:4px;">Ready for Payout File & Payslip Distribution</div>
                  <div>All 7 employee records computed successfully. You can download the Bank Payout CSV and publish digital payslips immediately.</div>
                </div>
              </div>
            ` : ''}

            <!-- Wizard Footer Buttons -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding-top:14px; border-top:1px solid var(--line);">
              ${step > 1 
                ? `<button onclick="window.prevPayrollWizardStep()" class="secondary-button" style="font-size:0.75rem;">Back</button>`
                : `<div></div>`}
              ${step < 4 
                ? `<button onclick="window.nextPayrollWizardStep()" class="primary-button" style="font-size:0.75rem;">Next Step &rarr;</button>`
                : `<button onclick="window.finishRunPayroll()" class="primary-button" style="font-size:0.75rem; background:#10b981;">Finish & Save Run</button>`}
            </div>
          </div>
        </div>
      `;
    }

    // ------------------------------------------------------------------------
    // Assemble the Complete Page
    // ------------------------------------------------------------------------
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px; color:var(--text);">
        <!-- Top Bar with Cycle & Primary Actions -->
        <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:14px; background:var(--panel-raised); border:1px solid var(--line); border-radius:20px; padding:20px;">
          <div>
            <div style="display:flex; align-items:center; gap:10px;">
              <h1 style="font-size:1.6rem; font-weight:900; margin:0; letter-spacing:-0.02em;">Payroll Management</h1>
              ${statusPill}
            </div>
            <p style="font-size:0.78rem; color:var(--muted-text); margin:4px 0 0;">
              Review compensation, attendance adjustments and sample payslips.
            </p>
          </div>

          <div style="display:flex; flex-wrap:wrap; align-items:center; gap:8px;">
            <button onclick="window.openRunPayrollWizard()" class="primary-button" style="display:inline-flex; align-items:center; gap:6px; font-size:0.78rem; padding:8px 14px;">
              ${icons.zap} Run Payroll (Aug 2026)
            </button>
            <button onclick="window.exportBankPayoutCSV()" class="secondary-button" style="display:inline-flex; align-items:center; gap:6px; font-size:0.78rem; padding:8px 14px;">
              ${icons.download} Bank Payout CSV
            </button>
            <button onclick="window.publishAllPayslips()" class="secondary-button" style="display:inline-flex; align-items:center; gap:6px; font-size:0.78rem; padding:8px 14px;">
              ${icons.payslips} Publish Payslips
            </button>
          </div>
        </div>

        <!-- 6 Main Tabs Navigation Bar (100% Outline SVG Icons) -->
        <div style="display:flex; overflow-x:auto; background:var(--panel-raised); border:1px solid var(--line); border-radius:14px; padding:4px; gap:4px;">
          ${tabs.map(t => {
            const isActive = store.activeTab === t.id;
            return `
              <button onclick="window.switchPayrollTab('${t.id}')" 
                      style="display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border-radius:10px; font-size:0.75rem; font-weight:700; border:none; cursor:pointer; transition:all 0.15s; white-space:nowrap;
                             ${isActive ? 'background:var(--primary); color:#ffffff; shadow:0 2px 8px rgba(99,102,241,0.4);' : 'background:transparent; color:var(--muted-text);'}">
                ${t.icon}
                <span>${t.label}</span>
              </button>
            `;
          }).join("")}
        </div>

        <!-- Active Tab Content -->
        ${tabContentHtml}

        <!-- Active Modals Overlay -->
        ${modalHtml}
      </div>
    `;
  };

  // Wire up when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.getElementById("payroll") && appState.isMockBypass) {
        window.renderPayrollSuite();
      }
    });
  } else {
    if (document.getElementById("payroll")) {
      window.renderPayrollSuite();
    }
  }

})();
