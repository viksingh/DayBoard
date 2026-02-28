"use client";

import { Kanban } from "lucide-react";
import { useBoards } from "@/hooks/useBoards";
import BoardPreviewCard from "@/components/dashboard/BoardPreviewCard";
import TodaySummary from "@/components/dashboard/TodaySummary";
import QuickActions from "@/components/dashboard/QuickActions";
import EmptyState from "@/components/shared/EmptyState";
import { exportAllData, importAllData } from "@/lib/export-import";

export default function DashboardPage() {
  const { boards, addBoard, deleteBoard } = useBoards();

  const handleExport = () => exportAllData();

  const handleImport = async () => {
    const success = await importAllData();
    if (success) {
      window.location.reload();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Welcome back</h1>
          <p className="text-sm text-stone-500 mt-1">Here&apos;s what&apos;s happening across your boards</p>
        </div>
        <QuickActions onExport={handleExport} onImport={handleImport} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {boards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {boards.map((board) => (
                <BoardPreviewCard key={board.id} board={board} onDelete={deleteBoard} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Kanban}
              title="No boards yet"
              description="Create your first board to start organizing tasks"
              action={{
                label: "Create Board",
                onClick: () => {
                  const title = prompt("Board name:");
                  if (title?.trim()) addBoard(title.trim());
                },
              }}
            />
          )}
        </div>
        <div>
          <TodaySummary />
        </div>
      </div>
    </div>
  );
}
