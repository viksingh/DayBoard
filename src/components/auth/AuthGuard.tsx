"use client";

import { useSession } from "next-auth/react";
import SignInPage from "./SignInPage";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-cream">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 animate-pulse" />
          <p className="text-sm text-stone-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <SignInPage />;
  }

  return <>{children}</>;
}
