"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Calendar, AlignLeft } from "lucide-react";
import { Card } from "@/types/board";
import { formatDisplay, isTodayKey } from "@/lib/dates";
import Badge from "@/components/shared/Badge";
import { cn } from "@/lib/cn";

interface BoardCardProps {
  card: Card;
  onClick: () => void;
  isDragOverlay?: boolean;
}

export default function BoardCard({ card, onClick, isDragOverlay }: BoardCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { type: "card", card } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue =
    card.dueDate && !isTodayKey(card.dueDate) && new Date(card.dueDate) < new Date();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-warm transition-all cursor-pointer group",
        isDragging && "opacity-40",
        isDragOverlay && "shadow-warm-lg rotate-2"
      )}
      onClick={onClick}
    >
      {/* Labels */}
      {card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 px-3 pt-3">
          {card.labels.map((label) => (
            <Badge key={label.id} color={label.color}>
              {label.name}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-start gap-2 p-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-stone-100 text-stone-400 cursor-grab active:cursor-grabbing transition-opacity flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-stone-800 break-words">{card.title}</p>

          <div className="flex items-center gap-3 mt-2 text-xs text-stone-400">
            {card.description && (
              <span className="flex items-center gap-1">
                <AlignLeft className="w-3 h-3" />
              </span>
            )}
            {card.dueDate && (
              <span
                className={cn(
                  "flex items-center gap-1",
                  isOverdue && "text-red-500",
                  card.dueDate && isTodayKey(card.dueDate) && "text-amber-500"
                )}
              >
                <Calendar className="w-3 h-3" />
                {formatDisplay(card.dueDate, "MMM d")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
