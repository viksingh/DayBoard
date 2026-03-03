import { Board } from "@/types/board";
import { findDoneColumn } from "./board-helpers";

export interface DueCard {
  id: string;
  title: string;
  boardId: string;
  boardTitle: string;
  boardColor: string;
  columnTitle: string;
  doneColumnId: string | null;
  isDone: boolean;
}

export function getDueCards(boards: Board[], date: string): DueCard[] {
  const result: DueCard[] = [];
  for (const board of boards) {
    const doneCols = new Set(
      board.columns
        .filter((c) => c.title.toLowerCase() === "done" || c.title.toLowerCase() === "completed")
        .map((c) => c.id)
    );
    const doneCol = findDoneColumn(board);
    for (const card of board.cards) {
      if (card.dueDate === date) {
        const col = board.columns.find((c) => c.id === card.columnId);
        result.push({
          id: card.id,
          title: card.title,
          boardId: board.id,
          boardTitle: board.title,
          boardColor: board.color,
          columnTitle: col?.title || "",
          doneColumnId: doneCol?.id || null,
          isDone: doneCols.has(card.columnId),
        });
      }
    }
  }
  return result;
}

export function getOverdueCards(boards: Board[], today: string): DueCard[] {
  const result: DueCard[] = [];
  const todayDate = new Date(today);
  for (const board of boards) {
    const doneCols = new Set(
      board.columns
        .filter((c) => c.title.toLowerCase() === "done" || c.title.toLowerCase() === "completed")
        .map((c) => c.id)
    );
    const doneCol = findDoneColumn(board);
    for (const card of board.cards) {
      if (card.dueDate && new Date(card.dueDate) < todayDate && !doneCols.has(card.columnId)) {
        const col = board.columns.find((c) => c.id === card.columnId);
        result.push({
          id: card.id,
          title: card.title,
          boardId: board.id,
          boardTitle: board.title,
          boardColor: board.color,
          columnTitle: col?.title || "",
          doneColumnId: doneCol?.id || null,
          isDone: false,
        });
      }
    }
  }
  return result;
}

export function groupDueCardsByBoard(cards: DueCard[]): Record<string, DueCard[]> {
  const groups: Record<string, DueCard[]> = {};
  for (const card of cards) {
    if (!groups[card.boardTitle]) {
      groups[card.boardTitle] = [];
    }
    groups[card.boardTitle].push(card);
  }
  return groups;
}
