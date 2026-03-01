"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  Calendar,
  Tag,
  AlignLeft,
  Plus,
  Link as LinkIcon,
} from "lucide-react";
import { Card, Column, Label } from "@/types/board";
import { useBoards } from "@/hooks/useBoards";
import { useDailyNotes } from "@/hooks/useDailyNotes";
import { formatDisplay, todayKey } from "@/lib/dates";
import { generateId } from "@/lib/ids";
import Badge from "@/components/shared/Badge";
import ColorPicker from "@/components/shared/ColorPicker";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

interface CardModalProps {
  card: Card;
  boardId: string;
  columns: Column[];
  onClose: () => void;
}

export default function CardModal({ card, boardId, columns, onClose }: CardModalProps) {
  const { updateCard, deleteCard } = useBoards();
  const { linkCard } = useDailyNotes();

  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [dueDate, setDueDate] = useState(card.dueDate || "");
  const [labels, setLabels] = useState<Label[]>(card.labels);
  const [columnId, setColumnId] = useState(card.columnId);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLabelForm, setShowLabelForm] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#3b82f6");

  // Save on changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateCard(boardId, card.id, {
        title: title.trim() || card.title,
        description,
        dueDate: dueDate || null,
        labels,
        columnId,
      });
    }, 300);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, dueDate, labels, columnId]);

  const handleAddLabel = () => {
    if (newLabelName.trim()) {
      const newLabel: Label = {
        id: generateId(),
        name: newLabelName.trim(),
        color: newLabelColor,
      };
      setLabels([...labels, newLabel]);
      setNewLabelName("");
      setShowLabelForm(false);
    }
  };

  const handleRemoveLabel = (labelId: string) => {
    setLabels(labels.filter((l) => l.id !== labelId));
  };

  const handleDelete = () => {
    deleteCard(boardId, card.id);
    onClose();
  };

  const handleLinkToToday = () => {
    const today = todayKey();
    linkCard(today, card.id);
    updateCard(boardId, card.id, { linkedDailyDate: today });
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pointer-events-none"
      >
        <div className="bg-white rounded-2xl shadow-warm-xl w-full max-w-lg pointer-events-auto max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between p-5 pb-0">
            <div className="flex-1 mr-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-bold text-stone-800 w-full bg-transparent border-none outline-none focus:ring-0 p-0"
                placeholder="Card title"
              />
              <div className="flex items-center gap-2 mt-1 text-xs text-stone-400">
                <span>
                  in{" "}
                  <select
                    value={columnId}
                    onChange={(e) => setColumnId(e.target.value)}
                    className="text-xs text-blue-600 bg-transparent border-none outline-none cursor-pointer font-medium"
                  >
                    {columns.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.title}
                      </option>
                    ))}
                  </select>
                </span>
                {card.linkedDailyDate && (
                  <span className="flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" />
                    Linked to {formatDisplay(card.linkedDailyDate, "MMM d")}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Labels */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-stone-400" />
                <span className="text-sm font-medium text-stone-600">Labels</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {labels.map((label) => (
                  <button
                    key={label.id}
                    onClick={() => handleRemoveLabel(label.id)}
                    className="group"
                    title="Click to remove"
                  >
                    <Badge color={label.color}>
                      {label.name}
                      <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        &times;
                      </span>
                    </Badge>
                  </button>
                ))}
                <button
                  onClick={() => setShowLabelForm(!showLabelForm)}
                  className="label-chip bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors"
                >
                  <Plus className="w-3 h-3 inline" /> Add
                </button>
              </div>

              <AnimatePresence>
                {showLabelForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-stone-50 rounded-xl p-3 space-y-2"
                  >
                    <input
                      value={newLabelName}
                      onChange={(e) => setNewLabelName(e.target.value)}
                      placeholder="Label name"
                      className="input text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddLabel();
                      }}
                    />
                    <ColorPicker value={newLabelColor} onChange={setNewLabelColor} />
                    <button onClick={handleAddLabel} className="btn-primary text-xs py-1 px-3">
                      Add Label
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Due Date */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-stone-400" />
                <span className="text-sm font-medium text-stone-600">Due Date</span>
              </div>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlignLeft className="w-4 h-4 text-stone-400" />
                <span className="text-sm font-medium text-stone-600">Description</span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                className="textarea text-sm min-h-[100px]"
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <button onClick={handleLinkToToday} className="btn-ghost text-xs">
                <LinkIcon className="w-3.5 h-3.5" /> Link to today
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="btn-ghost text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete card
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showConfirm && (
          <ConfirmDialog
            title="Delete card?"
            message={`"${card.title}" will be permanently deleted.`}
            onConfirm={handleDelete}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
