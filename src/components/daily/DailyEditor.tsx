"use client";

import { useState, useEffect, useRef } from "react";
import { useDailyNotes } from "@/hooks/useDailyNotes";

interface DailyEditorProps {
  date: string;
}

export default function DailyEditor({ date }: DailyEditorProps) {
  const { getNote, setContent } = useDailyNotes();
  const note = getNote(date);
  const [text, setText] = useState(note?.content || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Sync when date changes
  useEffect(() => {
    setText(note?.content || "");
  }, [date, note?.content]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.max(el.scrollHeight, 300) + "px";
    }
  }, [text]);

  const handleChange = (value: string) => {
    setText(value);
    // Debounced auto-save
    clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      setContent(date, value);
    }, 400);
  };

  return (
    <div className="card p-5">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="What's on your mind today? Write your thoughts, plans, reflections..."
        className="w-full bg-transparent border-none outline-none resize-none text-stone-700 text-sm leading-relaxed placeholder:text-stone-400 min-h-[300px]"
      />
    </div>
  );
}
