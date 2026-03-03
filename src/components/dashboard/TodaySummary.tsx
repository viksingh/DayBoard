"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, CheckCircle2, Clock, ArrowRight, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useBoards } from "@/hooks/useBoards";
import { useDailyNotes } from "@/hooks/useDailyNotes";
import { todayKey, formatDisplay } from "@/lib/dates";
import { getOverdueCards } from "@/lib/due-tasks";
import { MOOD_OPTIONS } from "@/types/daily";

export default function TodaySummary() {
  const { boards } = useBoards();
  const { getNote } = useDailyNotes();
  const today = todayKey();
  const note = getNote(today);
  const [showOverdue, setShowOverdue] = useState(false);

  // Count cards due today across all boards
  const dueTodayCards = boards.flatMap((b) =>
    b.cards.filter((c) => c.dueDate === today)
  );

  // Count all cards in "done" columns across all boards
  const totalDone = boards.reduce((sum, b) => {
    const doneCols = b.columns.filter(
      (c) => c.title.toLowerCase() === "done" || c.title.toLowerCase() === "completed"
    );
    const doneIds = new Set(doneCols.map((c) => c.id));
    return sum + b.cards.filter((c) => doneIds.has(c.columnId)).length;
  }, 0);

  const overdueCards = getOverdueCards(boards, today);
  const moodEntry = note?.mood ? MOOD_OPTIONS.find((m) => m.value === note.mood) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-blue-500" />
          <h2 className="font-semibold text-stone-800 dark:text-stone-100">Today</h2>
        </div>
        <span className="text-sm text-stone-500 dark:text-stone-400">{formatDisplay(today, "EEEE, MMM d")}</span>
      </div>

      <div className={`grid gap-4 mb-4 ${overdueCards.length > 0 ? "grid-cols-4" : "grid-cols-3"}`}>
        <div className="text-center p-3 rounded-xl bg-blue-50/50 dark:bg-blue-900/20">
          <Clock className="w-4 h-4 text-blue-500 mx-auto mb-1" />
          <div className="text-2xl font-bold text-stone-800 dark:text-stone-100">{dueTodayCards.length}</div>
          <div className="text-xs text-stone-500 dark:text-stone-400">Due today</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-green-50/50 dark:bg-green-900/20">
          <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto mb-1" />
          <div className="text-2xl font-bold text-stone-800 dark:text-stone-100">{totalDone}</div>
          <div className="text-xs text-stone-500 dark:text-stone-400">Completed</div>
        </div>
        {overdueCards.length > 0 && (
          <button
            onClick={() => setShowOverdue(!showOverdue)}
            className="text-center p-3 rounded-xl bg-red-50/50 dark:bg-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            <AlertCircle className="w-4 h-4 text-red-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{overdueCards.length}</div>
            <div className="text-xs text-red-500 dark:text-red-400 flex items-center justify-center gap-0.5">
              Overdue
              {showOverdue ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </div>
          </button>
        )}
        <div className="text-center p-3 rounded-xl bg-stone-50 dark:bg-slate-700/50">
          <div className="text-2xl mb-1">{moodEntry?.emoji || "\u{2014}"}</div>
          <div className="text-xs text-stone-500 dark:text-stone-400">{moodEntry?.label || "No mood"}</div>
        </div>
      </div>

      <AnimatePresence>
        {showOverdue && overdueCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="space-y-1.5 p-3 bg-red-50/50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
              {overdueCards.slice(0, 5).map((card) => (
                <div key={card.id} className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                  <span className="text-stone-700 dark:text-stone-200 truncate flex-1">{card.title}</span>
                  <span className="text-xs text-stone-400 flex-shrink-0">{card.boardTitle}</span>
                </div>
              ))}
              {overdueCards.length > 5 && (
                <p className="text-xs text-red-400 mt-1">+{overdueCards.length - 5} more</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {note?.content ? (
        <p className="text-sm text-stone-600 dark:text-stone-300 line-clamp-2 mb-3">{note.content}</p>
      ) : (
        <p className="text-sm text-stone-400 dark:text-stone-500 italic mb-3">No notes yet for today</p>
      )}

      <Link
        href={`/daily/${today}`}
        className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
      >
        Open daily notes <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
