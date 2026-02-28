"use client";

import { useState, useCallback } from "react";
import {
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { Board, Card } from "@/types/board";
import { useBoards } from "@/hooks/useBoards";

export function useDragAndDrop(board: Board) {
  const { moveCard } = useBoards();
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const data = active.data.current;
      if (data?.type === "card") {
        setActiveCard(data.card as Card);
      }
    },
    []
  );

  const handleDragOver = useCallback(
    () => {
      // We handle everything in DragEnd for simplicity
    },
    []
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveCard(null);

      if (!over) return;

      const activeData = active.data.current;
      const overData = over.data.current;

      if (!activeData || activeData.type !== "card") return;

      const activeCardData = activeData.card as Card;

      // Dropped on a column (empty area)
      if (overData?.type === "column") {
        const toColumnId = overData.column.id;
        const toCards = board.cards
          .filter((c) => c.columnId === toColumnId && c.id !== activeCardData.id)
          .sort((a, b) => a.position - b.position);

        moveCard(board.id, activeCardData.id, toColumnId, toCards.length);
        return;
      }

      // Dropped on another card
      if (overData?.type === "card") {
        const overCard = overData.card as Card;
        const toColumnId = overCard.columnId;
        const toCards = board.cards
          .filter((c) => c.columnId === toColumnId && c.id !== activeCardData.id)
          .sort((a, b) => a.position - b.position);

        const overIndex = toCards.findIndex((c) => c.id === overCard.id);
        const newPosition = overIndex >= 0 ? overIndex : toCards.length;

        moveCard(board.id, activeCardData.id, toColumnId, newPosition);
      }
    },
    [board, moveCard]
  );

  return {
    activeCard,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
