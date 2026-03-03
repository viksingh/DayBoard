import { Board } from "@/types/board";

export interface DueCard {
  id: string;
  title: string;
  boardTitle: string;
  boardColor: string;
  columnTitle: string;
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
    for (const card of board.cards) {
      if (card.dueDate === date) {
        const col = board.columns.find((c) => c.id === card.columnId);
        result.push({
          id: card.id,
          title: card.title,
          boardTitle: board.title,
          boardColor: board.color,
          columnTitle: col?.title || "",
          isDone: doneCols.has(card.columnId),
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
