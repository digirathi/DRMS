'use client';

import React, { useState, useMemo } from 'react';
import {
  PayrollTabId,
  PayrollRunStatus,
  EmployeeCompensationProfile,
  VariableAdjustment,
  PayrollItem
} from '@/types/payroll';
import {
  mockCompensationProfiles,
  mockSalaryStructures,
  mockVariableAdjustments,
  mockPayrollAuditLogs,
  mockStatutoryConfig,
  calculatePayrollItem,
  numberToIndianWords,
  formatIndianCurrency
} from '@/data/mockPayroll';

export default function SuperAdminPayrollPage() {
  const [activeTab, setActiveTab] = useState<PayrollTabId>('dashboard');
  const [selectedMonth] = useState<number>(8);
  const [selectedYear] = useState<number>(2026);
  const [currentRunStatus, setCurrentRunStatus] = useState<PayrollRunStatus>('DRAFT');
  const [finalizedBy, setFinalizedBy] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Interactive Modals State
  const [activeModal, setActiveModal] = useState<
    'wizard' | 'adjustPay' | 'payslip' | 'reviseSalary' | null
  >(null);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);

  // Dynamic state
  const [profiles, setProfiles] = useState<EmployeeCompensationProfile[]>(mockCompensationProfiles);
  const [adjustments, setAdjustments] = useState<VariableAdjustment[]>(mockVariableAdjustments);
  const [onHoldEmployees, setOnHoldEmployees] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Computed Payroll Items
  const items: PayrollItem[] = useMemo(() => {
    return profiles.map((p) =>
      calculatePayrollItem(p, adjustments, onHoldEmployees, currentRunStatus === 'FINALIZED' ? 'FINALIZED' : 'DRAFT')
    );
  }, [profiles, adjustments, onHoldEmployees, currentRunStatus]);

  // KPIs
  const totalGross = items.reduce((s, i) => s + i.grossPay, 0);
  const totalDeductions = items.reduce((s, i) => s + i.totalDeductions, 0);
  const totalNetPayout = items.filter((i) => !i.isOnHold).reduce((s, i) => s + i.netPay, 0);
  const totalLwpSavings = items.reduce((s, i) => s + i.lwpDeduction, 0);
  const heldCount = items.filter((i) => i.isOnHold).length;

  // Filtered Register
  const filteredItems = useMemo(() => {
    return items.filter((i) => {
      const matchDept = departmentFilter === 'ALL' || i.department === departmentFilter;
      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && !i.isOnHold) ||
        (statusFilter === 'HOLD' && i.isOnHold);
      const matchSearch =
        !searchQuery ||
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchStatus && matchSearch;
    });
  }, [items, departmentFilter, statusFilter, searchQuery]);

  const departments = ['ALL', ...Array.from(new Set(profiles.map((p) => p.department)))];

  // Actions
  const handleToggleHold = (empId: string) => {
    setOnHoldEmployees((prev) => {
      const next = new Set(prev);
      if (next.has(empId)) {
        next.delete(empId);
        showToast('✓ Employee unheld. Included in current payout.', 'success');
      } else {
        next.add(empId);
        showToast('ℹ️ Employee payout put on hold.', 'info');
      }
      return next;
    });
  };

  const handleFinalizePayroll = () => {
    if (
      !confirm(
        'Are you sure you want to finalize and lock the August 2026 Payroll Run? This locks calculations and enables bank disbursement.'
      )
    )
      return;
    setCurrentRunStatus('FINALIZED');
    setFinalizedBy('Super Admin');
    showToast('✓ August 2026 Payroll Run is now FINALIZED and LOCKED!', 'success');
  };

  const handleSaveAdjustment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const type = (form.elements.namedItem('adjustType') as HTMLSelectElement).value as any;
    const label = (form.elements.namedItem('adjustLabel') as HTMLInputElement).value.trim();
    const amount = Number((form.elements.namedItem('adjustAmount') as HTMLInputElement).value) || 0;
    const reason = (form.elements.namedItem('adjustReason') as HTMLTextAreaElement).value.trim();

    if (!selectedEmpId || amount <= 0 || reason.length < 5) return;
    const emp = profiles.find((p) => p.employeeId === selectedEmpId);

    const newAdj: VariableAdjustment = {
      id: `adj-${Date.now()}`,
      employeeId: selectedEmpId,
      employeeName: emp ? emp.name : 'Employee',
      type,
      label,
      amount,
      month: selectedMonth,
      year: selectedYear,
      reason,
      approvedBy: 'Super Admin',
      date: new Date().toISOString().slice(0, 10)
    };

    setAdjustments((prev) => [...prev, newAdj]);
    setActiveModal(null);
    showToast(`✓ Added ${label} (₹${amount.toLocaleString()}) for ${emp?.name}.`, 'success');
  };

  const handleSaveSalaryRevision = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const newCtc = Number((form.elements.namedItem('newAnnualCtc') as HTMLInputElement).value) || 0;

    if (!selectedEmpId || newCtc <= 0) return;
    setProfiles((prev) =>
      prev.map((p) =>
        p.employeeId === selectedEmpId
          ? { ...p, annualCtc: newCtc, monthlyGross: Math.round(newCtc / 12) }
          : p
      )
    );
    setActiveModal(null);
    showToast(`✓ Revised Annual CTC to ₹${newCtc.toLocaleString()} / yr.`, 'success');
  };

  const selectedItem = useMemo(() => {
    return items.find((i) => i.employeeId === selectedEmpId) || null;
  }, [items, selectedEmpId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-bounce">
          <div className="px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-3 backdrop-blur-xl bg-emerald-950/90 border-emerald-500/40 text-emerald-300">
            <span>✓</span>
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Payroll Management
            </h1>
            {currentRunStatus === 'FINALIZED' ? (
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect width="18" height="11" x="3" y="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                LOCKED & FINALIZED
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                ACTIVE DRAFT (AUG 2026)
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            Indian statutory compliance, attendance integration, digital payslips, and bank disbursement.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setWizardStep(1);
              setActiveModal('wizard');
            }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-950/50 flex items-center gap-2 transition hover:scale-[1.02]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Run Payroll Wizard
          </button>

          <a
            href="/api/admin/payroll/export/bank-payout"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition hover:scale-[1.02]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Bank Payout CSV
          </a>

          <button
            onClick={() => showToast('✓ All payslips published to Employee Portals!', 'success')}
            className="px-4 py-2.5 bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition hover:scale-[1.02]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Publish Payslips
          </button>
        </div>
      </div>

      {/* 6 Main Navigation Tabs (100% Outline SVG Icons) */}
      <div className="flex overflow-x-auto bg-slate-900/90 backdrop-blur-md p-1.5 border border-slate-800 rounded-2xl gap-1.5 shadow-xl">
        {[
          {
            id: 'dashboard' as const,
            label: 'Dashboard',
            icon: (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
            )
          },
          {
            id: 'register' as const,
            label: 'Salary Register',
            icon: (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <path d="M9 12h6" />
                <path d="M9 16h6" />
              </svg>
            )
          },
          {
            id: 'structures' as const,
            label: 'Salary Structures',
            icon: (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            )
          },
          {
            id: 'profiles' as const,
            label: 'Compensation Profiles',
            icon: (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            )
          },
          {
            id: 'payslips' as const,
            label: 'Payslip Hub',
            icon: (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            )
          },
          {
            id: 'reports' as const,
            label: 'Statutory & Bank',
            icon: (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            )
          }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Net Payout</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">{formatIndianCurrency(totalNetPayout)}</div>
              <span className="text-[11px] text-slate-400">
                {items.length - heldCount} of {items.length} employees payable
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Gross Pay</span>
              <div className="text-2xl font-extrabold text-slate-100 mt-1">{formatIndianCurrency(totalGross)}</div>
              <span className="text-[11px] text-slate-400">Basic, HRA, Special & Bonuses</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Deductions</span>
              <div className="text-2xl font-extrabold text-rose-400 mt-1">{formatIndianCurrency(totalDeductions)}</div>
              <span className="text-[11px] text-slate-400">EPF, ESIC, PT, TDS & LWP</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance LWP Impact</span>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">{formatIndianCurrency(totalLwpSavings)}</div>
              <span className="text-[11px] text-slate-400">Deducted for unapproved/unpaid days</span>
            </div>
          </div>

          {/* Checklist & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
                Payroll Pre-Flight Lifecycle Checklist
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-emerald-400">✓</span>
                    <div>
                      <strong className="block text-slate-200">Attendance & Leave Cutoff Synced</strong>
                      <span className="text-slate-400 text-[11px]">31 calendar days, 0 pending unreviewed leaves in August.</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[11px] font-bold rounded-lg">VERIFIED</span>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-emerald-400">✓</span>
                    <div>
                      <strong className="block text-slate-200">Variable Pay & Reimbursements Reviewed</strong>
                      <span className="text-slate-400 text-[11px]">3 adjustments approved (Bonuses & Overtime: ₹17,700).</span>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab('register')} className="text-indigo-400 hover:underline text-[11px]">
                    Review Pay
                  </button>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-emerald-400">✓</span>
                    <div>
                      <strong className="block text-slate-200">Indian Statutory Compliance Computed</strong>
                      <span className="text-slate-400 text-[11px]">EPF 12% with wage cap, ESIC under ₹21k, PT ₹200, New Regime TDS.</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[11px] font-bold rounded-lg">COMPLIANT</span>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={currentRunStatus === 'FINALIZED' ? 'text-emerald-400' : 'text-amber-400'}>
                      {currentRunStatus === 'FINALIZED' ? (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <rect width="18" height="11" x="3" y="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      )}
                    </span>
                    <div>
                      <strong className="block text-slate-200">Final Approval & Lock</strong>
                      <span className="text-slate-400 text-[11px]">
                        {currentRunStatus === 'FINALIZED' ? `Finalized by ${finalizedBy}` : 'Pending final lock before disbursal'}
                      </span>
                    </div>
                  </div>
                  {currentRunStatus !== 'FINALIZED' ? (
                    <button onClick={handleFinalizePayroll} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold">
                      Lock Payroll
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-bold text-[11px]">LOCKED</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100">Run Shortcuts</h3>
                <p className="text-xs text-slate-400 mt-1">Direct operations for active August 2026 cycle.</p>
                <div className="mt-4 space-y-2.5">
                  <button
                    onClick={() => {
                      setWizardStep(1);
                      setActiveModal('wizard');
                    }}
                    className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                  >
                    Run Payroll Wizard
                  </button>
                  <a
                    href="/api/admin/payroll/export/bank-payout"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                  >
                    Export Bank CSV
                  </a>
                  <button
                    onClick={() => showToast('✓ All 7 payslips published to portal!', 'success')}
                    className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                  >
                    Publish All Payslips
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                Corporate Bank: <strong className="text-slate-200">HDFC Corporate Net Banking</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Salary Register */}
      {activeTab === 'register' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <input
                type="text"
                placeholder="Search name or ID..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 w-48"
              />
              <select
                value={departmentFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDepartmentFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    Dept: {d}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Payable Only</option>
                <option value="HOLD">On Hold Only</option>
              </select>
            </div>

            <a
              href="/api/admin/payroll/export/salary-register"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              Export CSV
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="p-3">Employee</th>
                  <th className="p-3">Days</th>
                  <th className="p-3">Basic</th>
                  <th className="p-3">HRA</th>
                  <th className="p-3">Special / Bonus</th>
                  <th className="p-3 text-slate-200 font-bold">Gross Pay</th>
                  <th className="p-3">LWP / Deduct</th>
                  <th className="p-3">EPF (EE)</th>
                  <th className="p-3">ESIC / PT / TDS</th>
                  <th className="p-3 text-emerald-400 font-extrabold">Net Take-Home</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredItems.map((item) => (
                  <tr key={item.employeeId} className={item.isOnHold ? 'opacity-60 bg-rose-950/10' : ''}>
                    <td className="p-3">
                      <div className="font-bold text-slate-200">{item.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {item.employeeId} &bull; {item.department}
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        {item.payableDays} / {item.daysInMonth}d
                      </div>
                      {item.lwpDays > 0 ? (
                        <div className="text-[10px] text-rose-400 font-bold">-{item.lwpDays}d LWP</div>
                      ) : (
                        <div className="text-[10px] text-emerald-400">0 LWP</div>
                      )}
                    </td>
                    <td className="p-3">{formatIndianCurrency(item.basic)}</td>
                    <td className="p-3">{formatIndianCurrency(item.hra)}</td>
                    <td className="p-3">
                      <div>{formatIndianCurrency(item.special)}</div>
                      {item.bonus + item.overtime > 0 && (
                        <div className="text-[10px] text-emerald-400">+{formatIndianCurrency(item.bonus + item.overtime)}</div>
                      )}
                    </td>
                    <td className="p-3 font-bold text-slate-200">{formatIndianCurrency(item.grossPay)}</td>
                    <td className="p-3 text-rose-400">
                      {item.lwpDeduction > 0 ? `-${formatIndianCurrency(item.lwpDeduction)}` : '-'}
                    </td>
                    <td className="p-3">{item.epfEmployee > 0 ? formatIndianCurrency(item.epfEmployee) : '-'}</td>
                    <td className="p-3">
                      <div>{formatIndianCurrency(item.esicEmployee + item.pt + item.tds)}</div>
                      <div className="text-[10px] text-slate-400">
                        {item.esicEmployee > 0 ? 'ESIC+' : ''}PT: ₹{item.pt}
                        {item.tds > 0 ? ' TDS' : ''}
                      </div>
                    </td>
                    <td className="p-3 font-extrabold text-sm text-emerald-400">{formatIndianCurrency(item.netPay)}</td>
                    <td className="p-3">
                      {item.isOnHold ? (
                        <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] font-bold rounded">
                          ON HOLD
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded">
                          PAYABLE
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedEmpId(item.employeeId);
                            setActiveModal('adjustPay');
                          }}
                          title="Adjust Pay"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEmpId(item.employeeId);
                            setActiveModal('payslip');
                          }}
                          title="Preview Payslip"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleToggleHold(item.employeeId)}
                          title={item.isOnHold ? 'Unhold' : 'Hold'}
                          className={`p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg ${
                            item.isOnHold ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Salary Structures */}
      {activeTab === 'structures' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Salary Structure Templates</h3>
              <p className="text-xs text-slate-400 mt-0.5">Defined component ratios mapped to employee designations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockSalaryStructures.map((struct) => (
                <div key={struct.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-200 text-sm">{struct.name}</h4>
                      <span className="text-[11px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-semibold">
                        {struct.employeesCount} Assigned
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 mb-3">{struct.description}</p>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Basic:</span>
                        <strong className="text-slate-200">{struct.basicPct}%</strong>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>HRA:</span>
                        <strong className="text-slate-200">{struct.hraPct}%</strong>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Special:</span>
                        <strong className="text-slate-200">{struct.specialPct}%</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/80 flex gap-1.5 text-[10px]">
                    <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">EPF {struct.hasEpf ? 'Yes' : 'No'}</span>
                    <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">ESIC {struct.hasEsic ? 'Yes' : 'No'}</span>
                    <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">PT {struct.hasPt ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Indian Statutory Compliance Rules Matrix</h3>
              <p className="text-xs text-slate-400 mt-0.5">Enforced automatically in monthly computations.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
                <strong className="block text-slate-200">1. Provident Fund (EPF)</strong>
                <p className="text-slate-400 text-[11px]">EPF & MP Act, 1952</p>
                <div>Employee Share: <strong>12% of Basic</strong></div>
                <div>Employer Share: <strong>12% (3.67% + 8.33%)</strong></div>
                <div>Wage Ceiling: <strong>₹15,000 (₹1,800 cap)</strong></div>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
                <strong className="block text-slate-200">2. ESI (ESIC)</strong>
                <p className="text-slate-400 text-[11px]">ESI Act, 1948 Coverage</p>
                <div>Wage Limit: <strong>Gross &le; ₹21,000 / mo</strong></div>
                <div>Employee: <strong>0.75% of Gross</strong></div>
                <div>Employer: <strong>3.25% of Gross</strong></div>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
                <strong className="block text-slate-200">3. Professional Tax (PT)</strong>
                <p className="text-slate-400 text-[11px]">State Tax Department</p>
                <div>Monthly: <strong>₹200 / month</strong></div>
                <div>February: <strong>₹300 in Feb</strong></div>
                <div>Annual Total: <strong>₹2,500 / year</strong></div>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
                <strong className="block text-slate-200">4. Income Tax TDS</strong>
                <p className="text-slate-400 text-[11px]">Sec 192 Income Tax Act</p>
                <div>Regime: <strong>New Tax Regime</strong></div>
                <div>Standard Ded: <strong>₹75,000</strong></div>
                <div>Rebate Limit: <strong>Up to ₹7.5 LPA</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Compensation Profiles */}
      {activeTab === 'profiles' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Employee Compensation & Bank Master</h3>
            <p className="text-xs text-slate-400 mt-0.5">Configured Annual CTCs, bank accounts, and statutory identifiers.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="p-3">Employee</th>
                  <th className="p-3">Structure</th>
                  <th className="p-3">Annual CTC</th>
                  <th className="p-3">Monthly Gross</th>
                  <th className="p-3">Bank Details</th>
                  <th className="p-3">PAN / UAN</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {profiles.map((emp) => (
                  <tr key={emp.employeeId}>
                    <td className="p-3">
                      <div className="font-bold text-slate-200">{emp.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {emp.employeeId} &bull; {emp.department} &bull; {emp.designation}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded text-[11px] font-semibold">
                        {emp.structureName}
                      </span>
                    </td>
                    <td className="p-3 font-extrabold text-slate-100">{formatIndianCurrency(emp.annualCtc)}</td>
                    <td className="p-3 font-bold text-emerald-400">{formatIndianCurrency(emp.monthlyGross)}</td>
                    <td className="p-3">
                      <div>{emp.bankDetails.bankName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        A/C: •••• {emp.bankDetails.accountNumber.slice(-4)} &bull; {emp.bankDetails.ifsc}
                      </div>
                    </td>
                    <td className="p-3">
                      <div>PAN: <strong>{emp.statutory.pan}</strong></div>
                      <div className="text-[11px] text-slate-400">UAN: {emp.statutory.uan}</div>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedEmpId(emp.employeeId);
                          setActiveModal('reviseSalary');
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold"
                      >
                        Revise Salary
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Payslips Hub */}
      {activeTab === 'payslips' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">August 2026 Payslips Directory</h3>
              <p className="text-xs text-slate-400 mt-0.5">Dispatched to employee self-service portal upon publishing.</p>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => showToast('✓ All payslips published to Employee Portals!', 'success')}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
              >
                Publish All to Portal
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.employeeId} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm">{item.name}</h4>
                      <p className="text-xs text-slate-400">
                        {item.employeeId} &bull; {item.department}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded">
                      AUG 2026
                    </span>
                  </div>

                  <div className="my-3 p-3 bg-slate-900 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Net Salary</span>
                      <div className="text-lg font-extrabold text-emerald-400">{formatIndianCurrency(item.netPay)}</div>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      <div>Days: {item.payableDays} / {item.daysInMonth}</div>
                      <div>Deduct: {formatIndianCurrency(item.totalDeductions)}</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedEmpId(item.employeeId);
                    setActiveModal('payslip');
                  }}
                  className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold"
                >
                  View Digital Payslip
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Statutory Reports & Banking */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100">Bank Payout Batch File (NEFT / RTGS)</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct upload format for Indian Corporate Net Banking portals.
                </p>
              </div>
              <a
                href="/api/admin/payroll/export/bank-payout"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2"
              >
                Export Bank Payout CSV
              </a>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-xs flex flex-wrap justify-between gap-4">
              <div>Debit A/C: <strong>00000000000001 (Digi Rathi Technologies Pvt Ltd)</strong></div>
              <div>Beneficiaries: <strong>{items.filter((i) => !i.isOnHold).length} Employees</strong></div>
              <div>Total Payout: <strong className="text-emerald-400">{formatIndianCurrency(totalNetPayout)}</strong></div>
              <div>Cycle: <strong>August 2026</strong></div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100">Statutory Return Exports</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <strong className="block text-slate-200">EPF Electronic Challan (ECR)</strong>
                <p className="text-slate-400 text-[11px]">Monthly return for EPFO portal with UAN numbers and wages.</p>
                <a
                  href="/api/admin/payroll/export/salary-register"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold"
                >
                  Download ECR Statement
                </a>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <strong className="block text-slate-200">ESIC Monthly Statement</strong>
                <p className="text-slate-400 text-[11px]">Return for covered employees (Gross &le; ₹21,000).</p>
                <a
                  href="/api/admin/payroll/export/salary-register"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold"
                >
                  Download ESIC Return
                </a>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <strong className="block text-slate-200">Professional Tax (PT) Form</strong>
                <p className="text-slate-400 text-[11px]">Monthly state government PT deduction statement.</p>
                <a
                  href="/api/admin/payroll/export/salary-register"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold"
                >
                  Download PT Form
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Digital Payslip Modal */}
      {activeModal === 'payslip' && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white text-slate-900 border rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <span className="text-xs font-bold text-slate-500">Digital Payslip Preview &bull; August 2026</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                >
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Payslip Card */}
            <div>
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-3">
                <div>
                  <h2 className="text-lg font-black text-slate-900">DIGIRATHI TECHNOLOGIES PVT LTD</h2>
                  <p className="text-[11px] text-slate-600">CIN: U72900DL2023PTC123456 &bull; GSTIN: 07AAAAA0000A1Z5</p>
                  <p className="text-[11px] text-slate-600">Level 4, Tech Boulevard, Sector 127, Noida, UP 201301</p>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-indigo-600">PAYSLIP</div>
                  <div className="text-xs font-bold text-slate-800">August 2026</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs mb-4">
                <div>
                  <div>Name: <strong>{selectedItem.name}</strong></div>
                  <div>ID: <strong>{selectedItem.employeeId}</strong></div>
                  <div>Dept: <strong>{selectedItem.department}</strong></div>
                  <div>Role: <strong>{selectedItem.designation}</strong></div>
                </div>
                <div>
                  <div>Bank: <strong>{selectedItem.bankDetails.bankName}</strong></div>
                  <div>A/C: <strong>•••• {selectedItem.bankDetails.accountNumber.slice(-4)}</strong></div>
                  <div>IFSC: <strong>{selectedItem.bankDetails.ifsc}</strong></div>
                  <div>PAN: <strong>{selectedItem.statutory.pan}</strong> &bull; UAN: <strong>{selectedItem.statutory.uan}</strong></div>
                  <div>Days: <strong>{selectedItem.daysInMonth}</strong> (Payable: <strong>{selectedItem.payableDays}</strong>, LWP: <strong className="text-rose-600">{selectedItem.lwpDays}</strong>)</div>
                </div>
              </div>

              <div className="grid grid-cols-2 border border-slate-200 rounded-xl overflow-hidden text-xs mb-4">
                <div className="border-r border-slate-200">
                  <div className="bg-slate-100 p-2 font-bold flex justify-between">
                    <span>EARNINGS</span>
                    <span>AMOUNT (₹)</span>
                  </div>
                  <div className="p-3 space-y-1.5">
                    <div className="flex justify-between">
                      <span>Basic Salary</span>
                      <strong>{selectedItem.basic.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>HRA</span>
                      <strong>{selectedItem.hra.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Special Allowance</span>
                      <strong>{selectedItem.special.toLocaleString()}</strong>
                    </div>
                    {selectedItem.bonus > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Performance Bonus</span>
                        <strong>+{selectedItem.bonus.toLocaleString()}</strong>
                      </div>
                    )}
                    {selectedItem.overtime > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Overtime Pay</span>
                        <strong>+{selectedItem.overtime.toLocaleString()}</strong>
                      </div>
                    )}
                  </div>
                  <div className="bg-slate-50 p-2 border-t border-slate-200 font-bold flex justify-between">
                    <span>GROSS PAY</span>
                    <span>₹{selectedItem.grossPay.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <div className="bg-slate-100 p-2 font-bold flex justify-between">
                    <span>DEDUCTIONS</span>
                    <span>AMOUNT (₹)</span>
                  </div>
                  <div className="p-3 space-y-1.5">
                    <div className="flex justify-between">
                      <span>EPF Employee (12%)</span>
                      <strong>{selectedItem.epfEmployee.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>ESIC Contribution</span>
                      <strong>{selectedItem.esicEmployee.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Professional Tax (PT)</span>
                      <strong>{selectedItem.pt.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Income Tax (TDS)</span>
                      <strong>{selectedItem.tds.toLocaleString()}</strong>
                    </div>
                    {selectedItem.lwpDeduction > 0 && (
                      <div className="flex justify-between text-rose-600">
                        <span>LWP ({selectedItem.lwpDays}d)</span>
                        <strong>-{selectedItem.lwpDeduction.toLocaleString()}</strong>
                      </div>
                    )}
                  </div>
                  <div className="bg-slate-50 p-2 border-t border-slate-200 font-bold flex justify-between">
                    <span>TOTAL DEDUCTIONS</span>
                    <span className="text-rose-600">₹{selectedItem.totalDeductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase">Net Salary Payable</span>
                  <span className="text-xl font-black">₹{selectedItem.netPay.toLocaleString()}</span>
                </div>
                <div className="text-xs mt-1 italic">
                  In Words: <strong>{numberToIndianWords(selectedItem.netPay)}</strong>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-200 flex justify-between">
                <span>Computer generated document &bull; DigiRathi DRMS</span>
                <strong>For DIGIRATHI TECHNOLOGIES PVT LTD</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Adjust Pay Modal */}
      {activeModal === 'adjustPay' && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="font-bold text-sm">Adjust Variable Pay</h3>
                <p className="text-xs text-slate-400">
                  {selectedItem.name} ({selectedItem.employeeId}) &bull; August 2026
                </p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Adjustment Type *</label>
                <select
                  name="adjustType"
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                >
                  <option value="BONUS">Performance Bonus / Incentive (+)</option>
                  <option value="OVERTIME">Overtime Pay (+)</option>
                  <option value="REIMBURSEMENT">Expense Reimbursement (+)</option>
                  <option value="DEDUCTION">Ad-hoc Deduction / Penalty (-)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Title / Label *</label>
                <input
                  type="text"
                  name="adjustLabel"
                  required
                  placeholder="e.g. Q2 Performance Bonus"
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  name="adjustAmount"
                  required
                  min="1"
                  step="100"
                  placeholder="e.g. 5000"
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Audit Reason *</label>
                <textarea
                  name="adjustReason"
                  required
                  rows={3}
                  placeholder="Mandatory reason for finance compliance..."
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold"
                >
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Revise Salary Modal */}
      {activeModal === 'reviseSalary' && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="font-bold text-sm">Revise Employee Salary</h3>
                <p className="text-xs text-slate-400">{selectedItem.name}</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSalaryRevision} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">New Annual CTC (₹) *</label>
                <input
                  type="number"
                  name="newAnnualCtc"
                  required
                  min="100000"
                  step="10000"
                  defaultValue={profiles.find((p) => p.employeeId === selectedEmpId)?.annualCtc}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Revision Reason / Increment Note *</label>
                <textarea
                  name="revisionReason"
                  required
                  rows={3}
                  placeholder="e.g. Annual appraisal increment..."
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold"
                >
                  Save Revision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: 4-Step Run Payroll Wizard */}
      {activeModal === 'wizard' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm">Run Payroll Wizard &bull; August 2026</h3>
                <p className="text-xs text-slate-400">Step {wizardStep} of 4</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              <div className={`h-1 rounded ${wizardStep >= 1 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
              <div className={`h-1 rounded ${wizardStep >= 2 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
              <div className={`h-1 rounded ${wizardStep >= 3 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
              <div className={`h-1 rounded ${wizardStep >= 4 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
            </div>

            {wizardStep === 1 && (
              <div className="space-y-3 text-xs">
                <strong className="block text-slate-200">Step 1: Attendance Verification</strong>
                <p className="text-slate-400">Review reconciled attendance and unpaid leave days.</p>
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="flex justify-between">
                    <span>Days in August:</span>
                    <strong>31 Days</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Full Attendance:</span>
                    <strong className="text-emerald-400">6 Employees</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Loss of Pay (LWP):</span>
                    <strong className="text-rose-400">1 Employee (Demo Person 18 &bull; 3d)</strong>
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="space-y-3 text-xs">
                <strong className="block text-slate-200">Step 2: Variable Pay Review</strong>
                <p className="text-slate-400">Review performance bonuses and overtime pay.</p>
                <div className="space-y-2">
                  {adjustments.map((a) => (
                    <div key={a.id} className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl flex justify-between items-center">
                      <div>
                        <strong className="text-slate-200">{a.employeeName}</strong> &bull; {a.label}
                      </div>
                      <span className="font-bold text-emerald-400">+{formatIndianCurrency(a.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {wizardStep === 3 && (
              <div className="space-y-3 text-xs">
                <strong className="block text-slate-200">Step 3: Statutory & Payout Summary</strong>
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <div>Gross: <strong className="text-slate-200 block text-sm">{formatIndianCurrency(totalGross)}</strong></div>
                  <div>Deductions: <strong className="text-rose-400 block text-sm">{formatIndianCurrency(totalDeductions)}</strong></div>
                  <div className="col-span-2 pt-2 border-t border-slate-800">
                    Net Take-Home: <strong className="text-emerald-400 block text-base">{formatIndianCurrency(totalNetPayout)}</strong>
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 4 && (
              <div className="space-y-3 text-xs">
                <strong className="block text-slate-200">Step 4: Readiness & Confirmation</strong>
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-xl">
                  ✓ Ready to generate payroll register. All 7 employee payouts are balanced and validated.
                </div>
              </div>
            )}

            <div className="flex justify-between pt-3 border-t border-slate-800 text-xs">
              {wizardStep > 1 ? (
                <button
                  onClick={() => setWizardStep((s) => s - 1)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {wizardStep < 4 ? (
                <button
                  onClick={() => setWizardStep((s) => s + 1)}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold"
                >
                  Next Step &rarr;
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveModal(null);
                    showToast('✓ Payroll calculation completed for August 2026!', 'success');
                    setActiveTab('register');
                  }}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                >
                  Finish & Save Run
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
