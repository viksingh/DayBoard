import { Board } from "@/types/board";

const DONE_TITLES = ["done", "completed"];

export function isDoneColumn(title: string): boolean {
  return DONE_TITLES.includes(title.toLowerCase());
}

export function findDoneColumn(board: Board) {
  const sorted = [...board.columns].sort((a, b) => a.position - b.position);
  return sorted.find((c) => isDoneColumn(c.title)) || sorted[sorted.length - 1] || null;
}
