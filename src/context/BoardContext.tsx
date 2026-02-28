"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { Board, Card, Column, BOARD_COLORS } from "@/types/board";
import { storageGet, storageSet } from "@/lib/storage";
import { generateId } from "@/lib/ids";
import { nowISO } from "@/lib/dates";

const STORAGE_KEY = "boards";

// --- Actions ---
type Action =
  | { type: "LOAD"; boards: Board[] }
  | { type: "ADD_BOARD"; title: string; description?: string; color?: string }
  | { type: "UPDATE_BOARD"; boardId: string; title: string; description: string; color?: string }
  | { type: "DELETE_BOARD"; boardId: string }
  | { type: "ADD_COLUMN"; boardId: string; title: string; color?: string }
  | { type: "UPDATE_COLUMN"; boardId: string; columnId: string; title: string; color: string }
  | { type: "DELETE_COLUMN"; boardId: string; columnId: string }
  | { type: "MOVE_COLUMN"; boardId: string; columnId: string; newPosition: number }
  | { type: "ADD_CARD"; boardId: string; columnId: string; title: string; description?: string }
  | { type: "UPDATE_CARD"; boardId: string; cardId: string; updates: Partial<Omit<Card, "id" | "boardId" | "createdAt">> }
  | { type: "DELETE_CARD"; boardId: string; cardId: string }
  | { type: "MOVE_CARD"; boardId: string; cardId: string; toColumnId: string; newPosition: number };

// --- Reducer ---
function boardReducer(state: Board[], action: Action): Board[] {
  switch (action.type) {
    case "LOAD":
      return action.boards;

    case "ADD_BOARD": {
      const now = nowISO();
      const boardId = generateId();
      const boardColor = action.color || BOARD_COLORS[state.length % BOARD_COLORS.length].color;
      const newBoard: Board = {
        id: boardId,
        title: action.title,
        description: action.description || "",
        color: boardColor,
        columns: [
          { id: generateId(), boardId, title: "To Do", position: 0, color: "#3b82f6" },
          { id: generateId(), boardId, title: "In Progress", position: 1, color: "#f59e0b" },
          { id: generateId(), boardId, title: "Done", position: 2, color: "#22c55e" },
        ],
        cards: [],
        createdAt: now,
        updatedAt: now,
      };
      return [...state, newBoard];
    }

    case "UPDATE_BOARD":
      return state.map((b) =>
        b.id === action.boardId
          ? { ...b, title: action.title, description: action.description, ...(action.color ? { color: action.color } : {}), updatedAt: nowISO() }
          : b
      );

    case "DELETE_BOARD":
      return state.filter((b) => b.id !== action.boardId);

    case "ADD_COLUMN": {
      return state.map((b) => {
        if (b.id !== action.boardId) return b;
        const maxPos = b.columns.reduce((max, c) => Math.max(max, c.position), -1);
        const newCol: Column = {
          id: generateId(),
          boardId: b.id,
          title: action.title,
          position: maxPos + 1,
          color: action.color || "#a8a29e",
        };
        return { ...b, columns: [...b.columns, newCol], updatedAt: nowISO() };
      });
    }

    case "UPDATE_COLUMN":
      return state.map((b) => {
        if (b.id !== action.boardId) return b;
        return {
          ...b,
          columns: b.columns.map((c) =>
            c.id === action.columnId ? { ...c, title: action.title, color: action.color } : c
          ),
          updatedAt: nowISO(),
        };
      });

    case "DELETE_COLUMN":
      return state.map((b) => {
        if (b.id !== action.boardId) return b;
        return {
          ...b,
          columns: b.columns.filter((c) => c.id !== action.columnId),
          cards: b.cards.filter((c) => c.columnId !== action.columnId),
          updatedAt: nowISO(),
        };
      });

    case "MOVE_COLUMN":
      return state.map((b) => {
        if (b.id !== action.boardId) return b;
        const cols = [...b.columns].sort((a, c) => a.position - c.position);
        const idx = cols.findIndex((c) => c.id === action.columnId);
        if (idx === -1) return b;
        const [moved] = cols.splice(idx, 1);
        cols.splice(action.newPosition, 0, moved);
        return {
          ...b,
          columns: cols.map((c, i) => ({ ...c, position: i })),
          updatedAt: nowISO(),
        };
      });

    case "ADD_CARD": {
      return state.map((b) => {
        if (b.id !== action.boardId) return b;
        const colCards = b.cards.filter((c) => c.columnId === action.columnId);
        const maxPos = colCards.reduce((max, c) => Math.max(max, c.position), -1);
        const now = nowISO();
        const newCard: Card = {
          id: generateId(),
          columnId: action.columnId,
          boardId: b.id,
          title: action.title,
          description: action.description || "",
          labels: [],
          dueDate: null,
          position: maxPos + 1,
          linkedDailyDate: null,
          createdAt: now,
          updatedAt: now,
        };
        return { ...b, cards: [...b.cards, newCard], updatedAt: now };
      });
    }

    case "UPDATE_CARD":
      return state.map((b) => {
        if (b.id !== action.boardId) return b;
        return {
          ...b,
          cards: b.cards.map((c) =>
            c.id === action.cardId ? { ...c, ...action.updates, updatedAt: nowISO() } : c
          ),
          updatedAt: nowISO(),
        };
      });

    case "DELETE_CARD":
      return state.map((b) => {
        if (b.id !== action.boardId) return b;
        return { ...b, cards: b.cards.filter((c) => c.id !== action.cardId), updatedAt: nowISO() };
      });

    case "MOVE_CARD":
      return state.map((b) => {
        if (b.id !== action.boardId) return b;
        const card = b.cards.find((c) => c.id === action.cardId);
        if (!card) return b;

        // Remove from old position, recalculate positions
        const otherCards = b.cards.filter((c) => c.id !== action.cardId);
        const targetColCards = otherCards
          .filter((c) => c.columnId === action.toColumnId)
          .sort((a, c) => a.position - c.position);

        const movedCard = { ...card, columnId: action.toColumnId, updatedAt: nowISO() };
        targetColCards.splice(action.newPosition, 0, movedCard);

        const updatedTargetCards = targetColCards.map((c, i) => ({ ...c, position: i }));
        const remainingCards = otherCards.filter((c) => c.columnId !== action.toColumnId);

        return {
          ...b,
          cards: [...remainingCards, ...updatedTargetCards],
          updatedAt: nowISO(),
        };
      });

    default:
      return state;
  }
}

// --- Context ---
interface BoardContextType {
  boards: Board[];
  dispatch: React.Dispatch<Action>;
  getBoard: (id: string) => Board | undefined;
}

const BoardContext = createContext<BoardContextType | null>(null);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [boards, dispatch] = useReducer(boardReducer, []);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = storageGet<Board[]>(STORAGE_KEY, []);
    dispatch({ type: "LOAD", boards: saved });
  }, []);

  // Persist on every change (skip initial empty)
  const [initialized, setInitialized] = React.useState(false);
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    storageSet(STORAGE_KEY, boards);
  }, [boards, initialized]);

  const getBoard = useCallback(
    (id: string) => boards.find((b) => b.id === id),
    [boards]
  );

  return (
    <BoardContext.Provider value={{ boards, dispatch, getBoard }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoardContext() {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error("useBoardContext must be used within BoardProvider");
  return ctx;
}
