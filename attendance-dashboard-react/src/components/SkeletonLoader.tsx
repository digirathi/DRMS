import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="w-full animate-pulse" aria-hidden="true">
      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl h-[120px] flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className="h-3 w-20 bg-slate-800 rounded"></div>
              <div className="h-8 w-8 bg-slate-800 rounded-xl"></div>
            </div>
            <div className="h-8 w-12 bg-slate-800 rounded mt-3"></div>
          </div>
        ))}
      </div>

      {/* Filter Section Skeleton */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 mb-6 h-[86px] hidden lg:block">
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="h-3 w-16 bg-slate-800 rounded"></div>
              <div className="h-9 bg-slate-800 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 overflow-hidden">
        <div className="flex justify-between items-center mb-4 border-b border-slate-800/80 pb-4">
          <div className="h-6 w-40 bg-slate-800 rounded"></div>
          <div className="h-8 w-24 bg-slate-800 rounded-xl"></div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-slate-800/40 pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-slate-800 rounded"></div>
                  <div className="h-3 w-20 bg-slate-800 rounded"></div>
                </div>
              </div>
              <div className="h-4 w-24 bg-slate-800 rounded"></div>
              <div className="h-4 w-16 bg-slate-800 rounded"></div>
              <div className="h-6 w-16 bg-slate-800 rounded-full"></div>
              <div className="h-8 w-14 bg-slate-800 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SkeletonLoader;
