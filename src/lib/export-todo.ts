import { Board } from "@/types/board";
import { getDueCards, groupDueCardsByBoard } from "./due-tasks";
import { format, parseISO } from "date-fns";

export function exportDailyTodo(boards: Board[], date: string) {
  const cards = getDueCards(boards, date);
  const groups = groupDueCardsByBoard(cards);
  const dayLabel = format(parseISO(date), "EEEE, MMM d, yyyy");

  let md = `# Tasks Due: ${dayLabel}\n`;

  for (const [boardName, boardCards] of Object.entries(groups)) {
    md += `\n## ${boardName}\n`;
    for (const card of boardCards) {
      const check = card.isDone ? "x" : " ";
      md += `- [${check}] ${card.title} (${card.columnTitle})\n`;
    }
  }

  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tasks-due-${date}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
