"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { getWeekDays, isTodayKey } from "@/lib/dates";
import { useDailyContext } from "@/context/DailyContext";
import { cn } from "@/lib/cn";

interface DailyCalendarStripProps {
  currentDate: string;
}

export default function DailyCalendarStrip({ currentDate }: DailyCalendarStripProps) {
  const weekDays = getWeekDays(currentDate);
  const { notes } = useDailyContext();

  return (
    <div className="flex items-center gap-1.5">
      {weekDays.map((day) => {
        const isActive = day === currentDate;
        const isToday = isTodayKey(day);
        const hasNote = notes[day] && (notes[day].content || notes[day].mood);
        const d = parseISO(day);

        return (
          <Link key={day} href={`/daily/${day}`}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={cn(
                "flex flex-col items-center px-3 py-2 rounded-xl transition-all min-w-[48px]",
                isActive
                  ? "bg-amber-100 text-amber-800 shadow-warm"
                  : isToday
                  ? "bg-amber-50 text-amber-600"
                  : "hover:bg-stone-100 text-stone-600"
              )}
            >
              <span className="text-[10px] font-medium uppercase">
                {format(d, "EEE")}
              </span>
              <span className={cn("text-lg font-bold", isActive && "text-amber-700")}>
                {format(d, "d")}
              </span>
              {hasNote && (
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5" />
              )}
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}
