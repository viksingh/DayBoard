"use client";

import { useCallback } from "react";
import { useBoardContext } from "@/context/BoardContext";
import { Card, CardTemplate } from "@/types/board";

export function useBoards() {
  const { boards, dispatch, getBoard } = useBoardContext();

  const addBoard = useCallback(
    (title: string, description?: string, color?: string) => {
      dispatch({ type: "ADD_BOARD", title, description, color });
    },
    [dispatch]
  );

  const updateBoard = useCallback(
    (boardId: string, title: string, description: string, color?: string) => {
      dispatch({ type: "UPDATE_BOARD", boardId, title, description, color });
    },
    [dispatch]
  );

  const deleteBoard = useCallback(
    (boardId: string) => {
      dispatch({ type: "DELETE_BOARD", boardId });
    },
    [dispatch]
  );

  const addColumn = useCallback(
    (boardId: string, title: string, color?: string) => {
      dispatch({ type: "ADD_COLUMN", boardId, title, color });
    },
    [dispatch]
  );

  const updateColumn = useCallback(
    (boardId: string, columnId: string, title: string, color: string) => {
      dispatch({ type: "UPDATE_COLUMN", boardId, columnId, title, color });
    },
    [dispatch]
  );

  const deleteColumn = useCallback(
    (boardId: string, columnId: string) => {
      dispatch({ type: "DELETE_COLUMN", boardId, columnId });
    },
    [dispatch]
  );

  const addCard = useCallback(
    (boardId: string, columnId: string, title: string, description?: string) => {
      dispatch({ type: "ADD_CARD", boardId, columnId, title, description });
    },
    [dispatch]
  );

  const updateCard = useCallback(
    (boardId: string, cardId: string, updates: Partial<Omit<Card, "id" | "boardId" | "createdAt">>) => {
      dispatch({ type: "UPDATE_CARD", boardId, cardId, updates });
    },
    [dispatch]
  );

  const deleteCard = useCallback(
    (boardId: string, cardId: string) => {
      dispatch({ type: "DELETE_CARD", boardId, cardId });
    },
    [dispatch]
  );

  const moveCard = useCallback(
    (boardId: string, cardId: string, toColumnId: string, newPosition: number) => {
      dispatch({ type: "MOVE_CARD", boardId, cardId, toColumnId, newPosition });
    },
    [dispatch]
  );

  const addCardFromTemplate = useCallback(
    (boardId: string, columnId: string, template: CardTemplate) => {
      dispatch({ type: "ADD_CARD_FROM_TEMPLATE", boardId, columnId, template });
    },
    [dispatch]
  );

  return {
    boards,
    getBoard,
    addBoard,
    updateBoard,
    deleteBoard,
    addColumn,
    updateColumn,
    deleteColumn,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    addCardFromTemplate,
  };
}
