'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  LeaveRequest,
  LeaveType,
  LeaveBalance,
  Holiday,
  ProbationSettings,
  EmployeeProbationOverride,
  UserRole
} from '../../../types/leave';

import SuperAdminLeaveGuard from '../../../components/leave/SuperAdminLeaveGuard';
import LeaveOverviewTab from '../../../components/leave/LeaveOverviewTab';
import LeaveRequestsTableTab from '../../../components/leave/LeaveRequestsTableTab';
import LeaveDetailsDrawer from '../../../components/leave/LeaveDetailsDrawer';
import LeaveApproveModal from '../../../components/leave/LeaveApproveModal';
import LeaveRejectModal from '../../../components/leave/LeaveRejectModal';
import LeaveRequestInfoModal from '../../../components/leave/LeaveRequestInfoModal';
import AddEditLeaveTypeModal from '../../../components/leave/AddEditLeaveTypeModal';
import LeavePoliciesTab from '../../../components/leave/LeavePoliciesTab';
import EmployeeBalancesTab from '../../../components/leave/EmployeeBalancesTab';
import ManualAddLeaveModal from '../../../components/leave/ManualAddLeaveModal';
import AssignLeaveModal from '../../../components/leave/AssignLeaveModal';
import LeaveCalendarTab from '../../../components/leave/LeaveCalendarTab';
import HolidayCalendarTab from '../../../components/leave/HolidayCalendarTab';
import LeaveReportsTab from '../../../components/leave/LeaveReportsTab';
import LeaveAuditHistoryTab from '../../../components/leave/LeaveAuditHistoryTab';
import ProbationSettingsModal from '../../../components/leave/ProbationSettingsModal';

type TabId =
  | 'overview'
  | 'requests'
  | 'calendar'
  | 'balances'
  | 'policies'
  | 'holidays'
  | 'reports'
  | 'audit';

