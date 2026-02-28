"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { MoreHorizontal, Trash2, Pencil, Check, X } from "lucide-react";
import { Column as ColumnType, Card } from "@/types/board";
import BoardCard from "./BoardCard";
import AddCardForm from "./AddCardForm";
import { cn } from "@/lib/cn";

interface ColumnProps {
  column: ColumnType;
  cards: Card[];
  onAddCard: (title: string) => void;
  onCardClick: (card: Card) => void;
  onUpdateColumn: (title: string, color: string) => void;
  onDeleteColumn: () => void;
}

export default function ColumnComponent({
  column,
  cards,
  onAddCard,
  onCardClick,
  onUpdateColumn,
  onDeleteColumn,
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
          "bg-stone-50/80 rounded-2xl p-3 transition-colors",
          isOver && "bg-amber-50/50 ring-2 ring-amber-200"
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
              <button onClick={handleSaveEdit} className="p-1 text-green-600 hover:bg-green-50 rounded">
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setEditing(false); setEditTitle(column.title); }}
                className="p-1 text-stone-400 hover:bg-stone-100 rounded"
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
                <h3 className="text-sm font-semibold text-stone-700">{column.title}</h3>
                <span className="text-xs text-stone-400 bg-stone-200/50 px-1.5 py-0.5 rounded-md">
                  {cards.length}
                </span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 rounded-lg hover:bg-stone-200/50 text-stone-400 transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-warm-lg border border-stone-200 py-1 min-w-[140px]">
                      <button
                        onClick={() => {
                          setEditing(true);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        <Pencil className="w-4 h-4" /> Rename
                      </button>
                      <button
                        onClick={() => {
                          onDeleteColumn();
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
            {sortedCards.map((card) => (
              <BoardCard key={card.id} card={card} onClick={() => onCardClick(card)} />
            ))}
          </SortableContext>
        </div>

        <AddCardForm onAdd={onAddCard} />
      </div>
    </motion.div>
  );
}
