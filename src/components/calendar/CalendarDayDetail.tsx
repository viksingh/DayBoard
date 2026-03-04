"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, FileText, ArrowRight } from "lucide-react";
import { useBoards } from "@/hooks/useBoards";
import { useDailyNotes } from "@/hooks/useDailyNotes";
import { formatDisplay } from "@/lib/dates";
import Badge from "@/components/shared/Badge";

interface CalendarDayDetailProps {
  date: string;
}

export default function CalendarDayDetail({ date }: CalendarDayDetailProps) {
  const { boards } = useBoards();
  const { getNote } = useDailyNotes();
  const note = getNote(date);

  const dueCards: { title: string; boardTitle: string; color: string; labels: { id: string; name: string; color: string }[] }[] = [];
  for (const board of boards) {
    for (const card of board.cards) {
      if (card.dueDate === date) {
        dueCards.push({
          title: card.title,
          boardTitle: board.title,
          color: board.color || "#4A7AB5",
          labels: card.labels,
        });
      }
    }
  }

  return (
    <motion.div
      key={date}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="card p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-blue-500" />
        <h2 className="font-semibold text-stone-800 dark:text-stone-100">
          {formatDisplay(date, "EEEE, MMM d")}
        </h2>
      </div>

      {dueCards.length > 0 ? (
        <div className="space-y-2 mb-4">
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Due Cards ({dueCards.length})
          </h3>
          {dueCards.map((card, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-700/50 rounded-xl"
            >
              <div
                className="w-2 h-8 rounded-full flex-shrink-0"
                style={{ backgroundColor: card.color }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-stone-700 dark:text-stone-200 truncate">
                  {card.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-stone-400">{card.boardTitle}</span>
                  {card.labels.slice(0, 2).map((l) => (
                    <Badge key={l.id} color={l.color}>
                      {l.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-stone-400 dark:text-stone-500 mb-4">No cards due on this day</p>
      )}

      {note?.content ? (
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <FileText className="w-3 h-3" /> Daily Note
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-300 line-clamp-3">{note.content}</p>
        </div>
      ) : null}

      <Link
        href={`/daily/${date}`}
        className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        Open daily notes <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
