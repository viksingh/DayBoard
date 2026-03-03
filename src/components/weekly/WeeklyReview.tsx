"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, BarChart3, Target, CheckCircle2, TrendingUp } from "lucide-react";
import { startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, format, isSameWeek, parseISO } from "date-fns";
import { useBoards } from "@/hooks/useBoards";
import { formatDateKey } from "@/lib/dates";
import { isDoneColumn } from "@/lib/board-helpers";

export default function WeeklyReview() {
  const { boards } = useBoards();
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const isCurrentWeek = isSameWeek(new Date(), weekStart, { weekStartsOn: 1 });

  const stats = useMemo(() => {
    const dayStats = days.map((day) => {
      const dateKey = formatDateKey(day);
      let planned = 0;
      let completed = 0;

      for (const board of boards) {
        const doneCols = new Set(
          board.columns.filter((c) => isDoneColumn(c.title)).map((c) => c.id)
        );

        for (const card of board.cards) {
          // Planned: cards with dueDate on this day
          if (card.dueDate === dateKey) {
            planned++;
          }
          // Completed: done-column cards updated on this day
          if (doneCols.has(card.columnId) && card.updatedAt.startsWith(dateKey)) {
            completed++;
          }
        }
      }

      return { date: day, dateKey, planned, completed };
    });

    const totalPlanned = dayStats.reduce((s, d) => s + d.planned, 0);
    const totalCompleted = dayStats.reduce((s, d) => s + d.completed, 0);
    const rate = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0;

    return { dayStats, totalPlanned, totalCompleted, rate };
  }, [boards, days]);

  const maxBar = Math.max(
    ...stats.dayStats.map((d) => Math.max(d.planned, d.completed)),
    1
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-blue-500" />
          <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Weekly Review</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-500 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-slate-700 transition-colors"
          >
            {isCurrentWeek ? "This week" : `${format(weekStart, "MMM d")} — ${format(weekEnd, "MMM d")}`}
          </button>
          <button
            onClick={() => setWeekOffset((o) => o + 1)}
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-500 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 text-center"
        >
          <Target className="w-5 h-5 text-blue-500 mx-auto mb-2" />
          <div className="text-3xl font-bold text-stone-800 dark:text-stone-100">{stats.totalPlanned}</div>
          <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">Planned</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card p-4 text-center"
        >
          <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto mb-2" />
          <div className="text-3xl font-bold text-stone-800 dark:text-stone-100">{stats.totalCompleted}</div>
          <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">Completed</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4 text-center"
        >
          <TrendingUp className="w-5 h-5 text-amber-500 mx-auto mb-2" />
          <div className="text-3xl font-bold text-stone-800 dark:text-stone-100">{stats.rate}%</div>
          <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">Completion rate</div>
        </motion.div>
      </div>

      {/* 7-day chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card p-5"
      >
        <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-200 mb-4">Daily Breakdown</h2>
        <div className="grid grid-cols-7 gap-3">
          {stats.dayStats.map((day) => {
            const isToday = formatDateKey(new Date()) === day.dateKey;
            return (
              <div key={day.dateKey} className="text-center">
                <div className="flex items-end justify-center gap-1 h-24 mb-2">
                  {/* Planned bar */}
                  <div
                    className="w-3 rounded-t bg-blue-200 dark:bg-blue-900/50 transition-all"
                    style={{ height: `${(day.planned / maxBar) * 100}%`, minHeight: day.planned > 0 ? 4 : 0 }}
                    title={`${day.planned} planned`}
                  />
                  {/* Completed bar */}
                  <div
                    className="w-3 rounded-t bg-green-400 dark:bg-green-500 transition-all"
                    style={{ height: `${(day.completed / maxBar) * 100}%`, minHeight: day.completed > 0 ? 4 : 0 }}
                    title={`${day.completed} completed`}
                  />
                </div>
                <p className={`text-xs font-medium ${isToday ? "text-blue-600 dark:text-blue-400" : "text-stone-500 dark:text-stone-400"}`}>
                  {format(day.date, "EEE")}
                </p>
                <p className={`text-[10px] ${isToday ? "text-blue-500" : "text-stone-400"}`}>
                  {format(day.date, "d")}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-xs text-stone-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded bg-blue-200 dark:bg-blue-900/50" /> Planned
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded bg-green-400 dark:bg-green-500" /> Completed
          </span>
        </div>
      </motion.div>
    </div>
  );
}
