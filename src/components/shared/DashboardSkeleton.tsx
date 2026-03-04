"use client";

import Skeleton from "./Skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card overflow-hidden">
              <Skeleton className="h-2 w-full rounded-none" />
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="w-9 h-9 rounded-xl" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <Skeleton className="h-1.5 flex-1 rounded-full" />
                  <Skeleton className="h-1.5 flex-1 rounded-full" />
                  <Skeleton className="h-1.5 flex-1 rounded-full" />
                </div>
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="card p-5 space-y-4">
            <Skeleton className="h-5 w-24" />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
