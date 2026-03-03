"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarClock, CheckCircle2, Download } from "lucide-react";
import { useBoards } from "@/hooks/useBoards";
import { getDueCards, groupDueCardsByBoard } from "@/lib/due-tasks";
import { exportDailyTodo } from "@/lib/export-todo";

interface DueTasksProps {
  date: string;
}

export default function DueTasks({ date }: DueTasksProps) {
  const { boards, moveCard } = useBoards();
  const dueCards = getDueCards(boards, date);
  const [justDone, setJustDone] = useState<Set<string>>(new Set());

  if (dueCards.length === 0) return null;

  const groups = groupDueCardsByBoard(dueCards);

  const handleQuickDone = (cardId: string, boardId: string, doneColumnId: string | null) => {
    if (!doneColumnId) return;
    setJustDone((prev) => new Set(prev).add(cardId));
    moveCard(boardId, cardId, doneColumnId, 9999);
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-200">Due Tasks</h3>
          <span className="text-xs text-stone-400">({dueCards.length})</span>
        </div>
        <button
          onClick={() => exportDailyTodo(boards, date)}
          className="btn-ghost p-1.5 rounded-lg"
          title="Export as checklist"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(groups).map(([boardName, cards]) => (
          <div key={boardName}>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cards[0].boardColor }}
              />
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400">{boardName}</span>
            </div>
            <div className="space-y-2">
              {cards.map((card) => {
                const done = card.isDone || justDone.has(card.id);
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-slate-700/50 rounded-xl"
                  >
                    <button
                      onClick={() => !done && handleQuickDone(card.id, card.boardId, card.doneColumnId)}
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
                      <p
                        className={`text-sm font-medium truncate ${
                          done
                            ? "text-stone-400 dark:text-stone-500 line-through"
                            : "text-stone-700 dark:text-stone-200"
                        }`}
                      >
                        {card.title}
                      </p>
                      <p className="text-xs text-stone-400">{card.columnTitle}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
