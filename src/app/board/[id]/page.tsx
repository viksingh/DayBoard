"use client";

import { useParams, useRouter } from "next/navigation";
import { useBoards } from "@/hooks/useBoards";
import BoardView from "@/components/board/Board";
import EmptyState from "@/components/shared/EmptyState";
import { Kanban } from "lucide-react";

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const { getBoard } = useBoards();
  const boardId = params.id as string;
  const board = getBoard(boardId);

  if (!board) {
    return (
      <EmptyState
        icon={Kanban}
        title="Board not found"
        description="This board doesn't exist or may have been deleted."
        action={{ label: "Go to Dashboard", onClick: () => router.push("/") }}
      />
    );
  }

  return <BoardView board={board} />;
}
