"use client";

import { useState } from "react";
import { Settings, X, Check, CheckSquare } from "lucide-react";
import { Board, BOARD_COLORS, getBoardColor } from "@/types/board";
import { useBoards } from "@/hooks/useBoards";
import { cn } from "@/lib/cn";

interface BoardHeaderProps {
  board: Board;
  selectionMode?: boolean;
  onToggleSelectionMode?: () => void;
}

export default function BoardHeader({ board, selectionMode, onToggleSelectionMode }: BoardHeaderProps) {
  const { updateBoard } = useBoards();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(board.title);
  const [description, setDescription] = useState(board.description);
  const [color, setColor] = useState(board.color || BOARD_COLORS[0].color);
  const bc = getBoardColor(board.color);

  const totalCards = board.cards.length;
  const doneCol = board.columns.find(
    (c) => c.title.toLowerCase() === "done" || c.title.toLowerCase() === "completed"
  );
  const doneCards = doneCol ? board.cards.filter((c) => c.columnId === doneCol.id).length : 0;
  const progress = totalCards > 0 ? Math.round((doneCards / totalCards) * 100) : 0;

  const handleSave = () => {
    if (title.trim()) {
      updateBoard(board.id, title.trim(), description, color);
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setTitle(board.title);
    setDescription(board.description);
    setColor(board.color || BOARD_COLORS[0].color);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input max-w-xs text-lg font-bold"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input max-w-sm text-sm"
            placeholder="Description (optional)"
          />
          <button onClick={handleSave} className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={handleCancel} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Color picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400">Color:</span>
          {BOARD_COLORS.map((c) => (
            <button
              key={c.color}
              onClick={() => setColor(c.color)}
              className={cn(
                "w-6 h-6 rounded-lg transition-transform hover:scale-110",
                color === c.color && "ring-2 ring-offset-2 ring-stone-400 dark:ring-offset-slate-800"
              )}
              style={{ backgroundColor: c.color }}
              title={c.name}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div
          className="cursor-pointer group flex items-center gap-3"
          onClick={() => setEditing(true)}
        >
          <div
            className="w-3 h-8 rounded-full flex-shrink-0"
            style={{ backgroundColor: bc.color }}
          />
          <div>
            <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
              {board.title}
            </h1>
            {board.description && (
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">{board.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {totalCards > 0 && (
            <span className="text-xs text-stone-400">{progress}% done</span>
          )}
          {onToggleSelectionMode && (
            <button
              onClick={onToggleSelectionMode}
              className={cn(
                "p-2 rounded-lg transition-colors",
                selectionMode
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-400"
              )}
              title={selectionMode ? "Exit selection" : "Select cards"}
            >
              <CheckSquare className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setEditing(true)}
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-400 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {totalCards > 0 && (
        <div className="mt-2 w-full bg-stone-200 dark:bg-slate-700 rounded-full h-1">
          <div
            className="h-1 rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: bc.color }}
          />
        </div>
      )}
    </div>
  );
}
