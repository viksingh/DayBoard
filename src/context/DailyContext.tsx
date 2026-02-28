"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { DailyNote, Mood } from "@/types/daily";
import { storageGet, storageSet } from "@/lib/storage";
import { nowISO } from "@/lib/dates";

const STORAGE_KEY = "daily-notes";

type DailyMap = Record<string, DailyNote>;

type Action =
  | { type: "LOAD"; notes: DailyMap }
  | { type: "SET_CONTENT"; date: string; content: string }
  | { type: "SET_MOOD"; date: string; mood: Mood }
  | { type: "LINK_CARD"; date: string; cardId: string }
  | { type: "UNLINK_CARD"; date: string; cardId: string }
  | { type: "DELETE_NOTE"; date: string };

function ensureNote(state: DailyMap, date: string): DailyNote {
  return state[date] || { date, content: "", mood: null, linkedCardIds: [], updatedAt: nowISO() };
}

function dailyReducer(state: DailyMap, action: Action): DailyMap {
  switch (action.type) {
    case "LOAD":
      return action.notes;

    case "SET_CONTENT": {
      const note = ensureNote(state, action.date);
      return { ...state, [action.date]: { ...note, content: action.content, updatedAt: nowISO() } };
    }

    case "SET_MOOD": {
      const note = ensureNote(state, action.date);
      return { ...state, [action.date]: { ...note, mood: action.mood, updatedAt: nowISO() } };
    }

    case "LINK_CARD": {
      const note = ensureNote(state, action.date);
      if (note.linkedCardIds.includes(action.cardId)) return state;
      return {
        ...state,
        [action.date]: {
          ...note,
          linkedCardIds: [...note.linkedCardIds, action.cardId],
          updatedAt: nowISO(),
        },
      };
    }

    case "UNLINK_CARD": {
      const note = ensureNote(state, action.date);
      return {
        ...state,
        [action.date]: {
          ...note,
          linkedCardIds: note.linkedCardIds.filter((id) => id !== action.cardId),
          updatedAt: nowISO(),
        },
      };
    }

    case "DELETE_NOTE": {
      const next = { ...state };
      delete next[action.date];
      return next;
    }

    default:
      return state;
  }
}

interface DailyContextType {
  notes: DailyMap;
  dispatch: React.Dispatch<Action>;
  getNote: (date: string) => DailyNote | undefined;
}

const DailyContext = createContext<DailyContextType | null>(null);

export function DailyProvider({ children }: { children: React.ReactNode }) {
  const [notes, dispatch] = useReducer(dailyReducer, {});

  useEffect(() => {
    const saved = storageGet<DailyMap>(STORAGE_KEY, {});
    dispatch({ type: "LOAD", notes: saved });
  }, []);

  const [initialized, setInitialized] = React.useState(false);
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    storageSet(STORAGE_KEY, notes);
  }, [notes, initialized]);

  const getNote = useCallback(
    (date: string) => notes[date],
    [notes]
  );

  return (
    <DailyContext.Provider value={{ notes, dispatch, getNote }}>
      {children}
    </DailyContext.Provider>
  );
}

export function useDailyContext() {
  const ctx = useContext(DailyContext);
  if (!ctx) throw new Error("useDailyContext must be used within DailyProvider");
  return ctx;
}
