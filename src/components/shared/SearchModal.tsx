"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, X, Kanban, FileText, CalendarDays, Plus } from "lucide-react";
import { useBoards } from "@/hooks/useBoards";
import { useDailyNotes } from "@/hooks/useDailyNotes";
import { useRouter } from "next/navigation";
import { formatDisplay } from "@/lib/dates";

interface SearchResult {
  type: "board" | "card" | "daily" | "create";
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
  const [quickAddMode, setQuickAddMode] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [selectedColumnId, setSelectedColumnId] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { boards, addCard } = useBoards();
  const { allNotes } = useDailyNotes();
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setQuickAddMode(false);
      setSelectedBoardId("");
      setSelectedColumnId("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Auto-select first board/column when entering quick-add mode
  useEffect(() => {
    if (quickAddMode && !selectedBoardId && boards.length > 0) {
      setSelectedBoardId(boards[0].id);
      const cols = boards[0].columns;
      if (cols.length > 0) {
        const sorted = [...cols].sort((a, b) => a.position - b.position);
        setSelectedColumnId(sorted[0].id);
      }
    }
  }, [quickAddMode, selectedBoardId, boards]);

  // Update column when board changes
  useEffect(() => {
    if (selectedBoardId) {
      const board = boards.find((b) => b.id === selectedBoardId);
      if (board && board.columns.length > 0) {
        const sorted = [...board.columns].sort((a, b) => a.position - b.position);
        setSelectedColumnId(sorted[0].id);
      }
    }
  }, [selectedBoardId, boards]);

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

    // Add "Create task" option at the end
    items.push({
      type: "create",
      title: `Create task "${query.trim()}"`,
      subtitle: "Add a new card to a board",
      href: "",
    });

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

  const handleSelect = (result: SearchResult) => {
    if (result.type === "create") {
      setQuickAddMode(true);
    } else {
      navigate(result.href);
    }
  };

  const handleCreate = () => {
    if (!selectedBoardId || !selectedColumnId || !query.trim()) return;
    addCard(selectedBoardId, selectedColumnId, query.trim());
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (quickAddMode) {
      if (e.key === "Enter") {
        handleCreate();
      } else if (e.key === "Escape") {
        setQuickAddMode(false);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const iconMap: Record<string, typeof Kanban> = {
    board: Kanban,
    card: FileText,
    daily: CalendarDays,
    create: Plus,
  };

  const selectedBoard = boards.find((b) => b.id === selectedBoardId);
  const selectedBoardColumns = selectedBoard
    ? [...selectedBoard.columns].sort((a, b) => a.position - b.position)
    : [];

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
              onChange={(e) => { setQuery(e.target.value); setQuickAddMode(false); }}
              onKeyDown={handleKeyDown}
              placeholder="Search boards, cards, daily notes..."
              className="flex-1 bg-transparent border-none outline-none text-stone-800 dark:text-stone-200 placeholder:text-stone-400 text-sm"
            />
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          {quickAddMode ? (
            <div className="p-4 space-y-3">
              <p className="text-sm font-medium text-stone-700 dark:text-stone-200">
                Create task: <span className="text-blue-600 dark:text-blue-400">&quot;{query.trim()}&quot;</span>
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-stone-500 dark:text-stone-400 mb-1 block">Board</label>
                  <select
                    value={selectedBoardId}
                    onChange={(e) => setSelectedBoardId(e.target.value)}
                    className="input text-sm py-1.5 w-full"
                  >
                    {boards.map((b) => (
                      <option key={b.id} value={b.id}>{b.title}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-stone-500 dark:text-stone-400 mb-1 block">Column</label>
                  <select
                    value={selectedColumnId}
                    onChange={(e) => setSelectedColumnId(e.target.value)}
                    className="input text-sm py-1.5 w-full"
                  >
                    {selectedBoardColumns.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button onClick={() => setQuickAddMode(false)} className="btn-ghost text-xs">
                  Back
                </button>
                <button onClick={handleCreate} className="btn-primary text-xs">
                  <Plus className="w-3.5 h-3.5" /> Create
                </button>
              </div>
            </div>
          ) : query ? (
            <div className="max-h-80 overflow-y-auto py-2">
              {results.length === 0 ? (
                <p className="text-sm text-stone-400 text-center py-8">No results found</p>
              ) : (
                results.map((result, i) => {
                  const Icon = iconMap[result.type];
                  return (
                    <button
                      key={`${result.type}-${result.href}-${i}`}
                      onClick={() => handleSelect(result)}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors ${
                        i === selectedIndex
                          ? "bg-blue-50 dark:bg-blue-900/30"
                          : "hover:bg-stone-50 dark:hover:bg-stone-700/50"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        result.type === "create"
                          ? "bg-blue-100 dark:bg-blue-900/40"
                          : "bg-stone-100 dark:bg-stone-700"
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          result.type === "create"
                            ? "text-blue-500"
                            : "text-stone-500 dark:text-stone-400"
                        }`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium truncate ${
                          result.type === "create"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-stone-800 dark:text-stone-200"
                        }`}>
                          {result.title}
                        </p>
                        <p className="text-xs text-stone-400 truncate">{result.subtitle}</p>
                      </div>
                      {result.type !== "create" && (
                        <span className="text-[10px] text-stone-400 capitalize">{result.type}</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-stone-400">Type to search across everything</p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
