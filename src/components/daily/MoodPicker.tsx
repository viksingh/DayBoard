"use client";

import { motion } from "framer-motion";
import { Mood, MOOD_OPTIONS } from "@/types/daily";
import { cn } from "@/lib/cn";

interface MoodPickerProps {
  value: Mood;
  onChange: (mood: Mood) => void;
}

export default function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <div className="flex items-center gap-2">
      {MOOD_OPTIONS.map((option) => (
        <motion.button
          key={option.value}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(value === option.value ? null : option.value)}
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all",
            value === option.value
              ? "bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-300 dark:ring-blue-600 shadow-warm"
              : "bg-stone-50 dark:bg-slate-700 hover:bg-stone-100 dark:hover:bg-slate-600"
          )}
          title={option.label}
        >
          {option.emoji}
        </motion.button>
      ))}
    </div>
  );
}
