export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Card {
  id: string;
  columnId: string;
  boardId: string;
  title: string;
  description: string;
  labels: Label[];
  dueDate: string | null;
  position: number;
  linkedDailyDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  boardId: string;
  title: string;
  position: number;
  color: string;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  columns: Column[];
  cards: Card[];
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_LABEL_COLORS = [
  { name: "Red", color: "#ef4444" },
  { name: "Orange", color: "#f97316" },
  { name: "Amber", color: "#f59e0b" },
  { name: "Green", color: "#22c55e" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Purple", color: "#a855f7" },
  { name: "Pink", color: "#ec4899" },
  { name: "Teal", color: "#14b8a6" },
];
