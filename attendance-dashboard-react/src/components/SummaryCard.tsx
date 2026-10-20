import React from 'react';

interface SummaryCardProps {
  title: string;
  count: number;
  subtitle?: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  accentColor: 'indigo' | 'emerald' | 'amber' | 'slate' | 'rose' | 'violet' | 'cyan' | 'purple';
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  count,
  subtitle,
  icon,
  active,
  onClick,
  accentColor
}) => {
  const accentClasses = {
    indigo:
      'text-indigo-400 border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/40',
    emerald:
      'text-emerald-400 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/40',
    amber:
      'text-amber-400 border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/40',
    slate:
      'text-slate-400 border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/35 hover:border-slate-600',
    rose:
      'text-rose-400 border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500/40',
    violet:
      'text-violet-400 border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/40',
    cyan:
      'text-cyan-400 border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-500/40',
    purple:
      'text-purple-400 border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500/40'
  };

  const activeClasses = active
    ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950 border-indigo-500 shadow-indigo-500/20 shadow-xl scale-[1.02]'
    : 'border-slate-800/90 shadow-md hover:scale-[1.01]';

  return (
    <button
      onClick={onClick}
      type="button"
      className={`w-full text-left p-4 sm:p-5 rounded-2xl border backdrop-blur-md transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${accentClasses[accentColor]} ${activeClasses}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          {title}
        </span>
        <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/90 shrink-0">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-3xl font-extrabold tracking-tight text-slate-100">
          {count}
        </div>
        {subtitle && (
          <div className="text-[11px] font-medium text-slate-400 mt-1 truncate">
            {subtitle}
          </div>
        )}
      </div>
    </button>
  );
};

export default SummaryCard;
