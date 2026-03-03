"use client";

import { useState } from "react";
import { BookTemplate, ChevronDown, X } from "lucide-react";
import { useTemplates } from "@/hooks/useTemplates";
import { useBoardContext } from "@/context/BoardContext";

interface TemplatePickerProps {
  boardId: string;
  columnId: string;
}

export default function TemplatePicker({ boardId, columnId }: TemplatePickerProps) {
  const { templates, deleteTemplate } = useTemplates();
  const { dispatch } = useBoardContext();
  const [open, setOpen] = useState(false);

  if (templates.length === 0) return null;

  const handlePick = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;
    dispatch({ type: "ADD_CARD_FROM_TEMPLATE", boardId, columnId, template });
    setOpen(false);
  };

  return (
    <div className="relative mt-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 w-full px-3 py-1.5 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
      >
        <BookTemplate className="w-3 h-3" />
        From template
        <ChevronDown className="w-3 h-3 ml-auto" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 bottom-full mb-1 z-20 bg-white dark:bg-slate-800 rounded-xl shadow-warm-lg border border-stone-200 dark:border-slate-700 py-1 max-h-48 overflow-y-auto">
            {templates.map((t) => (
              <div key={t.id} className="flex items-center group">
                <button
                  onClick={() => handlePick(t.id)}
                  className="flex-1 text-left px-3 py-2 text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-slate-700 transition-colors truncate"
                >
                  {t.name}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTemplate(t.id);
                  }}
                  className="p-1 mr-1 rounded opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-500 hover:bg-stone-100 dark:hover:bg-slate-600 transition-all"
                  title="Delete template"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
