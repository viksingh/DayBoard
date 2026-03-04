"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Kanban, MoreHorizontal, Trash2 } from "lucide-react";
import { Board, getBoardColor } from "@/types/board";
import { formatDisplay } from "@/lib/dates";
import { useState } from "react";

interface BoardPreviewCardProps {
  board: Board;
  onDelete: (id: string) => void;
}

export default function BoardPreviewCard({ board, onDelete }: BoardPreviewCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const totalCards = board.cards.length;
  const doneCol = board.columns.find(
    (c) => c.title.toLowerCase() === "done" || c.title.toLowerCase() === "completed"
  );
  const doneCards = doneCol ? board.cards.filter((c) => c.columnId === doneCol.id).length : 0;
  const progress = totalCards > 0 ? Math.round((doneCards / totalCards) * 100) : 0;
  const bc = getBoardColor(board.color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card relative group overflow-hidden"
    >
      {/* Color banner */}
      <div className="h-2 w-full" style={{ backgroundColor: bc.color }} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <Link href={`/board/${board.id}`} className="flex-1">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: bc.light }}
              >
                <Kanban className="w-4 h-4" style={{ color: bc.color }} />
              </div>
              <div>
                <h3 className="font-semibold text-stone-800 dark:text-stone-100 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">
                  {board.title}
                </h3>
                {board.description && (
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">{board.description}</p>
                )}
              </div>
            </div>
          </Link>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-400 transition-all"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-8 z-20 bg-white dark:bg-slate-800 rounded-xl shadow-warm-lg border border-stone-200 dark:border-slate-700 py-1 min-w-[140px]">
                  <button
                    onClick={() => {
                      onDelete(board.id);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {totalCards > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-stone-400">{progress}% complete</span>
              <span className="text-[10px] text-stone-400">{doneCards}/{totalCards}</span>
            </div>
            <div className="w-full bg-stone-200 dark:bg-slate-600 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all"
                style={{ width: `${progress}%`, backgroundColor: bc.color }}
              />
            </div>
          </div>
        )}

        {/* Column previews */}
        <Link href={`/board/${board.id}`}>
          <div className="flex gap-1.5 mb-3">
            {board.columns
              .sort((a, b) => a.position - b.position)
              .map((col) => {
                const count = board.cards.filter((c) => c.columnId === col.id).length;
                return (
                  <div key={col.id} className="flex-1">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ backgroundColor: col.color + "40" }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          backgroundColor: col.color,
                          width: totalCards > 0 ? `${(count / totalCards) * 100}%` : "0%",
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 block truncate">
                      {col.title} ({count})
                    </span>
                  </div>
                );
              })}
          </div>
        </Link>

        <div className="flex items-center justify-between text-xs text-stone-400">
          <span>
            {totalCards} card{totalCards !== 1 ? "s" : ""}
            {doneCards > 0 && ` \u00b7 ${doneCards} done`}
          </span>
          <span>{formatDisplay(board.updatedAt, "MMM d")}</span>
        </div>
      </div>
    </motion.div>
  );
}
