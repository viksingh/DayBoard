"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, LogOut, Search } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useBoardContext } from "@/context/BoardContext";
import { formatDisplay } from "@/lib/dates";
import SyncIndicator from "@/components/shared/SyncIndicator";
import SearchModal from "@/components/shared/SearchModal";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

function useBreadcrumbs() {
  const pathname = usePathname() ?? "/";
  const { getBoard } = useBoardContext();

  const crumbs: { label: string; href?: string }[] = [];

  if (pathname === "/") {
    crumbs.push({ label: "Dashboard" });
  } else if (pathname.startsWith("/board/")) {
    const boardId = pathname.split("/")[2];
    const board = getBoard(boardId);
    crumbs.push({ label: "Dashboard", href: "/" });
    crumbs.push({ label: board?.title || "Board" });
  } else if (pathname.startsWith("/daily")) {
    crumbs.push({ label: "Dashboard", href: "/" });
    const dateStr = pathname.split("/")[2];
    if (dateStr) {
      crumbs.push({ label: "Daily Notes", href: "/daily" });
      crumbs.push({ label: formatDisplay(dateStr, "EEEE, MMM d") });
    } else {
      crumbs.push({ label: "Daily Notes" });
    }
  } else if (pathname === "/calendar") {
    crumbs.push({ label: "Dashboard", href: "/" });
    crumbs.push({ label: "Calendar" });
  } else if (pathname === "/weekly") {
    crumbs.push({ label: "Dashboard", href: "/" });
    crumbs.push({ label: "Weekly Review" });
  }

  return crumbs;
}

export default function Header() {
  const crumbs = useBreadcrumbs();
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearch = useCallback(() => setShowSearch((v) => !v), []);
  useKeyboardShortcut("k", toggleSearch, { ctrlOrCmd: true });

  return (
    <>
      <header className="h-14 border-b border-stone-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-between px-6">
        <nav className="flex items-center gap-1.5 text-sm">
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-slate-600" />}
              {crumb.href ? (
                <Link href={crumb.href} className="text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-stone-800 dark:text-stone-100">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 bg-stone-100 dark:bg-slate-700 rounded-xl hover:bg-stone-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline text-[10px] bg-stone-200 dark:bg-slate-600 px-1.5 py-0.5 rounded font-mono">
              {typeof navigator !== "undefined" && /Mac/.test(navigator.userAgent) ? "\u2318" : "Ctrl+"}K
            </kbd>
          </button>

          <SyncIndicator />

          {/* User menu */}
          {session?.user && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-slate-700 transition-colors"
              >
                {session.user.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={session.user.image}
                    alt=""
                    className="w-7 h-7 rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-300">
                    {session.user.name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <span className="text-sm text-stone-600 dark:text-stone-300 hidden sm:block">
                  {session.user.name?.split(" ")[0]}
                </span>
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-11 z-20 bg-white dark:bg-slate-800 rounded-xl shadow-warm-lg border border-stone-200 dark:border-slate-700 py-1 min-w-[180px]">
                    <div className="px-3 py-2 border-b border-stone-100 dark:border-slate-700">
                      <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{session.user.name}</p>
                      <p className="text-xs text-stone-400 truncate">{session.user.email}</p>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      <SearchModal open={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
}
