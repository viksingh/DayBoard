"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from "react";
import { Board, Card, Column, BOARD_COLORS, RecurrenceRule, CardTemplate } from "@/types/board";
import { storageGet, storageSet } from "@/lib/storage";
import { generateId } from "@/lib/ids";
import { nowISO, formatDateKey } from "@/lib/dates";
import { addDays, addWeeks, addMonths } from "date-fns";
import { subscribeToDoc, writeDoc, isFirestoreConfigured } from "@/lib/firestore-sync";

const STORAGE_KEY = "boards";
const FIRESTORE_DOC = "boards";

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
  | { type: "ADD_CARD_FROM_TEMPLATE"; boardId: string; columnId: string; template: CardTemplate }
  | { type: "UPDATE_CARD"; boardId: string; cardId: string; updates: Partial<Omit<Card, "id" | "boardId" | "createdAt">> }
  | { type: "DELETE_CARD"; boardId: string; cardId: string }
  | { type: "DELETE_CARDS"; boardId: string; cardIds: string[] }
  | { type: "MOVE_CARDS"; boardId: string; cardIds: string[]; toColumnId: string }
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
          { id: generateId(), boardId, title: "In Progress", position: 1, color: "#6B9BD2" },
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
          subtasks: [],
          recurrence: null,
          priority: null,
          createdAt: now,
          updatedAt: now,
        };
        return { ...b, cards: [...b.cards, newCard], updatedAt: now };
      });
    }

    case "ADD_CARD_FROM_TEMPLATE": {
      return state.map((b) => {
        if (b.id !== action.boardId) return b;
        const colCards = b.cards.filter((c) => c.columnId === action.columnId);
        const maxPos = colCards.reduce((max, c) => Math.max(max, c.position), -1);
        const now = nowISO();
        const t = action.template;
        const newCard: Card = {
          id: generateId(),
          columnId: action.columnId,
          boardId: b.id,
          title: t.title,
          description: t.description,
          labels: t.labels.map((l) => ({ ...l, id: generateId() })),
          dueDate: null,
          position: maxPos + 1,
          linkedDailyDate: null,
          subtasks: t.subtasks.map((s) => ({ id: generateId(), text: s.text, done: false })),
          recurrence: null,
          priority: t.priority,
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

    case "DELETE_CARDS":
      return state.map((b) => {
        if (b.id !== action.boardId) return b;
        const idsToDelete = new Set(action.cardIds);
        return { ...b, cards: b.cards.filter((c) => !idsToDelete.has(c.id)), updatedAt: nowISO() };
      });

    case "MOVE_CARDS":
      return state.map((b) => {
        if (b.id !== action.boardId) return b;
        const idsToMove = new Set(action.cardIds);
        const existingInTarget = b.cards.filter((c) => c.columnId === action.toColumnId && !idsToMove.has(c.id));
        let nextPos = existingInTarget.reduce((max, c) => Math.max(max, c.position), -1) + 1;
        const updatedCards = b.cards.map((c) => {
          if (idsToMove.has(c.id)) {
            return { ...c, columnId: action.toColumnId, position: nextPos++, updatedAt: nowISO() };
          }
          return c;
        });
        return { ...b, cards: updatedCards, updatedAt: nowISO() };
      });

    case "MOVE_CARD":
      return state.map((b) => {
        if (b.id !== action.boardId) return b;
        const card = b.cards.find((c) => c.id === action.cardId);
        if (!card) return b;

        const otherCards = b.cards.filter((c) => c.id !== action.cardId);
        const targetColCards = otherCards
          .filter((c) => c.columnId === action.toColumnId)
          .sort((a, c) => a.position - c.position);

        const movedCard = { ...card, columnId: action.toColumnId, updatedAt: nowISO() };
        targetColCards.splice(action.newPosition, 0, movedCard);

        const updatedTargetCards = targetColCards.map((c, i) => ({ ...c, position: i }));
        const remainingCards = otherCards.filter((c) => c.columnId !== action.toColumnId);

        let allCards = [...remainingCards, ...updatedTargetCards];

        // Recurrence: when a recurring card lands in the last column, clone it to the first column
        const sortedCols = [...b.columns].sort((a, c) => a.position - c.position);
        const lastCol = sortedCols[sortedCols.length - 1];
        const firstCol = sortedCols[0];
        if (card.recurrence && lastCol && firstCol && action.toColumnId === lastCol.id) {
          const rec = card.recurrence;
          const base = rec.nextDue ? new Date(rec.nextDue) : new Date();
          let nextDate: Date;
          if (rec.frequency === "daily") nextDate = addDays(base, 1);
          else if (rec.frequency === "weekly") nextDate = addWeeks(base, 1);
          else nextDate = addMonths(base, 1);

          const firstColCards = allCards.filter((c) => c.columnId === firstCol.id);
          const maxPos = firstColCards.reduce((max, c) => Math.max(max, c.position), -1);
          const now = nowISO();
          const clone: Card = {
            id: generateId(),
            columnId: firstCol.id,
            boardId: b.id,
            title: card.title,
            description: card.description,
            labels: [...card.labels],
            dueDate: formatDateKey(nextDate),
            position: maxPos + 1,
            linkedDailyDate: null,
            subtasks: card.subtasks.map((s) => ({ ...s, done: false })),
            recurrence: { ...rec, nextDue: formatDateKey(nextDate) } as RecurrenceRule,
            priority: card.priority,
            createdAt: now,
            updatedAt: now,
          };
          allCards = [...allCards, clone];
        }

        return {
          ...b,
          cards: allCards,
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
  const [initialized, setInitialized] = React.useState(false);
  const isRemoteUpdate = useRef(false);
  const useFirestore = isFirestoreConfigured();

  // Load: prefer Firestore (real-time), fall back to localStorage
  useEffect(() => {
    if (useFirestore) {
      // Load localStorage first for instant render, then Firestore takes over
      const cached = storageGet<Board[]>(STORAGE_KEY, []);
      if (cached.length > 0) {
        dispatch({ type: "LOAD", boards: cached });
      }

      const unsub = subscribeToDoc<Board[]>(FIRESTORE_DOC, (data) => {
        if (data) {
          isRemoteUpdate.current = true;
          dispatch({ type: "LOAD", boards: data });
          storageSet(STORAGE_KEY, data); // cache locally
        } else {
          // Doc doesn't exist yet — push local data to seed Firestore
          const local = storageGet<Board[]>(STORAGE_KEY, []);
          if (local.length > 0) {
            writeDoc(FIRESTORE_DOC, local);
          }
        }
        if (!initialized) setInitialized(true);
      });
      // Mark initialized even if Firestore hasn't responded yet
      const timeout = setTimeout(() => setInitialized(true), 1500);
      return () => {
        unsub();
        clearTimeout(timeout);
      };
    } else {
      const saved = storageGet<Board[]>(STORAGE_KEY, []);
      dispatch({ type: "LOAD", boards: saved });
      setInitialized(true);
    }
  }, [useFirestore]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist on every local change
  useEffect(() => {
    if (!initialized) return;

    // Skip persisting if this was a remote Firestore update
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    storageSet(STORAGE_KEY, boards);

    if (useFirestore) {
      writeDoc(FIRESTORE_DOC, boards);
    }
  }, [boards, initialized, useFirestore]);

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
