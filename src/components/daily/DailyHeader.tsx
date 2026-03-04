"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDisplay, getAdjacentDate, isTodayKey, todayKey } from "@/lib/dates";
import { useDailyNotes } from "@/hooks/useDailyNotes";
import MoodPicker from "./MoodPicker";
import DailyCalendarStrip from "./DailyCalendarStrip";

interface DailyHeaderProps {
  date: string;
}

export default function DailyHeader({ date }: DailyHeaderProps) {
  const { getNote, setMood } = useDailyNotes();
  const note = getNote(date);
  const prevDate = getAdjacentDate(date, "prev");
  const nextDate = getAdjacentDate(date, "next");
  const isToday = isTodayKey(date);

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/daily/${prevDate}`}
            className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-400 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">
              {isToday ? "Today" : formatDisplay(date, "EEEE")}
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400">{formatDisplay(date, "MMMM d, yyyy")}</p>
          </div>
          <Link
            href={`/daily/${nextDate}`}
            className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-400 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
          {!isToday && (
            <Link
              href={`/daily/${todayKey()}`}
              className="btn-ghost text-xs ml-2"
            >
              Go to today
            </Link>
          )}
        </div>

        <MoodPicker value={note?.mood ?? null} onChange={(mood) => setMood(date, mood)} />
      </div>

      <DailyCalendarStrip currentDate={date} />
    </div>
  );
}
