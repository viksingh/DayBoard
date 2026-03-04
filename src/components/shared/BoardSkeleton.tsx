"use client";

import Skeleton from "./Skeleton";

export default function BoardSkeleton() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-3 h-8 rounded-full" />
        <div>
          <Skeleton className="h-6 w-40 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {[1, 2, 3].map((col) => (
          <div key={col} className="flex-shrink-0 w-72">
            <div className="bg-stone-50/80 dark:bg-stone-800/50 rounded-2xl p-3 space-y-2">
              <div className="flex items-center gap-2 mb-3 px-1">
                <Skeleton className="w-2.5 h-2.5 rounded-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-6 rounded-md" />
              </div>
              {Array.from({ length: col === 1 ? 3 : col === 2 ? 2 : 1 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-stone-700 rounded-xl p-3 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
