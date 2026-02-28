"use client";

import { useCallback } from "react";
import { useDailyContext } from "@/context/DailyContext";
import { Mood } from "@/types/daily";

export function useDailyNotes() {
  const { notes, dispatch, getNote } = useDailyContext();

  const setContent = useCallback(
    (date: string, content: string) => {
      dispatch({ type: "SET_CONTENT", date, content });
    },
    [dispatch]
  );

  const setMood = useCallback(
    (date: string, mood: Mood) => {
      dispatch({ type: "SET_MOOD", date, mood });
    },
    [dispatch]
  );

  const linkCard = useCallback(
    (date: string, cardId: string) => {
      dispatch({ type: "LINK_CARD", date, cardId });
    },
    [dispatch]
  );

  const unlinkCard = useCallback(
    (date: string, cardId: string) => {
      dispatch({ type: "UNLINK_CARD", date, cardId });
    },
    [dispatch]
  );

  const deleteNote = useCallback(
    (date: string) => {
      dispatch({ type: "DELETE_NOTE", date });
    },
    [dispatch]
  );

  const allNotes = Object.values(notes);

  return {
    notes,
    allNotes,
    getNote,
    setContent,
    setMood,
    linkCard,
    unlinkCard,
    deleteNote,
  };
}
