import React, { useState } from 'react';
import { Holiday } from '../../types/leave';

interface HolidayCalendarTabProps {
  holidays: Holiday[];
  loading: boolean;
  onAddHoliday: (data: Partial<Holiday>) => Promise<void>;
  onToggleHoliday: (holidayId: string, isActive: boolean) => Promise<void>;
}

export const HolidayCalendarTab: React.FC<HolidayCalendarTabProps> = ({
  holidays,
  loading,
  onAddHoliday,
  onToggleHoliday
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [recurringAnnually, setRecurringAnnually] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) return;

    setIsSubmitting(true);
    try {
      await onAddHoliday({
        name: name.trim(),
        date,
        dayType: 'FULL_DAY',
        description: description.trim() || undefined,
        recurringAnnually,
        isActive: true
      });
      setName('');
      setDate('');
      setDescription('');
      setIsAddModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl shadow-xl flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-100">Holiday Calendar Configuration</h3>
          <p className="text-xs text-slate-400">
            Super Admin can add national, festival, or company holidays for 2026.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-950/50 flex items-center gap-2 transition"
        >
          <span>+</span> Add Holiday
        </button>
      </div>

      {/* Holiday Table */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-2xl table-wrap">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-950/90 text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-4 py-3.5">Holiday Name</th>
              <th className="px-3 py-3.5">Date</th>
              <th className="px-3 py-3.5">Description</th>
              <th className="px-3 py-3.5">Recurring Annually</th>
              <th className="px-3 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/70 text-slate-200">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="p-4"><div className="h-4 bg-slate-800 rounded w-32" /></td>
                  <td className="p-3"><div className="h-4 bg-slate-800 rounded w-20" /></td>
                  <td className="p-3"><div className="h-4 bg-slate-800 rounded w-48" /></td>
                  <td className="p-3"><div className="h-4 bg-slate-800 rounded w-16" /></td>
                  <td className="p-3"><div className="h-4 bg-slate-800 rounded w-16" /></td>
                  <td className="p-4"><div className="h-6 bg-slate-800 rounded w-14 ml-auto" /></td>
                </tr>
              ))
            ) : holidays.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  No holidays configured yet. Click "Add Holiday" to create one.
                </td>
              </tr>
            ) : (
              holidays.map((hol) => (
                <tr key={hol.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-semibold text-slate-100">{hol.name}</td>
                  <td className="px-3 py-3 font-mono text-teal-400 font-bold">{hol.date}</td>
                  <td className="px-3 py-3 text-slate-300">{hol.description || '—'}</td>
                  <td className="px-3 py-3">
                    <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 font-mono">
                      {hol.recurringAnnually ? 'Yes (Annual)' : 'One-time'}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        hol.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}
                    >
                      {hol.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onToggleHoliday(hol.id, !hol.isActive)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
                    >
                      {hol.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Holiday Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100 animate-fadeIn">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold">Add Organization Holiday</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Holiday Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Independence Day"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Official details or festival description..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>

              <label className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={recurringAnnually}
                  onChange={(e) => setRecurringAnnually(e.target.checked)}
                  className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Recurring Annually on the same date</span>
              </label>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-950/50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Holiday'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayCalendarTab;
