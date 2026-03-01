"use client";

import { motion } from "framer-motion";
import { Link as LinkIcon, X, CheckCircle2 } from "lucide-react";
import { useDailyNotes } from "@/hooks/useDailyNotes";
import { useBoards } from "@/hooks/useBoards";
import { Card } from "@/types/board";
import Badge from "@/components/shared/Badge";

interface LinkedTasksProps {
  date: string;
}

export default function LinkedTasks({ date }: LinkedTasksProps) {
  const { getNote, unlinkCard } = useDailyNotes();
  const { boards } = useBoards();
  const note = getNote(date);
  const linkedIds = note?.linkedCardIds || [];

  if (linkedIds.length === 0) return null;

  // Resolve cards from all boards
  const linkedCards: (Card & { boardTitle: string; columnTitle: string })[] = [];
  for (const board of boards) {
    for (const card of board.cards) {
      if (linkedIds.includes(card.id)) {
        const col = board.columns.find((c) => c.id === card.columnId);
        linkedCards.push({
          ...card,
          boardTitle: board.title,
          columnTitle: col?.title || "",
        });
      }
    }
  }

  if (linkedCards.length === 0) return null;

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <LinkIcon className="w-4 h-4 text-blue-500" />
        <h3 className="text-sm font-semibold text-stone-700">Linked Tasks</h3>
        <span className="text-xs text-stone-400">({linkedCards.length})</span>
      </div>

      <div className="space-y-2">
        {linkedCards.map((card) => {
          const isDone =
            card.columnTitle.toLowerCase() === "done" ||
            card.columnTitle.toLowerCase() === "completed";

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-3 bg-stone-50 rounded-xl group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <CheckCircle2
                  className={`w-4 h-4 flex-shrink-0 ${
                    isDone ? "text-green-500" : "text-stone-300"
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-700 truncate">{card.title}</p>
                  <p className="text-xs text-stone-400">
                    {card.boardTitle} &middot; {card.columnTitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {card.labels.slice(0, 2).map((l) => (
                  <Badge key={l.id} color={l.color}>
                    {l.name}
                  </Badge>
                ))}
                <button
                  onClick={() => unlinkCard(date, card.id)}
                  className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-stone-200 text-stone-400 transition-all"
                  title="Unlink"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
