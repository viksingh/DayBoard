"use client";

import Skeleton from "./Skeleton";

export default function DailySkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-xl" />
          <div>
            <Skeleton className="h-6 w-32 mb-1" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="w-9 h-9 rounded-xl" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-10 h-10 rounded-xl" />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Skeleton key={i} className="w-12 h-16 rounded-xl" />
        ))}
      </div>

      <div className="card p-5">
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-3/4 mb-3" />
        <Skeleton className="h-4 w-5/6 mb-3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
