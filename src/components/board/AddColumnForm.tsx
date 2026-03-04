"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddColumnFormProps {
  onAdd: (title: string) => void;
}

export default function AddColumnForm({ onAdd }: AddColumnFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(title.trim());
      setTitle("");
      setOpen(false);
    }
  };

  return (
    <div className="flex-shrink-0 w-72">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-warm border border-stone-100 dark:border-slate-700"
          >
            <input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
                if (e.key === "Escape") {
                  setOpen(false);
                  setTitle("");
                }
              }}
              placeholder="Column title..."
              className="input text-sm mb-2"
            />
            <div className="flex items-center gap-2">
              <button onClick={handleSubmit} className="btn-primary text-sm py-1.5 px-3">
                Add Column
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  setTitle("");
                }}
                className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 rounded-2xl border-2 border-dashed border-stone-200 dark:border-slate-600 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add column
          </button>
        )}
      </AnimatePresence>
    </div>
  );
}
