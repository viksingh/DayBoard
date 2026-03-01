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
  color: string;
  columns: Column[];
  cards: Card[];
  createdAt: string;
  updatedAt: string;
}

export const BOARD_COLORS = [
  { name: "Sunset", color: "#f97316", light: "#fff7ed", gradient: "from-orange-400 to-amber-500" },
  { name: "Ocean", color: "#3b82f6", light: "#eff6ff", gradient: "from-blue-400 to-cyan-500" },
  { name: "Forest", color: "#22c55e", light: "#f0fdf4", gradient: "from-green-400 to-emerald-500" },
  { name: "Lavender", color: "#a855f7", light: "#faf5ff", gradient: "from-purple-400 to-violet-500" },
  { name: "Rose", color: "#ec4899", light: "#fdf2f8", gradient: "from-pink-400 to-rose-500" },
  { name: "Teal", color: "#14b8a6", light: "#f0fdfa", gradient: "from-teal-400 to-cyan-500" },
  { name: "Crimson", color: "#ef4444", light: "#fef2f2", gradient: "from-red-400 to-rose-500" },
  { name: "Steel", color: "#4A7AB5", light: "#eff6ff", gradient: "from-blue-400 to-blue-500" },
];

export function getBoardColor(color: string) {
  return BOARD_COLORS.find((c) => c.color === color) || BOARD_COLORS[0];
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