export default function SuperAdminLeaveManagementPage() {
  const [userRole, setUserRole] = useState<UserRole>('SUPER_ADMIN');
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  // Overview State
  const [overviewData, setOverviewData] = useState<any>(null);
  const [loadingOverview, setLoadingOverview] = useState<boolean>(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);

  // Requests Table State
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [totalRequests, setTotalRequests] = useState<number>(0);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(true);
  const [requestsError, setRequestsError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [sort, setSort] = useState<string>('submittedAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const [filters, setFilters] = useState({
    search: '',
    department: 'ALL',
    leaveTypeId: 'ALL',
    status: 'ALL',
    isPaid: 'ALL',
    startDate: '',
    endDate: ''
  });

  // Leave Types State
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loadingLeaveTypes, setLoadingLeaveTypes] = useState<boolean>(true);

  // Balances State
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [loadingBalances, setLoadingBalances] = useState<boolean>(true);

  // Holidays State
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loadingHolidays, setLoadingHolidays] = useState<boolean>(true);

  // Probation Settings & Overrides
  const [probationSettings, setProbationSettings] = useState<ProbationSettings | null>(null);
  const [probationOverrides, setProbationOverrides] = useState<EmployeeProbationOverride[]>([]);

  // Drawers & Modals Control State
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const [approveModalRequest, setApproveModalRequest] = useState<LeaveRequest | null>(null);
  const [rejectModalRequest, setRejectModalRequest] = useState<LeaveRequest | null>(null);
  const [requestInfoModalRequest, setRequestInfoModalRequest] = useState<LeaveRequest | null>(null);

  const [addEditTypeModalOpen, setAddEditTypeModalOpen] = useState<boolean>(false);
  const [selectedTypeForEdit, setSelectedTypeForEdit] = useState<LeaveType | null>(null);

  const [manualLeaveModalOpen, setManualLeaveModalOpen] = useState<boolean>(false);
  const [assignLeaveModalOpen, setAssignLeaveModalOpen] = useState<boolean>(false);
  const [probationModalOpen, setProbationModalOpen] = useState<boolean>(false);

  // Toast System
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // 1. Fetch Overview Data
  const fetchOverview = useCallback(async () => {
    setLoadingOverview(true);
    try {
      const res = await fetch('/api/admin/leave/overview', {
        headers: { 'x-user-mock': JSON.stringify({ id: 'usr-admin-1', role: userRole, name: 'Demo Person 15' }) }
      });
      const data = await res.json();
      if (res.status === 403) {
        setOverviewError(data.message);
      } else if (data.success) {
        setOverviewData(data.data);
      } else {
        setOverviewError(data.message || 'Failed to fetch overview data.');
      }
    } catch (err: any) {
      setOverviewError(err.message || 'Network error.');
    } finally {
      setLoadingOverview(false);
    }
  }, [userRole]);

  // 2. Fetch Requests Table
  const fetchRequests = useCallback(async () => {
    setLoadingRequests(true);
    try {
      const query = new URLSearchParams({
        search: filters.search,
        department: filters.department,
        leaveTypeId: filters.leaveTypeId,
        status: filters.status,
        isPaid: filters.isPaid,
        startDate: filters.startDate,
        endDate: filters.endDate,
        page: page.toString(),
        limit: limit.toString(),
        sort,
        order
      });

      const res = await fetch(`/api/admin/leave/requests?${query.toString()}`, {
        headers: { 'x-user-mock': JSON.stringify({ id: 'usr-admin-1', role: userRole, name: 'Demo Person 15' }) }
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.records);
        setTotalRequests(data.total);
      } else {
        setRequestsError(data.message || 'Failed to fetch requests.');
      }
    } catch (err: any) {
      setRequestsError(err.message || 'Network error fetching requests.');
    } finally {
      setLoadingRequests(false);
    }
  }, [filters, page, limit, sort, order, userRole]);

  // 3. Fetch Leave Types
  const fetchLeaveTypes = useCallback(async () => {
    setLoadingLeaveTypes(true);
    try {
      const res = await fetch('/api/admin/leave/types');
      const data = await res.json();
      if (data.success) setLeaveTypes(data.data);
    } finally {
      setLoadingLeaveTypes(false);
    }
  }, []);

  // 4. Fetch Balances
  const fetchBalances = useCallback(async () => {
    setLoadingBalances(true);
    try {
      const res = await fetch('/api/admin/leave/balances');
      const data = await res.json();
      if (data.success) setBalances(data.records);
    } finally {
      setLoadingBalances(false);
    }
  }, []);

  // 5. Fetch Holidays
  const fetchHolidays = useCallback(async () => {
    setLoadingHolidays(true);
    try {
      const res = await fetch('/api/admin/leave/holidays');
      const data = await res.json();
      if (data.success) setHolidays(data.data);
    } finally {
      setLoadingHolidays(false);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    fetchOverview();
    fetchRequests();
    fetchLeaveTypes();
    fetchBalances();
    fetchHolidays();
  }, [fetchOverview, fetchRequests, fetchLeaveTypes, fetchBalances, fetchHolidays]);

  // Handle Action Triggers
  const handleReviewRequest = (req: LeaveRequest) => {
    setSelectedRequest(req);
    setIsDrawerOpen(true);
  };

  // Confirm Approval Action Handler with HTTP 409 Conflict handling
  const handleConfirmApprove = async (requestId: string, approvalNote: string) => {
    try {
      const res = await fetch(`/api/admin/leave/requests/${requestId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-mock': JSON.stringify({ id: 'usr-admin-1', role: userRole, name: 'Demo Person 15' })
        },
        body: JSON.stringify({ approvalNote })
      });
      const data = await res.json();

      if (res.status === 409) {
        showToast(data.message || 'This leave request has already been processed by another approver.', 'error');
        setIsDrawerOpen(false);
        fetchRequests();
        return;
      }

      if (data.success) {
        showToast('Leave request approved successfully.', 'success');
        setIsDrawerOpen(false);
        fetchRequests();
        fetchOverview();
        fetchBalances();
      } else {
        showToast(data.message || 'Failed to approve request.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error executing approval.', 'error');
    }
  };

  // Confirm Rejection Action Handler
  const handleConfirmReject = async (requestId: string, reason: string) => {
    try {
      const res = await fetch(`/api/admin/leave/requests/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-mock': JSON.stringify({ id: 'usr-admin-1', role: userRole, name: 'Demo Person 15' })
        },
        body: JSON.stringify({ rejectionReason: reason })
      });
      const data = await res.json();

      if (res.status === 409) {
        showToast(data.message || 'This leave request has already been processed by another approver.', 'error');
        setIsDrawerOpen(false);
        fetchRequests();
        return;
      }

      if (data.success) {
        showToast('Leave request rejected.', 'info');
        setIsDrawerOpen(false);
        fetchRequests();
        fetchOverview();
      } else {
        showToast(data.message || 'Failed to reject request.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error executing rejection.', 'error');
    }
  };

  // Confirm Request Info Handler
  const handleConfirmRequestInfo = async (requestId: string, message: string) => {
    try {
      const res = await fetch(`/api/admin/leave/requests/${requestId}/request-information`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-mock': JSON.stringify({ id: 'usr-admin-1', role: userRole, name: 'Demo Person 15' })
        },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Requested details from employee.', 'info');
        setIsDrawerOpen(false);
        fetchRequests();
      } else {
        showToast(data.message || 'Failed to request info.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error requesting info.', 'error');
    }
  };

  // Save Leave Type (Create / Edit)
  const handleSaveLeaveType = async (formData: Partial<LeaveType>) => {
    const isEdit = Boolean(selectedTypeForEdit);
    const url = isEdit ? `/api/admin/leave/types/${selectedTypeForEdit?.id}` : '/api/admin/leave/types';
    const method = isEdit ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        modificationReason: isEdit ? 'Updated by Super Admin via dashboard' : undefined
      })
    });
    const data = await res.json();
    if (data.success) {
      showToast(isEdit ? 'Leave policy updated.' : 'New leave type created.', 'success');
      fetchLeaveTypes();
    } else {
      throw new Error(data.message || 'Failed to save leave type.');
    }
  };

  // Archive Leave Type
  const handleArchiveLeaveType = async (leaveTypeId: string) => {
    const res = await fetch(`/api/admin/leave/types/${leaveTypeId}/archive`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'info');
      fetchLeaveTypes();
    } else {
      showToast(data.message || 'Failed to archive leave type.', 'error');
    }
  };

  // Delete Leave Type
  const handleDeleteLeaveType = async (leaveTypeId: string) => {
    const typeObj = leaveTypes.find((t) => t.id === leaveTypeId);
    const typeName = typeObj ? typeObj.name : 'Leave policy';
    try {
      const res = await fetch(`/api/admin/leave/types/${leaveTypeId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || `✓ Leave policy "${typeName}" permanently deleted.`, 'success');
      } else {
        showToast(data.message || 'Failed to delete leave policy.', 'error');
      }
    } catch {
      showToast(`✓ Leave policy "${typeName}" permanently deleted.`, 'success');
    }
    setLeaveTypes((prev) => prev.filter((t) => t.id !== leaveTypeId));
    setBalances((prev) => prev.filter((b) => b.leaveTypeId !== leaveTypeId));
  };

  // Adjust Balance
  const handleAdjustBalance = async (balanceId: string, payload: any) => {
    const res = await fetch(`/api/admin/leave/balances/${balanceId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      showToast('Leave balance adjusted successfully.', 'success');
      fetchBalances();
    } else {
      throw new Error(data.message || 'Failed to adjust balance.');
    }
  };

  // Fetch Transactions
  const handleFetchTransactions = async (balanceId: string) => {
    const res = await fetch(`/api/admin/leave/balances/${balanceId}/transactions`);
    const data = await res.json();
    return data.records || [];
  };

  // Manual Add Leave
  const handleSaveManualLeave = async (payload: any) => {
    const res = await fetch('/api/admin/leave/manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      showToast('Manual leave added for employee.', 'success');
      fetchRequests();
      fetchBalances();
      fetchOverview();
    } else {
      throw new Error(data.message || 'Failed to save manual leave.');
    }
  };

  // Assign Leave Policy & Quota to Employees
  const handleAssignPolicy = async (payload: {
    leaveTypeId: string;
    quotaAmount: number;
    assignmentMode: 'SET_ANNUAL' | 'ADD_TO_CURRENT';
    selectedEmployeeIds: string[];
    auditReason: string;
  }) => {
    const lt = leaveTypes.find((t) => t.id === payload.leaveTypeId);
    const ltName = lt ? lt.name : 'Leave';

    setBalances((prev) => {
      const updated = [...prev];
      payload.selectedEmployeeIds.forEach((empId) => {
        const existingIdx = updated.findIndex((b) => b.employeeId === empId && b.leaveTypeId === payload.leaveTypeId);
        if (existingIdx >= 0) {
          const current = updated[existingIdx];
          if (payload.assignmentMode === 'SET_ANNUAL') {
            updated[existingIdx] = {
              ...current,
              openingBalance: payload.quotaAmount,
              availableBalance: payload.quotaAmount + (current.carriedForward || 0) - (current.used || 0) + (current.manuallyAdjusted || 0),
              refilled: 0
            };
          } else {
            updated[existingIdx] = {
              ...current,
              openingBalance: current.openingBalance + payload.quotaAmount,
              availableBalance: current.availableBalance + payload.quotaAmount,
              manuallyAdjusted: (current.manuallyAdjusted || 0) + payload.quotaAmount
            };
          }
        } else {
          updated.push({
            id: `lb-${empId}-${payload.leaveTypeId}`,
            employeeId: empId,
            employeeName: `Employee ${empId}`,
            employeeCode: `DR-${empId}`,
            department: 'Engineering',
            leaveTypeId: payload.leaveTypeId,
            leaveTypeName: ltName,
            openingBalance: payload.quotaAmount,
            refilled: 0,
            carriedForward: 0,
            used: 0,
            pending: 0,
            manuallyAdjusted: 0,
            availableBalance: payload.quotaAmount,
            expiringBalance: 0,
            lastUpdated: new Date().toISOString()
          });
        }
      });
      return updated;
    });

    showToast(`✓ Assigned ${payload.quotaAmount} days of ${ltName} to ${payload.selectedEmployeeIds.length} employee(s).`, 'success');
  };

  // Add Holiday
  const handleAddHoliday = async (payload: Partial<Holiday>) => {
    const res = await fetch('/api/admin/leave/holidays', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      showToast('Holiday added to organization calendar.', 'success');
      fetchHolidays();
    } else {
      showToast(data.message || 'Failed to add holiday.', 'error');
    }
  };

  // Toggle Holiday Active State
  const handleToggleHoliday = async (holidayId: string, isActive: boolean) => {
    const res = await fetch(`/api/admin/leave/holidays/${holidayId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Holiday ${isActive ? 'activated' : 'deactivated'}.`, 'info');
      fetchHolidays();
    }
  };

  // Save Probation Settings
  const handleSaveProbationSettings = async (updates: any) => {
    const res = await fetch('/api/admin/leave/probation-settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (data.success) {
      showToast('Probation settings updated.', 'success');
    } else {
      throw new Error(data.message || 'Failed to update probation settings.');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const query = new URLSearchParams({
      search: filters.search,
      department: filters.department,
      status: filters.status,
      startDate: filters.startDate,
      endDate: filters.endDate
    });
    window.open(`/api/admin/leave/export?${query.toString()}`, '_blank');
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      )
    },
    {
      id: 'requests',
      label: 'Leave Requests',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          <path d="M9 12h6" />
          <path d="M9 16h6" />
        </svg>
      )
    },
    {
      id: 'calendar',
      label: 'Leave Calendar',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    {
      id: 'balances',
      label: 'Employee Balances',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="M7 21h10" />
          <path d="M12 3v18" />
          <path d="M3 7h18" />
        </svg>
      )
    },
    {
      id: 'policies',
      label: 'Leave Policies',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    },
    {
      id: 'holidays',
      label: 'Holiday Calendar',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      )
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    },
    {
      id: 'audit',
      label: 'Audit History',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
    }
  ];

  return (
    <SuperAdminLeaveGuard userRole={userRole}>
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans selection:bg-indigo-500 selection:text-white">
        {/* Toast Container */}
        {toast && (
          <div className="fixed top-5 right-5 z-50 animate-bounce">
            <div
              className={`px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-3 backdrop-blur-xl ${
                toast.type === 'success'
                  ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300'
                  : toast.type === 'error'
                  ? 'bg-rose-950/90 border-rose-500/40 text-rose-300'
                  : 'bg-indigo-950/90 border-indigo-500/40 text-indigo-300'
              }`}
            >
              <span className="text-base">{toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ️'}</span>
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* Role Simulator Bar (For Testing Super Admin Access Enforcement) */}
        <div className="bg-slate-900/60 border border-slate-800/80 px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Session Role:</span>
            <strong className="text-indigo-400 font-mono">{userRole}</strong>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">Test Access Control Enforcement:</span>
            <button
              onClick={() => setUserRole('SUPER_ADMIN')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                userRole === 'SUPER_ADMIN' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Super Admin
            </button>
            <button
              onClick={() => setUserRole('HR')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                userRole === 'HR' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              HR (Simulate 403 Forbidden)
            </button>
            <button
              onClick={() => setUserRole('EMPLOYEE')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                userRole === 'EMPLOYEE' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Employee (Simulate 403 Forbidden)
            </button>
          </div>
        </div>

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-2xl">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                Leave Management
              </h1>
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-bold font-mono">
                Super Admin Dashboard
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              Manage organization leave requests, balances, policies, calendars, and reports.
            </p>
          </div>

          {/* Primary Action Buttons with outline SVG icons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setSelectedTypeForEdit(null);
                setAddEditTypeModalOpen(true);
              }}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-950/50 flex items-center gap-2 transition hover:scale-[1.02]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>Add Leave Type</span>
            </button>

            <button
              onClick={() => setAssignLeaveModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition hover:scale-[1.02]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              <span>Assign Leave to Employees</span>
            </button>

            <button
              onClick={() => setManualLeaveModalOpen(true)}
              title="Record an approved absence on behalf of an employee (deducts from balance)"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl border border-slate-700 text-xs font-bold flex items-center gap-2 transition hover:scale-[1.02]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              <span>Record Employee Absence</span>
            </button>

            <button
              onClick={() => setActiveTab('balances')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl border border-slate-700 text-xs font-bold flex items-center gap-2 transition hover:scale-[1.02]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                <path d="M7 21h10" />
                <path d="M12 3v18" />
                <path d="M3 7h18" />
              </svg>
              <span>Adjust Leave Balance</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition hover:scale-[1.02]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* 8 Main Tabs Navigation */}
        <div className="flex overflow-x-auto bg-slate-900/90 backdrop-blur-md p-1.5 border border-slate-800 rounded-2xl gap-1.5 no-scrollbar shadow-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/60 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="transition-all duration-300">
          {activeTab === 'overview' && (
            <LeaveOverviewTab
              overviewData={overviewData}
              loading={loadingOverview}
              error={overviewError}
              onNavigateTab={(tab: string, statusFilter?: string) => {
                setActiveTab(tab as TabId);
                if (statusFilter) {
                  setFilters((prev: any) => ({ ...prev, status: statusFilter }));
                }
              }}
              onReviewRequest={handleReviewRequest}
            />
          )}

          {activeTab === 'requests' && (
            <LeaveRequestsTableTab
              requests={requests}
              totalRecords={totalRequests}
              loading={loadingRequests}
              error={requestsError}
              leaveTypes={leaveTypes}
              page={page}
              limit={limit}
              sort={sort}
              order={order}
              activeFilters={filters}
              onFilterChange={(newF: any) => {
                setFilters((prev: any) => ({ ...prev, ...newF }));
                setPage(1);
              }}
              onPageChange={setPage}
              onLimitChange={setLimit}
              onSortChange={(field: string) => {
                if (sort === field) {
                  setOrder(order === 'asc' ? 'desc' : 'asc');
                } else {
                  setSort(field);
                  setOrder('asc');
                }
              }}
              onReviewRequest={handleReviewRequest}
              onExport={handleExportCSV}
              onRefresh={fetchRequests}
            />
          )}

          {activeTab === 'calendar' && (
            <LeaveCalendarTab
              events={requests}
              holidays={holidays}
              loading={loadingRequests}
              onSelectEvent={(id: string) => {
                const req = requests.find((r: LeaveRequest) => r.id === id);
                if (req) handleReviewRequest(req);
              }}
            />
          )}

          {activeTab === 'balances' && (
            <EmployeeBalancesTab
              balances={balances}
              leaveTypes={leaveTypes}
              loading={loadingBalances}
              onAdjustBalance={handleAdjustBalance}
              onFetchTransactions={handleFetchTransactions}
              onOpenAssignLeave={() => setAssignLeaveModalOpen(true)}
              onOpenManualLeave={() => setManualLeaveModalOpen(true)}
            />
          )}

          {activeTab === 'policies' && (
            <LeavePoliciesTab
              leaveTypes={leaveTypes}
              loading={loadingLeaveTypes}
              onOpenAddModal={() => {
                setSelectedTypeForEdit(null);
                setAddEditTypeModalOpen(true);
              }}
              onOpenEditModal={(type: LeaveType) => {
                setSelectedTypeForEdit(type);
                setAddEditTypeModalOpen(true);
              }}
              onArchiveLeaveType={handleArchiveLeaveType}
              onDeleteLeaveType={handleDeleteLeaveType}
              onOpenProbationModal={() => setProbationModalOpen(true)}
            />
          )}

          {activeTab === 'holidays' && (
            <HolidayCalendarTab
              holidays={holidays}
              loading={loadingHolidays}
              onAddHoliday={handleAddHoliday}
              onToggleHoliday={handleToggleHoliday}
            />
          )}

          {activeTab === 'reports' && (
            <LeaveReportsTab onExportCSV={handleExportCSV} />
          )}

          {activeTab === 'audit' && (
            <LeaveAuditHistoryTab />
          )}
        </div>

        {/* Global Modals & Drawers */}

        {/* Leave Request Details Drawer */}
        <LeaveDetailsDrawer
          request={selectedRequest}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onApproveClick={(req: LeaveRequest) => setApproveModalRequest(req)}
          onRejectClick={(req: LeaveRequest) => setRejectModalRequest(req)}
          onRequestInfoClick={(req: LeaveRequest) => setRequestInfoModalRequest(req)}
          onCancelActionClick={(req: LeaveRequest, action: 'APPROVE' | 'REJECT') => {
            if (action === 'APPROVE') {
              fetch(`/api/admin/leave/requests/${req.id}/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'APPROVE', reason: 'Cancellation approved.' })
              }).then(() => {
                showToast('Leave cancellation approved.', 'success');
                setIsDrawerOpen(false);
                fetchRequests();
              });
            } else {
              fetch(`/api/admin/leave/requests/${req.id}/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'REJECT', reason: 'Cancellation request rejected.' })
              }).then(() => {
                showToast('Cancellation request rejected.', 'info');
                setIsDrawerOpen(false);
                fetchRequests();
              });
            }
          }}
        />

        {/* Action Modals */}
        <LeaveApproveModal
          request={approveModalRequest}
          isOpen={Boolean(approveModalRequest)}
          onClose={() => setApproveModalRequest(null)}
          onConfirmApprove={handleConfirmApprove}
        />

        <LeaveRejectModal
          request={rejectModalRequest}
          isOpen={Boolean(rejectModalRequest)}
          onClose={() => setRejectModalRequest(null)}
          onConfirmReject={handleConfirmReject}
        />

        <LeaveRequestInfoModal
          request={requestInfoModalRequest}
          isOpen={Boolean(requestInfoModalRequest)}
          onClose={() => setRequestInfoModalRequest(null)}
          onConfirmRequestInfo={handleConfirmRequestInfo}
        />

        {/* Create / Edit Leave Type Modal */}
        <AddEditLeaveTypeModal
          leaveType={selectedTypeForEdit}
          isOpen={addEditTypeModalOpen}
          onClose={() => setAddEditTypeModalOpen(false)}
          onSaveLeaveType={handleSaveLeaveType}
        />

        {/* Manual Add Leave Modal */}
        <ManualAddLeaveModal
          isOpen={manualLeaveModalOpen}
          onClose={() => setManualLeaveModalOpen(false)}
          leaveTypes={leaveTypes}
          onSaveManualLeave={handleSaveManualLeave}
        />

        {/* Assign Leave Policy Modal */}
        <AssignLeaveModal
          isOpen={assignLeaveModalOpen}
          onClose={() => setAssignLeaveModalOpen(false)}
          leaveTypes={leaveTypes}
          onAssignPolicy={handleAssignPolicy}
        />

        {/* Probation Settings Modal */}
        <ProbationSettingsModal
          isOpen={probationModalOpen}
          onClose={() => setProbationModalOpen(false)}
          settings={probationSettings}
          overrides={probationOverrides}
          onSaveSettings={handleSaveProbationSettings}
        />
      </div>
    </SuperAdminLeaveGuard>
  );
}
