"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Settings } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSettings();
  const [template, setTemplate] = useState(settings.dailyTemplate);
  const [dateFormat, setDateFormat] = useState(settings.dateFormat);

  if (!open) return null;

  const handleSave = () => {
    updateSettings({ dailyTemplate: template, dateFormat: dateFormat as typeof settings.dateFormat });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pointer-events-none"
      >
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-warm-xl w-full max-w-md pointer-events-auto">
          <div className="flex items-center justify-between p-5 pb-0">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-stone-500 dark:text-stone-400" />
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100">Settings</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            <div>
              <label className="text-sm font-medium text-stone-600 dark:text-stone-300 mb-2 block">
                Date Format
              </label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value as typeof settings.dateFormat)}
                className="input text-sm"
              >
                <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                <option value="yyyy-MM-dd">yyyy-MM-dd</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-stone-600 dark:text-stone-300 mb-2 block">
                Daily Note Template
              </label>
              <p className="text-xs text-stone-400 mb-2">
                This will auto-populate when you visit a new daily note.
              </p>
              <textarea
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                placeholder={"## Morning\n\n\n## Tasks\n\n- [ ] \n\n## Reflections\n"}
                className="textarea text-sm min-h-[150px] font-mono"
                rows={6}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-700">
              <button onClick={onClose} className="btn-secondary text-sm">
                Cancel
              </button>
              <button onClick={handleSave} className="btn-primary text-sm">
                Save
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
