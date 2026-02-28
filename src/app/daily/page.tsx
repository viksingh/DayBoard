"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { todayKey } from "@/lib/dates";

export default function DailyRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/daily/${todayKey()}`);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-sm text-stone-400">Redirecting to today...</p>
    </div>
  );
}
