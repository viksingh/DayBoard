"use client";

import { motion } from "framer-motion";
import { Plus, CalendarDays, Download, Upload } from "lucide-react";
import { useBoards } from "@/hooks/useBoards";
import { todayKey } from "@/lib/dates";
import Link from "next/link";

interface QuickActionsProps {
  onImport?: () => void;
  onExport?: () => void;
}

export default function QuickActions({ onImport, onExport }: QuickActionsProps) {
  const { addBoard } = useBoards();

  const handleNewBoard = () => {
    const title = prompt("Board name:");
    if (title?.trim()) {
      addBoard(title.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-wrap gap-2"
    >
      <button onClick={handleNewBoard} className="btn-primary text-sm">
        <Plus className="w-4 h-4" /> New Board
      </button>
      <Link href={`/daily/${todayKey()}`} className="btn-secondary text-sm">
        <CalendarDays className="w-4 h-4" /> Daily Notes
      </Link>
      {onExport && (
        <button onClick={onExport} className="btn-ghost text-sm">
          <Download className="w-4 h-4" /> Export
        </button>
      )}
      {onImport && (
        <button onClick={onImport} className="btn-ghost text-sm">
          <Upload className="w-4 h-4" /> Import
        </button>
      )}
    </motion.div>
  );
}
