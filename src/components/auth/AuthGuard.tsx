"use client";

import { useSession } from "next-auth/react";
import SignInPage from "./SignInPage";
import Skeleton from "@/components/shared/Skeleton";

function LoadingSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-cream dark:bg-slate-900">
      {/* Sidebar skeleton */}
      <div className="w-64 h-screen bg-stone-50 dark:bg-slate-900 border-r border-stone-200 dark:border-slate-700 flex flex-col flex-shrink-0">
        <div className="flex items-center gap-3 px-4 h-14 border-b border-stone-200 dark:border-slate-700">
          <Skeleton className="w-8 h-8 rounded-xl" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="py-3 px-2 space-y-2">
          <Skeleton className="h-9 w-full rounded-xl" />
          <Skeleton className="h-9 w-full rounded-xl" />
          <div className="mt-6 px-3">
            <Skeleton className="h-3 w-16 mb-3" />
          </div>
          <Skeleton className="h-9 w-full rounded-xl" />
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-14 border-b border-stone-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 flex items-center px-6">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex-1 p-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card overflow-hidden">
                  <Skeleton className="h-2 w-full rounded-none" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoadingSkeleton />;
  }

  if (!session) {
    return <SignInPage />;
  }

  return <>{children}</>;
}
