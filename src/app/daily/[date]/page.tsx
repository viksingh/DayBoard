"use client";

import { useParams, useRouter } from "next/navigation";
import { isValidDateKey } from "@/lib/dates";
import DailyHeader from "@/components/daily/DailyHeader";
import DailyEditor from "@/components/daily/DailyEditor";
import LinkedTasks from "@/components/daily/LinkedTasks";
import EmptyState from "@/components/shared/EmptyState";
import { CalendarDays } from "lucide-react";

export default function DailyDatePage() {
  const params = useParams();
  const router = useRouter();
  const date = params.date as string;

  if (!isValidDateKey(date)) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="Invalid date"
        description="The date in the URL isn't valid."
        action={{ label: "Go to today", onClick: () => router.push("/daily") }}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <DailyHeader date={date} />
      <div className="space-y-4">
        <DailyEditor date={date} />
        <LinkedTasks date={date} />
      </div>
    </div>
  );
}
