"use client";

import { useState, useEffect, useRef } from "react";
import { Pencil, Eye } from "lucide-react";
import { useDailyNotes } from "@/hooks/useDailyNotes";
import { useSettings } from "@/context/SettingsContext";
import MarkdownPreview from "./MarkdownPreview";
import { cn } from "@/lib/cn";

interface DailyEditorProps {
  date: string;
}

export default function DailyEditor({ date }: DailyEditorProps) {
  const { getNote, setContent } = useDailyNotes();
  const { settings } = useSettings();
  const note = getNote(date);
  const [text, setText] = useState(note?.content || "");
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const templateApplied = useRef<Set<string>>(new Set());

  // Sync when date changes + apply template for empty notes
  useEffect(() => {
    const existingContent = note?.content || "";
    if (existingContent) {
      setText(existingContent);
    } else if (settings.dailyTemplate && !templateApplied.current.has(date)) {
      templateApplied.current.add(date);
      setText(settings.dailyTemplate);
      // Auto-save the template
      setContent(date, settings.dailyTemplate);
    } else {
      setText("");
    }
  }, [date, note?.content, settings.dailyTemplate, setContent]);

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
      {/* Edit/Preview toggle */}
      <div className="flex items-center gap-1 mb-3">
        <button
          onClick={() => setMode("edit")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
            mode === "edit"
              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              : "text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-slate-700"
          )}
        >
          <Pencil className="w-3 h-3" /> Edit
        </button>
        <button
          onClick={() => setMode("preview")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
            mode === "preview"
              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              : "text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-slate-700"
          )}
        >
          <Eye className="w-3 h-3" /> Preview
        </button>
      </div>

      {mode === "edit" ? (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="What's on your mind today? Write your thoughts, plans, reflections..."
          className="w-full bg-transparent border-none outline-none resize-none text-stone-700 dark:text-stone-200 text-sm leading-relaxed placeholder:text-stone-400 dark:placeholder:text-stone-500 min-h-[300px] font-mono"
        />
      ) : (
        <div className="min-h-[300px]">
          {text ? (
            <MarkdownPreview content={text} />
          ) : (
            <p className="text-sm text-stone-400 dark:text-stone-500 italic">Nothing to preview yet...</p>
          )}
        </div>
      )}
    </div>
  );
}
