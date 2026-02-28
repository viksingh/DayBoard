"use client";

import { useState } from "react";
import { Settings, X, Check } from "lucide-react";
import { Board } from "@/types/board";
import { useBoards } from "@/hooks/useBoards";

interface BoardHeaderProps {
  board: Board;
}

export default function BoardHeader({ board }: BoardHeaderProps) {
  const { updateBoard } = useBoards();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(board.title);
  const [description, setDescription] = useState(board.description);

  const handleSave = () => {
    if (title.trim()) {
      updateBoard(board.id, title.trim(), description);
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setTitle(board.title);
    setDescription(board.description);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-3 mb-4">
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
    );
  }

  return (
    <div className="flex items-center justify-between mb-4">
      <div
        className="cursor-pointer group"
        onClick={() => setEditing(true)}
      >
        <h1 className="text-xl font-bold text-stone-800 group-hover:text-amber-700 transition-colors">
          {board.title}
        </h1>
        {board.description && (
          <p className="text-sm text-stone-500 mt-0.5">{board.description}</p>
        )}
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
