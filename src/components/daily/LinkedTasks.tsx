"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Link as LinkIcon, X, CheckCircle2 } from "lucide-react";
import { useDailyNotes } from "@/hooks/useDailyNotes";
import { useBoards } from "@/hooks/useBoards";
import { Card } from "@/types/board";
import { findDoneColumn, isDoneColumn } from "@/lib/board-helpers";
import Badge from "@/components/shared/Badge";

interface LinkedTasksProps {
  date: string;
}

export default function LinkedTasks({ date }: LinkedTasksProps) {
  const { getNote, unlinkCard } = useDailyNotes();
  const { boards, moveCard } = useBoards();
  const note = getNote(date);
  const linkedIds = note?.linkedCardIds || [];
  const [justDone, setJustDone] = useState<Set<string>>(new Set());

  if (linkedIds.length === 0) return null;

  // Resolve cards from all boards
  const linkedCards: (Card & { boardId: string; boardTitle: string; columnTitle: string; doneColumnId: string | null })[] = [];
  for (const board of boards) {
    const doneCol = findDoneColumn(board);
    for (const card of board.cards) {
      if (linkedIds.includes(card.id)) {
        const col = board.columns.find((c) => c.id === card.columnId);
        linkedCards.push({
          ...card,
          boardId: board.id,
          boardTitle: board.title,
          columnTitle: col?.title || "",
          doneColumnId: doneCol?.id || null,
        });
      }
    }
  }

  if (linkedCards.length === 0) return null;

  const handleQuickDone = (card: typeof linkedCards[0]) => {
    if (!card.doneColumnId) return;
    setJustDone((prev) => new Set(prev).add(card.id));
    moveCard(card.boardId, card.id, card.doneColumnId, 9999);
  };

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <LinkIcon className="w-4 h-4 text-blue-500" />
        <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-200">Linked Tasks</h3>
        <span className="text-xs text-stone-400">({linkedCards.length})</span>
      </div>

      <div className="space-y-2">
        {linkedCards.map((card) => {
          const done =
            isDoneColumn(card.columnTitle) || justDone.has(card.id);

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-3 bg-stone-50 dark:bg-slate-700/50 rounded-xl group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => !done && handleQuickDone(card)}
                  disabled={done}
                  className="flex-shrink-0 transition-colors"
                  title={done ? "Done" : "Mark as done"}
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      done
                        ? "text-green-500"
                        : "text-stone-300 dark:text-stone-500 hover:text-green-400"
                    }`}
                  />
                </button>
                <div className="min-w-0">
                  <p className={`text-sm font-medium text-stone-700 dark:text-stone-200 truncate ${done ? "line-through text-stone-400 dark:text-stone-500" : ""}`}>{card.title}</p>
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
                  className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-stone-200 dark:hover:bg-slate-600 text-stone-400 transition-all"
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
