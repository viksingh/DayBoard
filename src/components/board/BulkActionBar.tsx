"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Trash2, X } from "lucide-react";
import { Column } from "@/types/board";
import { useBoardContext } from "@/context/BoardContext";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

interface BulkActionBarProps {
  boardId: string;
  columns: Column[];
  selectedCount: number;
  selectedCardIds: Set<string>;
  onDone: () => void;
}

export default function BulkActionBar({ boardId, columns, selectedCount, selectedCardIds, onDone }: BulkActionBarProps) {
  const { dispatch } = useBoardContext();
  const [moveTarget, setMoveTarget] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleMove = () => {
    if (!moveTarget) return;
    dispatch({
      type: "MOVE_CARDS",
      boardId,
      cardIds: Array.from(selectedCardIds),
      toColumnId: moveTarget,
    });
    onDone();
  };

  const handleDelete = () => {
    dispatch({
      type: "DELETE_CARDS",
      boardId,
      cardIds: Array.from(selectedCardIds),
    });
    onDone();
  };

  return (
    <>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-white dark:bg-slate-800 rounded-2xl shadow-warm-xl border border-stone-200 dark:border-slate-700 px-5 py-3 flex items-center gap-4"
      >
        <span className="text-sm font-medium text-stone-700 dark:text-stone-200">
          {selectedCount} selected
        </span>

        <div className="h-5 w-px bg-stone-200 dark:bg-slate-700" />

        {/* Move to */}
        <div className="flex items-center gap-2">
          <select
            value={moveTarget}
            onChange={(e) => setMoveTarget(e.target.value)}
            className="input text-xs py-1"
          >
            <option value="">Move to...</option>
            {columns.map((col) => (
              <option key={col.id} value={col.id}>{col.title}</option>
            ))}
          </select>
          <button
            onClick={handleMove}
            disabled={!moveTarget}
            className="btn-primary text-xs py-1.5 px-3 disabled:opacity-40"
          >
            <ArrowRight className="w-3.5 h-3.5" /> Move
          </button>
        </div>

        <div className="h-5 w-px bg-stone-200 dark:bg-slate-700" />

        {/* Delete */}
        <button
          onClick={() => setShowConfirm(true)}
          className="btn-ghost text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>

        {/* Cancel */}
        <button onClick={onDone} className="btn-ghost text-xs">
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
      </motion.div>

      {showConfirm && (
        <ConfirmDialog
          title="Delete selected cards?"
          message={`${selectedCount} card(s) will be permanently deleted.`}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
