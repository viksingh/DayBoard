"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Kanban,
  CalendarDays,
  Calendar as CalendarIcon,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sun,
  Moon,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useBoards } from "@/hooks/useBoards";
import { useSettings } from "@/context/SettingsContext";
import SettingsModal from "@/components/shared/SettingsModal";

export default function Sidebar() {
  const pathname = usePathname() ?? "/";
  const { boards, addBoard } = useBoards();
  const { settings, updateSettings } = useSettings();
  const collapsed = settings.sidebarCollapsed;
  const [showSettings, setShowSettings] = useState(false);

  const toggleCollapse = () => {
    updateSettings({ sidebarCollapsed: !collapsed });
  };

  const toggleDarkMode = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  const handleAddBoard = () => {
    const title = prompt("Board name:");
    if (title?.trim()) {
      addBoard(title.trim());
    }
  };

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/daily", icon: CalendarDays, label: "Daily Notes" },
    { href: "/calendar", icon: CalendarIcon, label: "Calendar" },
    { href: "/weekly", icon: BarChart3, label: "Weekly Review" },
  ];

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="h-screen bg-stone-50 dark:bg-slate-900 border-r border-stone-200 dark:border-slate-700 flex flex-col overflow-hidden flex-shrink-0"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-stone-200 dark:border-slate-700">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
            <Sun className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-bold text-stone-800 dark:text-stone-100 text-lg whitespace-nowrap"
              >
                DayBoard
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-slate-800 hover:text-stone-800 dark:hover:text-stone-200"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>

          {/* Boards section */}
          <div className="mt-6">
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between px-3 mb-2"
                >
                  <span className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                    Boards
                  </span>
                  <button
                    onClick={handleAddBoard}
                    className="p-0.5 rounded hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              {boards.map((board) => {
                const isActive = pathname === `/board/${board.id}`;
                const boardColor = board.color || "#4A7AB5";
                return (
                  <Link
                    key={board.id}
                    href={`/board/${board.id}`}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors",
                      isActive
                        ? "font-medium"
                        : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-slate-800 hover:text-stone-800 dark:hover:text-stone-200"
                    )}
                    style={isActive ? { backgroundColor: boardColor + "15", color: boardColor } : undefined}
                  >
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: boardColor + "25" }}
                    >
                      <Kanban className="w-3 h-3" style={{ color: boardColor }} />
                    </div>
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="truncate whitespace-nowrap"
                        >
                          {board.title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}

              {collapsed && (
                <button
                  onClick={handleAddBoard}
                  className="flex items-center justify-center w-full p-2 rounded-xl text-stone-400 hover:bg-stone-100 dark:hover:bg-slate-800 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Footer: Dark mode toggle + Settings + Collapse */}
        <div className="p-2 border-t border-stone-200 dark:border-slate-700 space-y-1">
          <div className={cn("flex", collapsed ? "flex-col items-center gap-1" : "items-center gap-1")}>
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center gap-2 p-2 rounded-xl text-stone-400 hover:bg-stone-100 dark:hover:bg-slate-800 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
              title={settings.darkMode ? "Light mode" : "Dark mode"}
            >
              {settings.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center justify-center gap-2 p-2 rounded-xl text-stone-400 hover:bg-stone-100 dark:hover:bg-slate-800 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={toggleCollapse}
              className="flex items-center justify-center p-2 rounded-xl text-stone-400 hover:bg-stone-100 dark:hover:bg-slate-800 hover:text-stone-600 dark:hover:text-stone-200 transition-colors ml-auto"
            >
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.aside>

      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
