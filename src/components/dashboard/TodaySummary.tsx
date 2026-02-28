"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { useBoards } from "@/hooks/useBoards";
import { useDailyNotes } from "@/hooks/useDailyNotes";
import { todayKey, formatDisplay } from "@/lib/dates";
import { MOOD_OPTIONS } from "@/types/daily";

export default function TodaySummary() {
  const { boards } = useBoards();
  const { getNote } = useDailyNotes();
  const today = todayKey();
  const note = getNote(today);

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
          <CalendarDays className="w-5 h-5 text-amber-500" />
          <h2 className="font-semibold text-stone-800">Today</h2>
        </div>
        <span className="text-sm text-stone-500">{formatDisplay(today, "EEEE, MMM d")}</span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 rounded-xl bg-amber-50/50">
          <Clock className="w-4 h-4 text-amber-500 mx-auto mb-1" />
          <div className="text-2xl font-bold text-stone-800">{dueTodayCards.length}</div>
          <div className="text-xs text-stone-500">Due today</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-green-50/50">
          <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto mb-1" />
          <div className="text-2xl font-bold text-stone-800">{totalDone}</div>
          <div className="text-xs text-stone-500">Completed</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-stone-50">
          <div className="text-2xl mb-1">{moodEntry?.emoji || "\u{2014}"}</div>
          <div className="text-xs text-stone-500">{moodEntry?.label || "No mood"}</div>
        </div>
      </div>

      {note?.content ? (
        <p className="text-sm text-stone-600 line-clamp-2 mb-3">{note.content}</p>
      ) : (
        <p className="text-sm text-stone-400 italic mb-3">No notes yet for today</p>
      )}

      <Link
        href={`/daily/${today}`}
        className="flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
      >
        Open daily notes <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
