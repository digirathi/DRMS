'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Attendance, AuditLog, CorrectionRequest, HistoryFilterState, HistorySummaryData, RangeType, User, UserRole } from '../../../../types/attendance';
import { PermissionGuard } from '../../../../components/PermissionGuard';
import { DateRangeFilter } from '../../../../components/DateRangeFilter';
import { HistoryFilterToolbar } from '../../../../components/HistoryFilterToolbar';
import { HistorySummaryCards } from '../../../../components/HistorySummaryCards';
import { AttendanceHistoryTable } from '../../../../components/AttendanceHistoryTable';
import { ActionType } from '../../../../components/ActionMenuDropdownPortal';
import { AttendanceDetailsDrawer } from '../../../../components/AttendanceDetailsDrawer';
import { CorrectionRequestsModal } from '../../../../components/CorrectionRequestsModal';
import { ManualCorrectionModal } from '../../../../components/ManualCorrectionModal';
import { AuditHistoryDrawer } from '../../../../components/AuditHistoryDrawer';
import { getWeeklyRange } from '../../../../utils/attendanceValidation';
import { exportAttendanceToCSV } from '../../../../utils/exportAttendance';

export default function AttendanceHistoryPage() {
  // Developer Role Switcher state for testing authorization
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'USR-001',
    name: 'Demo Person 12',
    role: 'SUPER_ADMIN',
    email: 'demo01@example.test'
  });

  const isHRorAdmin = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'HR';

  // Date Range State
  const defaultWeekly = getWeeklyRange();
  const [rangeType, setRangeType] = useState<RangeType>('weekly');
  const [startDate, setStartDate] = useState<string>(defaultWeekly.startDate);
  const [endDate, setEndDate] = useState<string>(defaultWeekly.endDate);
  const [periodLabel, setPeriodLabel] = useState<string>(defaultWeekly.label);

  // Filters State
  const [filters, setFilters] = useState<HistoryFilterState>({
    rangeType: 'weekly',
    startDate: defaultWeekly.startDate,
    endDate: defaultWeekly.endDate,
    search: '',
    department: 'ALL',
    workMode: 'ALL',
    status: 'ALL',
    officeLocation: 'ALL',
    correctionStatus: 'ALL'
  });

  // Data State
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [records, setRecords] = useState<Attendance[]>([]);
  const [allRecords, setAllRecords] = useState<Attendance[]>([]);
  const [totalRecordsCount, setTotalRecordsCount] = useState<number>(0);
  const [summaryData, setSummaryData] = useState<HistorySummaryData>({
    totalRecords: 0,
    presentDays: 0,
    officeDays: 0,
    wfhDays: 0,
    leaveDays: 0,
    missingClockOuts: 0,
    incompleteRecords: 0,
    pendingCorrections: 0
  });

  // Summary Card Filter Selection State
  const [selectedSummaryCardFilter, setSelectedSummaryCardFilter] = useState<string | null>(null);

  // Pagination & Sorting State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(50);
  const [sortField, setSortField] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals & Drawers State
  const [selectedRecord, setSelectedRecord] = useState<Attendance | null>(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState<boolean>(false);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState<boolean>(false);
  const [isManualCorrectionModalOpen, setIsManualCorrectionModalOpen] = useState<boolean>(false);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState<boolean>(false);

  // Correction Requests State
  const [correctionRequests, setCorrectionRequests] = useState<CorrectionRequest[]>([]);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditLoading, setAuditLoading] = useState<boolean>(false);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, message });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch History Records from API
  const fetchHistoryData = useCallback(async () => {
    if (!isHRorAdmin) return;
    setLoading(true);
    setError('');
    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-user-mock': JSON.stringify(currentUser)
      };

      const params = new URLSearchParams({
        startDate,
        endDate,
        search: filters.search,
        department: filters.department,
        workMode: filters.workMode,
        status: selectedSummaryCardFilter || filters.status,
        officeLocation: filters.officeLocation,
        correctionStatus: filters.correctionStatus,
        page: String(currentPage),
        limit: String(rowsPerPage),
        sort: sortField,
        order: sortOrder
      });

      const [historyRes, crRes] = await Promise.all([
        fetch(`/api/admin/attendance/history?${params}`, { headers }).then((r) => r.json()),
        fetch(`/api/admin/attendance/correction-requests`, { headers }).then((r) => r.json())
      ]);

      if (historyRes.success === false) {
        throw new Error(historyRes.message || 'Failed to fetch attendance history.');
      }

      setRecords(historyRes.records || []);
      setAllRecords(historyRes.records || []);
      setTotalRecordsCount(historyRes.total || historyRes.records?.length || 0);
      if (historyRes.summary) {
        setSummaryData(historyRes.summary);
      }

      if (crRes.success && crRes.requests) {
        setCorrectionRequests(crRes.requests);
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred while fetching attendance history.');
    } finally {
      setLoading(false);
    }
  }, [currentUser, isHRorAdmin, startDate, endDate, filters, selectedSummaryCardFilter, currentPage, rowsPerPage, sortField, sortOrder]);

  useEffect(() => {
    fetchHistoryData();
  }, [fetchHistoryData]);

  // Handle Date Range Updates
  const handleRangeDatesChange = (start: string, end: string, label: string) => {
    setStartDate(start);
    setEndDate(end);
    setPeriodLabel(label);
    setFilters((prev) => ({ ...prev, startDate: start, endDate: end }));
    setCurrentPage(1);
  };

  // Handle Filter Toolbar Changes
  const handleFilterChange = (updated: Partial<HistoryFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    const defaultRange = getWeeklyRange();
    setRangeType('weekly');
    setStartDate(defaultRange.startDate);
    setEndDate(defaultRange.endDate);
    setPeriodLabel(defaultRange.label);
    setSelectedSummaryCardFilter(null);
    setFilters({
      rangeType: 'weekly',
      startDate: defaultRange.startDate,
      endDate: defaultRange.endDate,
      search: '',
      department: 'ALL',
      workMode: 'ALL',
      status: 'ALL',
      officeLocation: 'ALL',
      correctionStatus: 'ALL'
    });
    setCurrentPage(1);
  };

  // Summary Card Filter Click
  const handleSelectSummaryCardFilter = (key: string | null) => {
    setSelectedSummaryCardFilter(key);
    setCurrentPage(1);
  };

  // Sort Handler
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Fetch Audit History Logs
  const fetchAuditHistory = async (attendanceId: string) => {
    setAuditLoading(true);
    try {
      const res = await fetch(`/api/admin/attendance/${attendanceId}/audit-history`, {
        headers: { 'x-user-mock': JSON.stringify(currentUser) }
      });
      const data = await res.json();
      if (data.success && data.logs) {
        setAuditLogs(data.logs);
      }
    } catch {
      // Fallback
    } finally {
      setAuditLoading(false);
    }
  };

  // Action Menu Handler
  const handleSelectAction = (action: ActionType, record: Attendance) => {
    setSelectedRecord(record);
    switch (action) {
      case 'VIEW_DETAILS':
        setIsDetailsDrawerOpen(true);
        break;
      case 'EDIT_ATTENDANCE':
      case 'ADD_MISSING_CLOCK_IN':
      case 'ADD_MISSING_CLOCK_OUT':
      case 'CHANGE_WORK_MODE':
      case 'MARK_LEAVE':
      case 'REMOVE_LEAVE':
        setIsManualCorrectionModalOpen(true);
        break;
      case 'VIEW_CORRECTION_REQUEST':
        setIsCorrectionModalOpen(true);
        break;
      case 'VIEW_AUDIT_HISTORY':
        fetchAuditHistory(record.id);
        setIsAuditDrawerOpen(true);
        break;
      default:
        break;
    }
  };

  // Export Report Action
  const handleExportReport = () => {
    try {
      exportAttendanceToCSV(records, `attendance_history_${startDate}_to_${endDate}`);
      showToast('Attendance history report exported successfully!', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to export report.', 'error');
    }
  };

  // Save Manual Correction
  const handleSaveCorrection = async (
    attendanceId: string,
    actionType: string,
    changes: Record<string, any>,
    reason: string
  ) => {
    const res = await fetch(`/api/admin/attendance/${attendanceId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-user-mock': JSON.stringify(currentUser)
      },
      body: JSON.stringify({ action: actionType, changes, reason })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update attendance record.');
    }

    showToast('Manual attendance correction saved and audit logged successfully!', 'success');
    await fetchHistoryData();
  };

  // Correction Request Approvals Workflow
  const handleApproveCorrectionRequest = async (requestId: string, reviewNote: string) => {
    const res = await fetch(`/api/admin/attendance/correction-requests/${requestId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-mock': JSON.stringify(currentUser)
      },
      body: JSON.stringify({ reviewNote })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to approve request.');
    showToast('Correction request approved and attendance record updated.', 'success');
    await fetchHistoryData();
  };

  const handleRejectCorrectionRequest = async (requestId: string, rejectionReason: string) => {
    const res = await fetch(`/api/admin/attendance/correction-requests/${requestId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-mock': JSON.stringify(currentUser)
      },
      body: JSON.stringify({ rejectionReason })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to reject request.');
    showToast('Correction request rejected.', 'success');
    await fetchHistoryData();
  };

  const handleRequestMoreInfo = async (requestId: string, message: string) => {
    const res = await fetch(`/api/admin/attendance/correction-requests/${requestId}/request-information`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-mock': JSON.stringify(currentUser)
      },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to request information.');
    showToast('Message sent to employee for additional information.', 'success');
    await fetchHistoryData();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 flex flex-col gap-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-[100] px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
              : 'bg-red-950/90 border-red-500/50 text-red-300'
          }`}
        >
          <span>{toastMessage.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Dev Mock Role Switcher */}
      <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Developer Role Authorization Switcher:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { role: 'SUPER_ADMIN', name: 'Super Admin' },
            { role: 'HR', name: 'HR Admin' },
            { role: 'MANAGER', name: 'Manager (Prohibited)' },
            { role: 'TEAM_LEADER', name: 'Team Leader (Prohibited)' },
            { role: 'EMPLOYEE', name: 'Employee (Prohibited)' }
          ].map((item) => (
            <button
              key={item.role}
              onClick={() =>
                setCurrentUser((prev) => ({
                  ...prev,
                  role: item.role as UserRole,
                  name: `${item.name.split(' ')[0]} User`
                }))
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                currentUser.role === item.role
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <PermissionGuard user={currentUser}>
        {/* PAGE SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">ATTENDANCE RECORDS</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-medium">{periodLabel}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight mt-0.5">
              Attendance History
            </h1>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCorrectionModalOpen(true)}
              className="px-4 py-2.5 bg-amber-950/60 border border-amber-500/40 text-amber-300 hover:bg-amber-900/80 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <span>📋</span> Correction Requests ({correctionRequests.filter((r) => r.status === 'PENDING_REVIEW').length})
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRecord(records[0] || null);
                setIsManualCorrectionModalOpen(true);
              }}
              className="px-4 py-2.5 bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/80 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <span>✏️</span> Manual Correction
            </button>

            <button
              type="button"
              onClick={handleExportReport}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-md shadow-emerald-600/25 flex items-center gap-1.5"
            >
              <span>📥</span> Export Report
            </button>
          </div>
        </div>

        {/* Date Range Tabs & Controls */}
        <DateRangeFilter
          rangeType={rangeType}
          onRangeTypeChange={(t) => setRangeType(t)}
          startDate={startDate}
          endDate={endDate}
          onDatesChange={handleRangeDatesChange}
        />

        {/* Summary Cards */}
        <HistorySummaryCards
          summary={summaryData}
          selectedFilter={selectedSummaryCardFilter}
          onSelectFilter={handleSelectSummaryCardFilter}
        />

        {/* Filter Toolbar */}
        <HistoryFilterToolbar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          onRefresh={fetchHistoryData}
          filteredCount={records.length}
          totalCount={totalRecordsCount}
          loading={loading}
        />

        {/* Attendance History Table */}
        <AttendanceHistoryTable
          records={records}
          loading={loading}
          error={error}
          onViewDetails={(rec) => {
            setSelectedRecord(rec);
            setIsDetailsDrawerOpen(true);
          }}
          onSelectAction={handleSelectAction}
          onOpenCorrectionRequest={() => setIsCorrectionModalOpen(true)}
          isHRorAdmin={isHRorAdmin}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          currentPage={currentPage}
          totalPages={Math.ceil(totalRecordsCount / rowsPerPage) || 1}
          totalRecords={totalRecordsCount}
          rowsPerPage={rowsPerPage}
          onPageChange={(p) => setCurrentPage(p)}
          onRowsPerPageChange={(l) => {
            setRowsPerPage(l);
            setCurrentPage(1);
          }}
        />

        {/* Drawers and Modals */}
        <AttendanceDetailsDrawer
          isOpen={isDetailsDrawerOpen}
          onClose={() => setIsDetailsDrawerOpen(false)}
          record={selectedRecord}
          auditLogs={auditLogs}
          user={currentUser}
          onEdit={() => setIsManualCorrectionModalOpen(true)}
        />

        <CorrectionRequestsModal
          isOpen={isCorrectionModalOpen}
          onClose={() => setIsCorrectionModalOpen(false)}
          requests={correctionRequests}
          user={currentUser}
          onApprove={handleApproveCorrectionRequest}
          onReject={handleRejectCorrectionRequest}
          onRequestMoreInfo={handleRequestMoreInfo}
        />

        <ManualCorrectionModal
          isOpen={isManualCorrectionModalOpen}
          onClose={() => setIsManualCorrectionModalOpen(false)}
          allRecords={allRecords}
          initialRecord={selectedRecord}
          currentUser={currentUser}
          onSaveCorrection={handleSaveCorrection}
        />

        <AuditHistoryDrawer
          isOpen={isAuditDrawerOpen}
          onClose={() => setIsAuditDrawerOpen(false)}
          record={selectedRecord}
          logs={auditLogs}
          loading={auditLoading}
        />
      </PermissionGuard>
    </div>
  );
}
