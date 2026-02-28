"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import AuthProvider from "@/components/auth/AuthProvider";
import AuthGuard from "@/components/auth/AuthGuard";
import { BoardProvider } from "@/context/BoardContext";
import { DailyProvider } from "@/context/DailyContext";
import { SettingsProvider } from "@/context/SettingsContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>
        <SettingsProvider>
          <BoardProvider>
            <DailyProvider>
              <div className="flex h-screen overflow-hidden bg-cream">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Header />
                  <main className="flex-1 overflow-y-auto p-6">
                    {children}
                  </main>
                </div>
              </div>
            </DailyProvider>
          </BoardProvider>
        </SettingsProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
