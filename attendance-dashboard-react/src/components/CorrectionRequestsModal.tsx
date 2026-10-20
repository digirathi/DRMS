import React, { useState } from 'react';
import { CorrectionRequest, CorrectionStatus, User } from '../types/attendance';
import { formatDateDisplay } from '../utils/attendanceValidation';
import { ReviewCorrectionRequestModal } from './ReviewCorrectionRequestModal';

interface CorrectionRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: CorrectionRequest[];
  user: User;
  onApprove: (requestId: string, reviewNote: string) => Promise<void>;
  onReject: (requestId: string, rejectionReason: string) => Promise<void>;
  onRequestMoreInfo: (requestId: string, message: string) => Promise<void>;
}

type TabType = 'PENDING_REVIEW' | 'MORE_INFO_REQUIRED' | 'APPROVED' | 'REJECTED' | 'ALL';

export const CorrectionRequestsModal: React.FC<CorrectionRequestsModalProps> = ({
  isOpen,
  onClose,
  requests,
  user,
  onApprove,
  onReject,
  onRequestMoreInfo
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('PENDING_REVIEW');
  const [selectedRequest, setSelectedRequest] = useState<CorrectionRequest | null>(null);

  if (!isOpen) return null;

  const filteredRequests = requests.filter((req) => {
    if (activeTab === 'ALL') return true;
    return req.status === activeTab;
  });

  const getStatusBadge = (status: CorrectionStatus) => {
    const map: Record<CorrectionStatus, { bg: string; text: string; label: string }> = {
      NO_REQUEST: { bg: 'bg-slate-800', text: 'text-slate-400', label: 'No Request' },
      PENDING_REVIEW: { bg: 'bg-amber-500/15 text-amber-400 border-amber-500/20', text: 'text-amber-400', label: 'Pending Review' },
      MORE_INFO_REQUIRED: { bg: 'bg-purple-500/15 text-purple-300 border-purple-500/20', text: 'text-purple-300', label: 'More Info Required' },
      APPROVED: { bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', text: 'text-emerald-400', label: 'Approved' },
      REJECTED: { bg: 'bg-red-500/15 text-red-400 border-red-500/20', text: 'text-red-400', label: 'Rejected' },
      CANCELLED: { bg: 'bg-slate-800 text-slate-400', text: 'text-slate-400', label: 'Cancelled' },
      EXPIRED: { bg: 'bg-slate-800 text-slate-400', text: 'text-slate-400', label: 'Expired' }
    };
    const style = map[status] || map.NO_REQUEST;
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${style.bg} whitespace-nowrap`}>
        {style.label}
      </span>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
        <div className="absolute inset-0 overflow-hidden">
          <div onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-5xl transform bg-[#090d21] border-l border-slate-800 text-slate-100 shadow-2xl transition-all duration-300 flex flex-col justify-between">
              
              {/* Header */}
              <div className="border-b border-slate-800 p-6 flex justify-between items-center bg-slate-950/70 sticky top-0 z-10 backdrop-blur-md">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <h2 className="text-xl font-bold text-slate-100">
                      Attendance Correction Requests
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Review and approve employee submitted attendance modification requests.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-xl p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {/* Tabs */}
                <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                  {[
                    { key: 'PENDING_REVIEW', label: 'Pending Review' },
                    { key: 'MORE_INFO_REQUIRED', label: 'More Information Required' },
                    { key: 'APPROVED', label: 'Approved' },
                    { key: 'REJECTED', label: 'Rejected' },
                    { key: 'ALL', label: 'All Requests' }
                  ].map((tab) => {
                    const count = requests.filter((r) => tab.key === 'ALL' || r.status === tab.key).length;
                    const isActive = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key as TabType)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${isActive ? 'bg-indigo-700 text-white' : 'bg-slate-900 text-slate-400'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Correction Requests Table */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-950 border-b border-slate-800">
                        <tr>
                          <th className="px-3.5 py-3 font-bold text-slate-300 uppercase tracking-wider">Request ID</th>
                          <th className="px-3.5 py-3 font-bold text-slate-300 uppercase tracking-wider">Employee</th>
                          <th className="px-3.5 py-3 font-bold text-slate-300 uppercase tracking-wider">Date</th>
                          <th className="px-3.5 py-3 font-bold text-slate-300 uppercase tracking-wider">Correction Type</th>
                          <th className="px-3.5 py-3 font-bold text-slate-300 uppercase tracking-wider">Requested Value</th>
                          <th className="px-3.5 py-3 font-bold text-slate-300 uppercase tracking-wider">Submitted At</th>
                          <th className="px-3.5 py-3 font-bold text-slate-300 uppercase tracking-wider">Status</th>
                          <th className="px-3.5 py-3 font-bold text-slate-300 uppercase tracking-wider">Reviewer</th>
                          <th className="px-3.5 py-3 text-right font-bold text-slate-300 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredRequests.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="px-4 py-12 text-center text-slate-500">
                              No requests found in this tab.
                            </td>
                          </tr>
                        ) : (
                          filteredRequests.map((req) => (
                            <tr key={req.id} className="hover:bg-slate-900/80 transition-colors">
                              <td className="px-3.5 py-3 font-mono font-bold text-indigo-300">{req.id}</td>
                              <td className="px-3.5 py-3 font-semibold text-slate-100 whitespace-nowrap">
                                <div>{req.employeeName}</div>
                                <div className="text-[10px] text-slate-500 font-mono">{req.employeeId}</div>
                              </td>
                              <td className="px-3.5 py-3 whitespace-nowrap text-slate-200 font-medium">{formatDateDisplay(req.attendanceDate)}</td>
                              <td className="px-3.5 py-3 whitespace-nowrap font-medium text-amber-300">{req.correctionType.replace(/_/g, ' ')}</td>
                              <td className="px-3.5 py-3 whitespace-nowrap font-mono text-emerald-400">{req.requestedValue}</td>
                              <td className="px-3.5 py-3 whitespace-nowrap text-slate-400 font-mono text-[11px]">{new Date(req.submittedAt).toLocaleDateString()}</td>
                              <td className="px-3.5 py-3 whitespace-nowrap">{getStatusBadge(req.status)}</td>
                              <td className="px-3.5 py-3 whitespace-nowrap text-slate-400">{req.reviewerName || '—'}</td>
                              <td className="px-3.5 py-3 text-right whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => setSelectedRequest(req)}
                                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-[11px] transition-all cursor-pointer shadow-sm"
                                >
                                  Review
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-800 p-4 bg-slate-950/80 flex justify-end sticky bottom-0 backdrop-blur-md">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Close Drawer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <ReviewCorrectionRequestModal
          isOpen={Boolean(selectedRequest)}
          onClose={() => setSelectedRequest(null)}
          request={selectedRequest}
          reviewer={user}
          onApprove={onApprove}
          onReject={onReject}
          onRequestMoreInfo={onRequestMoreInfo}
        />
      )}
    </>
  );
};
