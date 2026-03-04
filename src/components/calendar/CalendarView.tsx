"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { useBoards } from "@/hooks/useBoards";
import { useDailyNotes } from "@/hooks/useDailyNotes";
import { getCalendarDays, formatDateKey, isTodayKey } from "@/lib/dates";
import { cn } from "@/lib/cn";

interface CalendarViewProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

export default function CalendarView({ selectedDate, onSelectDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { boards } = useBoards();
  const { getNote } = useDailyNotes();

  const days = getCalendarDays(currentMonth);
  const currentMonthNum = currentMonth.getMonth();

  // Collect cards with due dates
  const cardsByDate = new Map<string, { title: string; color: string }[]>();
  for (const board of boards) {
    for (const card of board.cards) {
      if (card.dueDate) {
        const existing = cardsByDate.get(card.dueDate) || [];
        existing.push({ title: card.title, color: board.color || "#4A7AB5" });
        cardsByDate.set(card.dueDate, existing);
      }
    }
  }

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-400 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-400 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-stone-400 dark:text-stone-500 py-2"
          >
            {day}
          </div>
        ))}

        {days.map((date) => {
          const dateKey = formatDateKey(date);
          const isCurrentMonth = date.getMonth() === currentMonthNum;
          const isToday = isTodayKey(dateKey);
          const isSelected = selectedDate === dateKey;
          const cards = cardsByDate.get(dateKey) || [];
          const hasNote = !!getNote(dateKey);

          return (
            <button
              key={dateKey}
              onClick={() => onSelectDate(dateKey)}
              className={cn(
                "relative p-1 min-h-[72px] text-left rounded-xl transition-all",
                !isCurrentMonth && "opacity-40",
                isSelected
                  ? "bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-300 dark:ring-blue-600"
                  : "hover:bg-stone-50 dark:hover:bg-stone-700/50"
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium block mb-0.5",
                  isToday
                    ? "text-blue-600 dark:text-blue-400 font-bold"
                    : "text-stone-600 dark:text-stone-300"
                )}
              >
                {format(date, "d")}
              </span>

              <div className="space-y-0.5">
                {cards.slice(0, 2).map((card, i) => (
                  <div
                    key={i}
                    className="text-[10px] leading-tight truncate px-1 py-0.5 rounded"
                    style={{ backgroundColor: card.color + "20", color: card.color }}
                  >
                    {card.title}
                  </div>
                ))}
                {cards.length > 2 && (
                  <span className="text-[10px] text-stone-400">+{cards.length - 2} more</span>
                )}
              </div>

              {hasNote && (
                <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
