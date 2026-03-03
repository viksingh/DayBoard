"use client";

import { useState, useMemo, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Board as BoardType, Card, Label } from "@/types/board";
import { useBoards } from "@/hooks/useBoards";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { CardFilters, DEFAULT_FILTERS, filterCards, sortCards } from "@/lib/card-filters";
import BoardHeader from "./BoardHeader";
import ColumnComponent from "./Column";
import AddColumnForm from "./AddColumnForm";
import BoardCard from "./BoardCard";
import CardModal from "@/components/board/CardModal";
import BoardFilterBar from "./BoardFilterBar";
import BulkActionBar from "./BulkActionBar";

interface BoardViewProps {
  board: BoardType;
}

export default function BoardView({ board }: BoardViewProps) {
  const { addColumn, addCard, deleteColumn, updateColumn } = useBoards();
  const { activeCard, handleDragStart, handleDragOver, handleDragEnd } = useDragAndDrop(board);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [filters, setFilters] = useState<CardFilters>(DEFAULT_FILTERS);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedCardIds, setSelectedCardIds] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const sortedColumns = [...board.columns].sort((a, b) => a.position - b.position);

  // Collect all unique labels from board cards
  const allLabels = useMemo(() => {
    const map = new Map<string, Label>();
    for (const card of board.cards) {
      for (const label of card.labels) {
        if (!map.has(label.id)) map.set(label.id, label);
      }
    }
    return Array.from(map.values());
  }, [board.cards]);

  // Get filtered/sorted cards for a column
  const getColumnCards = useCallback(
    (columnId: string) => {
      const colCards = board.cards.filter((c) => c.columnId === columnId);
      const filtered = filterCards(colCards, filters);
      return sortCards(filtered, filters.sort);
    },
    [board.cards, filters]
  );

  const toggleSelection = (cardId: string) => {
    setSelectedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedCardIds(new Set());
  };

  return (
    <div className="h-full flex flex-col">
      <BoardHeader
        board={board}
        selectionMode={selectionMode}
        onToggleSelectionMode={() => {
          if (selectionMode) exitSelectionMode();
          else setSelectionMode(true);
        }}
      />
      <BoardFilterBar filters={filters} onChange={setFilters} allLabels={allLabels} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
          {sortedColumns.map((column) => {
            const cards = getColumnCards(column.id);
            return (
              <ColumnComponent
                key={column.id}
                column={column}
                cards={cards}
                boardId={board.id}
                onAddCard={(title) => addCard(board.id, column.id, title)}
                onCardClick={(card) => {
                  if (selectionMode) {
                    toggleSelection(card.id);
                  } else {
                    setSelectedCard(card);
                  }
                }}
                onUpdateColumn={(title, color) => updateColumn(board.id, column.id, title, color)}
                onDeleteColumn={() => deleteColumn(board.id, column.id)}
                selectionMode={selectionMode}
                selectedCardIds={selectedCardIds}
              />
            );
          })}
          <AddColumnForm onAdd={(title) => addColumn(board.id, title)} />
        </div>

        <DragOverlay>
          {activeCard ? (
            <BoardCard card={activeCard} onClick={() => {}} isDragOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>

      {selectionMode && selectedCardIds.size > 0 && (
        <BulkActionBar
          boardId={board.id}
          columns={board.columns}
          selectedCount={selectedCardIds.size}
          selectedCardIds={selectedCardIds}
          onDone={exitSelectionMode}
        />
      )}

      {selectedCard && (
        <CardModal
          card={selectedCard}
          boardId={board.id}
          columns={board.columns}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}
