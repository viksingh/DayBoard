"use client";

import { useState } from "react";
import CalendarView from "@/components/calendar/CalendarView";
import CalendarDayDetail from "@/components/calendar/CalendarDayDetail";
import { todayKey } from "@/lib/dates";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">Calendar</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            See your cards on a monthly view
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarView
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>
        <div>
          <CalendarDayDetail date={selectedDate || todayKey()} />
        </div>
      </div>
    </div>
  );
}
