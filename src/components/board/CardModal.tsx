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
  CheckSquare,
  Repeat,
  Square,
  CheckSquare2,
  Flag,
  BookmarkPlus,
  Paperclip,
  Download,
  FileSpreadsheet,
  File as FileIcon,
} from "lucide-react";
import { Card, CardAttachment, Column, Label, Subtask, RecurrenceRule, Priority, PRIORITY_CONFIG } from "@/types/board";
import { useBoards } from "@/hooks/useBoards";
import { useDailyNotes } from "@/hooks/useDailyNotes";
import { useTemplates } from "@/hooks/useTemplates";
import { formatDisplay, todayKey } from "@/lib/dates";
import { generateId } from "@/lib/ids";
import Badge from "@/components/shared/Badge";
import ColorPicker from "@/components/shared/ColorPicker";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { saveFile, handleDownload, removeFile, formatBytes } from "@/lib/file-storage";

interface CardModalProps {
  card: Card;
  boardId: string;
  columns: Column[];
  onClose: () => void;
}

export default function CardModal({ card, boardId, columns, onClose }: CardModalProps) {
  const { updateCard, deleteCard } = useBoards();
  const { linkCard } = useDailyNotes();
  const { addTemplate } = useTemplates();

  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [dueDate, setDueDate] = useState(card.dueDate || "");
  const [labels, setLabels] = useState<Label[]>(card.labels);
  const [columnId, setColumnId] = useState(card.columnId);
  const [subtasks, setSubtasks] = useState<Subtask[]>(card.subtasks || []);
  const [recurrence, setRecurrence] = useState<RecurrenceRule | null>(card.recurrence || null);
  const [priority, setPriority] = useState<Priority>(card.priority || null);
  const [attachments, setAttachments] = useState<CardAttachment[]>(card.attachments || []);
  const [uploading, setUploading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLabelForm, setShowLabelForm] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#3b82f6");
  const [newSubtaskText, setNewSubtaskText] = useState("");

  // Save on changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateCard(boardId, card.id, {
        title: title.trim() || card.title,
        description,
        dueDate: dueDate || null,
        labels,
        columnId,
        subtasks,
        recurrence,
        priority,
        attachments,
      });
    }, 300);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, dueDate, labels, columnId, subtasks, recurrence, priority, attachments]);

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

  const handleAddSubtask = () => {
    if (newSubtaskText.trim()) {
      setSubtasks([...subtasks, { id: generateId(), text: newSubtaskText.trim(), done: false }]);
      setNewSubtaskText("");
    }
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(subtasks.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const id = generateId();
        const meta = await saveFile(id, card.id, file);
        setAttachments((prev) => [...prev, meta]);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteAttachment = async (attachment: CardAttachment) => {
    await removeFile(attachment);
    setAttachments((prev) => prev.filter((a) => a.id !== attachment.id));
  };

  const handleRecurrenceChange = (frequency: string) => {
    if (frequency === "none") {
      setRecurrence(null);
    } else {
      setRecurrence({
        frequency: frequency as RecurrenceRule["frequency"],
        nextDue: dueDate || todayKey(),
      });
    }
  };

  const doneCount = subtasks.filter((s) => s.done).length;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pointer-events-none"
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-warm-xl w-full max-w-lg pointer-events-auto max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between p-5 pb-0">
            <div className="flex-1 mr-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-bold text-stone-800 dark:text-stone-100 w-full bg-transparent border-none outline-none focus:ring-0 p-0"
                placeholder="Card title"
              />
              <div className="flex items-center gap-2 mt-1 text-xs text-stone-400">
                <span>
                  in{" "}
                  <select
                    value={columnId}
                    onChange={(e) => setColumnId(e.target.value)}
                    className="text-xs text-blue-600 dark:text-blue-400 bg-transparent border-none outline-none cursor-pointer font-medium"
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
              className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Labels */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-stone-400" />
                <span className="text-sm font-medium text-stone-600 dark:text-stone-300">Labels</span>
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
                  className="label-chip bg-stone-100 dark:bg-slate-700 text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-slate-600 transition-colors"
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
                    className="bg-stone-50 dark:bg-slate-700 rounded-xl p-3 space-y-2"
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
                <span className="text-sm font-medium text-stone-600 dark:text-stone-300">Due Date</span>
              </div>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input text-sm"
              />
            </div>

            {/* Recurrence */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Repeat className="w-4 h-4 text-stone-400" />
                <span className="text-sm font-medium text-stone-600 dark:text-stone-300">Recurrence</span>
              </div>
              <select
                value={recurrence?.frequency || "none"}
                onChange={(e) => handleRecurrenceChange(e.target.value)}
                className="input text-sm"
              >
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flag className="w-4 h-4 text-stone-400" />
                <span className="text-sm font-medium text-stone-600 dark:text-stone-300">Priority</span>
              </div>
              <div className="flex items-center gap-2">
                {(["low", "medium", "high"] as const).map((p) => {
                  const cfg = PRIORITY_CONFIG[p];
                  const isActive = priority === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setPriority(isActive ? null : p)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                      style={isActive ? {
                        backgroundColor: cfg.color + "18",
                        borderColor: cfg.color,
                        color: cfg.color,
                      } : {
                        borderColor: "transparent",
                        backgroundColor: "var(--priority-bg, #f5f5f4)",
                        color: "#78716c",
                      }}
                    >
                      <Flag className="w-3 h-3" />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subtasks / Checklist */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckSquare className="w-4 h-4 text-stone-400" />
                <span className="text-sm font-medium text-stone-600 dark:text-stone-300">Subtasks</span>
                {subtasks.length > 0 && (
                  <span className="text-xs text-stone-400">
                    {doneCount}/{subtasks.length}
                  </span>
                )}
              </div>

              {subtasks.length > 0 && (
                <div className="w-full bg-stone-200 dark:bg-slate-600 rounded-full h-1.5 mb-3">
                  <div
                    className="bg-green-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${subtasks.length > 0 ? (doneCount / subtasks.length) * 100 : 0}%` }}
                  />
                </div>
              )}

              <div className="space-y-1.5 mb-2">
                {subtasks.map((st) => (
                  <div key={st.id} className="flex items-center gap-2 group">
                    <button onClick={() => handleToggleSubtask(st.id)} className="flex-shrink-0">
                      {st.done ? (
                        <CheckSquare2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Square className="w-4 h-4 text-stone-300 dark:text-stone-500" />
                      )}
                    </button>
                    <span
                      className={`text-sm flex-1 ${
                        st.done
                          ? "line-through text-stone-400 dark:text-stone-500"
                          : "text-stone-700 dark:text-stone-200"
                      }`}
                    >
                      {st.text}
                    </span>
                    <button
                      onClick={() => handleDeleteSubtask(st.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-stone-100 dark:hover:bg-slate-600 text-stone-400 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  value={newSubtaskText}
                  onChange={(e) => setNewSubtaskText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddSubtask();
                  }}
                  placeholder="Add a subtask..."
                  className="input text-sm py-1.5"
                />
                <button
                  onClick={handleAddSubtask}
                  className="btn-ghost text-xs flex-shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlignLeft className="w-4 h-4 text-stone-400" />
                <span className="text-sm font-medium text-stone-600 dark:text-stone-300">Description</span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                className="textarea text-sm min-h-[100px]"
                rows={4}
              />
            </div>

            {/* Attachments */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Paperclip className="w-4 h-4 text-stone-400" />
                <span className="text-sm font-medium text-stone-600 dark:text-stone-300">Attachments</span>
                {attachments.length > 0 && (
                  <span className="text-xs text-stone-400">{attachments.length} file{attachments.length !== 1 ? "s" : ""}</span>
                )}
              </div>

              {attachments.length > 0 && (
                <div className="space-y-1.5 mb-2">
                  {attachments.map((att) => {
                    const isExcel = /\.(xlsx?|csv)$/i.test(att.name);
                    const Icon = isExcel ? FileSpreadsheet : FileIcon;
                    return (
                      <div key={att.id} className="flex items-center gap-2 group bg-stone-50 dark:bg-slate-700 rounded-lg px-3 py-2">
                        <Icon className="w-4 h-4 text-stone-400 flex-shrink-0" />
                        <span className="text-sm text-stone-700 dark:text-stone-200 flex-1 truncate">{att.name}</span>
                        <span className="text-xs text-stone-400 flex-shrink-0">{formatBytes(att.size)}</span>
                        <button
                          onClick={() => handleDownload(att)}
                          className="p-1 rounded hover:bg-stone-200 dark:hover:bg-slate-600 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAttachment(att)}
                          className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-stone-400 hover:text-red-500 transition-colors"
                          title="Remove"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <label className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                uploading
                  ? "bg-stone-200 dark:bg-slate-600 text-stone-400 pointer-events-none"
                  : "bg-stone-100 dark:bg-slate-700 text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-slate-600"
              }`}>
                <Plus className="w-3 h-3" />
                {uploading ? "Uploading..." : "Add file"}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  multiple
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <button onClick={handleLinkToToday} className="btn-ghost text-xs">
                  <LinkIcon className="w-3.5 h-3.5" /> Link to today
                </button>
                <button
                  onClick={() => {
                    const name = prompt("Template name:");
                    if (name?.trim()) {
                      addTemplate({
                        name: name.trim(),
                        title,
                        description,
                        labels,
                        subtasks: subtasks.map((s) => ({ text: s.text })),
                        priority,
                      });
                    }
                  }}
                  className="btn-ghost text-xs"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" /> Save as template
                </button>
              </div>
              <button
                onClick={() => setShowConfirm(true)}
                className="btn-ghost text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
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
