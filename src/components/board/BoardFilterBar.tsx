"use client";

import { useState } from "react";
import { Filter, Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { Label } from "@/types/board";
import { CardFilters, DueDateFilter, SortOption, DEFAULT_FILTERS, hasActiveFilters } from "@/lib/card-filters";
import Badge from "@/components/shared/Badge";
import { cn } from "@/lib/cn";

interface BoardFilterBarProps {
  filters: CardFilters;
  onChange: (filters: CardFilters) => void;
  allLabels: Label[];
}

export default function BoardFilterBar({ filters, onChange, allLabels }: BoardFilterBarProps) {
  const [expanded, setExpanded] = useState(false);
  const active = hasActiveFilters(filters);

  const dueDateOptions: { value: DueDateFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "overdue", label: "Overdue" },
    { value: "today", label: "Due today" },
    { value: "this-week", label: "This week" },
    { value: "none", label: "No date" },
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "position", label: "Default" },
    { value: "due-date", label: "Due date" },
    { value: "created-date", label: "Newest first" },
    { value: "priority", label: "Priority" },
  ];

  const toggleLabel = (labelId: string) => {
    const next = filters.labelIds.includes(labelId)
      ? filters.labelIds.filter((id) => id !== labelId)
      : [...filters.labelIds, labelId];
    onChange({ ...filters, labelIds: next });
  };

  return (
    <div className="mb-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition-colors",
          active
            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            : "text-stone-500 hover:bg-stone-100 dark:hover:bg-slate-700 dark:text-stone-400"
        )}
      >
        <Filter className="w-4 h-4" />
        Filter & Sort
        {active && (
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        )}
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {expanded && (
        <div className="mt-2 p-3 bg-stone-50/80 dark:bg-slate-800/50 rounded-xl space-y-3 border border-stone-100 dark:border-slate-700">
          {/* Keyword search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              value={filters.keyword}
              onChange={(e) => onChange({ ...filters, keyword: e.target.value })}
              placeholder="Search cards..."
              className="input text-sm pl-9 py-1.5"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Due date filter */}
            <div>
              <label className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1 block">Due date</label>
              <select
                value={filters.dueDate}
                onChange={(e) => onChange({ ...filters, dueDate: e.target.value as DueDateFilter })}
                className="input text-xs py-1"
              >
                {dueDateOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1 block">Sort by</label>
              <select
                value={filters.sort}
                onChange={(e) => onChange({ ...filters, sort: e.target.value as SortOption })}
                className="input text-xs py-1"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Label chips */}
          {allLabels.length > 0 && (
            <div>
              <label className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1 block">Labels</label>
              <div className="flex flex-wrap gap-1">
                {allLabels.map((label) => (
                  <button
                    key={label.id}
                    onClick={() => toggleLabel(label.id)}
                    className={cn(
                      "transition-all",
                      filters.labelIds.includes(label.id) ? "ring-2 ring-offset-1 rounded-full" : "opacity-60 hover:opacity-100"
                    )}
                    style={filters.labelIds.includes(label.id) ? { ringColor: label.color } as React.CSSProperties : undefined}
                  >
                    <Badge color={label.color}>{label.name}</Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {active && (
            <button
              onClick={() => onChange(DEFAULT_FILTERS)}
              className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
