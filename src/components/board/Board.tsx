"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Board as BoardType, Card } from "@/types/board";
import { useBoards } from "@/hooks/useBoards";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import BoardHeader from "./BoardHeader";
import ColumnComponent from "./Column";
import AddColumnForm from "./AddColumnForm";
import BoardCard from "./BoardCard";
import CardModal from "@/components/board/CardModal";

interface BoardViewProps {
  board: BoardType;
}

export default function BoardView({ board }: BoardViewProps) {
  const { addColumn, addCard, deleteColumn, updateColumn } = useBoards();
  const { activeCard, handleDragStart, handleDragOver, handleDragEnd } = useDragAndDrop(board);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const sortedColumns = [...board.columns].sort((a, b) => a.position - b.position);

  return (
    <div className="h-full flex flex-col">
      <BoardHeader board={board} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
          {sortedColumns.map((column) => {
            const cards = board.cards.filter((c) => c.columnId === column.id);
            return (
              <ColumnComponent
                key={column.id}
                column={column}
                cards={cards}
                onAddCard={(title) => addCard(board.id, column.id, title)}
                onCardClick={(card) => setSelectedCard(card)}
                onUpdateColumn={(title, color) => updateColumn(board.id, column.id, title, color)}
                onDeleteColumn={() => deleteColumn(board.id, column.id)}
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
