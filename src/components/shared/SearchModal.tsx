"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, X, Kanban, FileText, CalendarDays } from "lucide-react";
import { useBoards } from "@/hooks/useBoards";
import { useDailyNotes } from "@/hooks/useDailyNotes";
import { useRouter } from "next/navigation";
import { formatDisplay } from "@/lib/dates";

interface SearchResult {
  type: "board" | "card" | "daily";
  title: string;
  subtitle: string;
  href: string;
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { boards } = useBoards();
  const { allNotes } = useDailyNotes();
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const results: SearchResult[] = (() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const items: SearchResult[] = [];

    for (const board of boards) {
      if (board.title.toLowerCase().includes(q) || board.description.toLowerCase().includes(q)) {
        items.push({
          type: "board",
          title: board.title,
          subtitle: `${board.cards.length} cards`,
          href: `/board/${board.id}`,
        });
      }
      for (const card of board.cards) {
        if (card.title.toLowerCase().includes(q) || card.description.toLowerCase().includes(q)) {
          const col = board.columns.find((c) => c.id === card.columnId);
          items.push({
            type: "card",
            title: card.title,
            subtitle: `${board.title} / ${col?.title || ""}`,
            href: `/board/${board.id}`,
          });
        }
      }
    }

    for (const note of allNotes) {
      if (note.content.toLowerCase().includes(q)) {
        items.push({
          type: "daily",
          title: formatDisplay(note.date, "EEEE, MMM d, yyyy"),
          subtitle: note.content.slice(0, 80) + (note.content.length > 80 ? "..." : ""),
          href: `/daily/${note.date}`,
        });
      }
    }

    return items.slice(0, 12);
  })();

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      onClose();
    },
    [router, onClose]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      navigate(results[selectedIndex].href);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const iconMap = {
    board: Kanban,
    card: FileText,
    daily: CalendarDays,
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-x-0 top-20 z-50 flex justify-center px-4 pointer-events-none"
      >
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-warm-xl w-full max-w-lg pointer-events-auto border border-stone-200 dark:border-stone-700 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-100 dark:border-stone-700">
            <Search className="w-5 h-5 text-stone-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search boards, cards, daily notes..."
              className="flex-1 bg-transparent border-none outline-none text-stone-800 dark:text-stone-200 placeholder:text-stone-400 text-sm"
            />
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          {query && (
            <div className="max-h-80 overflow-y-auto py-2">
              {results.length === 0 ? (
                <p className="text-sm text-stone-400 text-center py-8">No results found</p>
              ) : (
                results.map((result, i) => {
                  const Icon = iconMap[result.type];
                  return (
                    <button
                      key={`${result.type}-${result.href}-${i}`}
                      onClick={() => navigate(result.href)}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors ${
                        i === selectedIndex
                          ? "bg-blue-50 dark:bg-blue-900/30"
                          : "hover:bg-stone-50 dark:hover:bg-stone-700/50"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-700 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">
                          {result.title}
                        </p>
                        <p className="text-xs text-stone-400 truncate">{result.subtitle}</p>
                      </div>
                      <span className="text-[10px] text-stone-400 capitalize">{result.type}</span>
                    </button>
                  );
                })
              )}
            </div>
          )}

          {!query && (
            <div className="py-8 text-center">
              <p className="text-sm text-stone-400">Type to search across everything</p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
