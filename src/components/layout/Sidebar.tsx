"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Kanban,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useBoards } from "@/hooks/useBoards";
import { useSettings } from "@/context/SettingsContext";

export default function Sidebar() {
  const pathname = usePathname() ?? "/";
  const { boards, addBoard } = useBoards();
  const { settings, updateSettings } = useSettings();
  const collapsed = settings.sidebarCollapsed;

  const toggleCollapse = () => {
    updateSettings({ sidebarCollapsed: !collapsed });
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
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-screen bg-stone-50 border-r border-stone-200 flex flex-col overflow-hidden flex-shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-stone-200">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
          <Sun className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-stone-800 text-lg whitespace-nowrap"
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
                    ? "bg-amber-50 text-amber-700"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-800"
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
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Boards
                </span>
                <button
                  onClick={handleAddBoard}
                  className="p-0.5 rounded hover:bg-stone-200 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            {boards.map((board) => {
              const isActive = pathname === `/board/${board.id}`;
              return (
                <Link
                  key={board.id}
                  href={`/board/${board.id}`}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors",
                    isActive
                      ? "bg-amber-50 text-amber-700 font-medium"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-800"
                  )}
                >
                  <Kanban className="w-5 h-5 flex-shrink-0" />
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
                className="flex items-center justify-center w-full p-2 rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-stone-200">
        <button
          onClick={toggleCollapse}
          className="flex items-center justify-center w-full p-2 rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </motion.aside>
  );
}
