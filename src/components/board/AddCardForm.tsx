"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddCardFormProps {
  onAdd: (title: string) => void;
}

export default function AddCardForm({ onAdd }: AddCardFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(title.trim());
      setTitle("");
      inputRef.current?.focus();
    }
  };

  return (
    <div className="mt-2">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <textarea
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
                if (e.key === "Escape") {
                  setOpen(false);
                  setTitle("");
                }
              }}
              placeholder="Card title..."
              className="textarea text-sm min-h-[60px]"
              rows={2}
            />
            <div className="flex items-center gap-2 mt-2">
              <button onClick={handleSubmit} className="btn-primary text-sm py-1.5 px-3">
                Add Card
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  setTitle("");
                }}
                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 w-full px-3 py-2 text-sm text-stone-500 hover:bg-stone-100 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> Add a card
          </button>
        )}
      </AnimatePresence>
    </div>
  );
}
