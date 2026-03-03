import { Card } from "@/types/board";
import { todayKey } from "@/lib/dates";
import { addDays } from "date-fns";
import { formatDateKey } from "@/lib/dates";

export type DueDateFilter = "all" | "overdue" | "today" | "this-week" | "none";
export type SortOption = "position" | "due-date" | "created-date" | "priority";

export interface CardFilters {
  keyword: string;
  labelIds: string[];
  dueDate: DueDateFilter;
  sort: SortOption;
}

export const DEFAULT_FILTERS: CardFilters = {
  keyword: "",
  labelIds: [],
  dueDate: "all",
  sort: "position",
};

export function hasActiveFilters(filters: CardFilters): boolean {
  return (
    filters.keyword !== "" ||
    filters.labelIds.length > 0 ||
    filters.dueDate !== "all" ||
    filters.sort !== "position"
  );
}

export function filterCards(cards: Card[], filters: CardFilters): Card[] {
  const today = todayKey();
  const weekEnd = formatDateKey(addDays(new Date(), 7));

  return cards.filter((card) => {
    // Keyword filter
    if (filters.keyword) {
      const q = filters.keyword.toLowerCase();
      if (
        !card.title.toLowerCase().includes(q) &&
        !card.description.toLowerCase().includes(q)
      ) {
        return false;
      }
    }

    // Label filter
    if (filters.labelIds.length > 0) {
      const cardLabelIds = new Set(card.labels.map((l) => l.id));
      if (!filters.labelIds.some((id) => cardLabelIds.has(id))) {
        return false;
      }
    }

    // Due date filter
    if (filters.dueDate !== "all") {
      if (filters.dueDate === "none") {
        if (card.dueDate) return false;
      } else if (filters.dueDate === "today") {
        if (card.dueDate !== today) return false;
      } else if (filters.dueDate === "overdue") {
        if (!card.dueDate || card.dueDate >= today) return false;
      } else if (filters.dueDate === "this-week") {
        if (!card.dueDate || card.dueDate > weekEnd) return false;
      }
    }

    return true;
  });
}

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

export function sortCards(cards: Card[], sort: SortOption): Card[] {
  if (sort === "position") return cards;

  return [...cards].sort((a, b) => {
    if (sort === "due-date") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (sort === "created-date") {
      return b.createdAt.localeCompare(a.createdAt);
    }
    if (sort === "priority") {
      const pa = a.priority ? PRIORITY_ORDER[a.priority] : 3;
      const pb = b.priority ? PRIORITY_ORDER[b.priority] : 3;
      return pa - pb;
    }
    return 0;
  });
}
