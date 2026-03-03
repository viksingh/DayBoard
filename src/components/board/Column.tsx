"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { MoreHorizontal, Trash2, Pencil, Check, X } from "lucide-react";
import { Column as ColumnType, Card } from "@/types/board";
import BoardCard from "./BoardCard";
import AddCardForm from "./AddCardForm";
import TemplatePicker from "./TemplatePicker";
import { cn } from "@/lib/cn";

interface ColumnProps {
  column: ColumnType;
  cards: Card[];
  boardId: string;
  onAddCard: (title: string) => void;
  onCardClick: (card: Card) => void;
  onUpdateColumn: (title: string, color: string) => void;
  onDeleteColumn: () => void;
  selectionMode?: boolean;
  selectedCardIds?: Set<string>;
}

export default function ColumnComponent({
  column,
  cards,
  boardId,
  onAddCard,
  onCardClick,
  onUpdateColumn,
  onDeleteColumn,
  selectionMode,
  selectedCardIds,
}: ColumnProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", column },
  });

  const sortedCards = [...cards].sort((a, b) => a.position - b.position);
  const cardIds = sortedCards.map((c) => c.id);

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdateColumn(editTitle.trim(), column.color);
      setEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-shrink-0 w-72"
    >
      <div
        className={cn(
          "bg-stone-50/80 dark:bg-slate-800/50 rounded-2xl p-3 transition-colors",
          isOver && "bg-blue-50/50 dark:bg-blue-900/20 ring-2 ring-blue-200 dark:ring-blue-700"
        )}
      >
        {/* Column header */}
        <div className="flex items-center justify-between mb-3 px-1">
          {editing ? (
            <div className="flex items-center gap-1 flex-1">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="input text-sm py-1 font-semibold"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") {
                    setEditing(false);
                    setEditTitle(column.title);
                  }
                }}
              />
              <button onClick={handleSaveEdit} className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded">
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setEditing(false); setEditTitle(column.title); }}
                className="p-1 text-stone-400 hover:bg-stone-100 dark:hover:bg-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: column.color }}
                />
                <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-200">{column.title}</h3>
                <span className="text-xs text-stone-400 bg-stone-200/50 dark:bg-slate-600/50 px-1.5 py-0.5 rounded-md">
                  {cards.length}
                </span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 rounded-lg hover:bg-stone-200/50 dark:hover:bg-slate-600/50 text-stone-400 transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-8 z-20 bg-white dark:bg-slate-800 rounded-xl shadow-warm-lg border border-stone-200 dark:border-slate-700 py-1 min-w-[140px]">
                      <button
                        onClick={() => {
                          setEditing(true);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Pencil className="w-4 h-4" /> Rename
                      </button>
                      <button
                        onClick={() => {
                          onDeleteColumn();
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Card list */}
        <div ref={setNodeRef} className="space-y-2 min-h-[40px]">
          <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
            {sortedCards.map((card) => {
              const isSelected = selectionMode && selectedCardIds?.has(card.id);
              return (
                <div key={card.id} className="relative">
                  {selectionMode && (
                    <div className="absolute left-2 top-2 z-10">
                      <div className={cn(
                        "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                        isSelected
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "border-stone-300 dark:border-stone-500 bg-white dark:bg-slate-700"
                      )}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  )}
                  <div className={cn(isSelected && "ring-2 ring-blue-400 rounded-xl")}>
                    <BoardCard card={card} onClick={() => onCardClick(card)} />
                  </div>
                </div>
              );
            })}
          </SortableContext>
        </div>

        <AddCardForm onAdd={onAddCard} />
        <TemplatePicker boardId={boardId} columnId={column.id} />
      </div>
    </motion.div>
  );
}
