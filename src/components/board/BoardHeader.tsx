"use client";

import { useState } from "react";
import { Settings, X, Check } from "lucide-react";
import { Board, BOARD_COLORS, getBoardColor } from "@/types/board";
import { useBoards } from "@/hooks/useBoards";
import { cn } from "@/lib/cn";

interface BoardHeaderProps {
  board: Board;
}

export default function BoardHeader({ board }: BoardHeaderProps) {
  const { updateBoard } = useBoards();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(board.title);
  const [description, setDescription] = useState(board.description);
  const [color, setColor] = useState(board.color || BOARD_COLORS[0].color);
  const bc = getBoardColor(board.color);

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
          <button onClick={handleSave} className="p-2 rounded-lg hover:bg-green-50 text-green-600">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={handleCancel} className="p-2 rounded-lg hover:bg-stone-100 text-stone-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Color picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-stone-500">Color:</span>
          {BOARD_COLORS.map((c) => (
            <button
              key={c.color}
              onClick={() => setColor(c.color)}
              className={cn(
                "w-6 h-6 rounded-lg transition-transform hover:scale-110",
                color === c.color && "ring-2 ring-offset-2 ring-stone-400"
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
    <div className="flex items-center justify-between mb-4">
      <div
        className="cursor-pointer group flex items-center gap-3"
        onClick={() => setEditing(true)}
      >
        <div
          className="w-3 h-8 rounded-full flex-shrink-0"
          style={{ backgroundColor: bc.color }}
        />
        <div>
          <h1 className="text-xl font-bold text-stone-800 group-hover:text-stone-600 transition-colors">
            {board.title}
          </h1>
          {board.description && (
            <p className="text-sm text-stone-500 mt-0.5">{board.description}</p>
          )}
        </div>
      </div>
      <button
        onClick={() => setEditing(true)}
        className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 transition-colors"
      >
        <Settings className="w-5 h-5" />
      </button>
    </div>
  );
}
