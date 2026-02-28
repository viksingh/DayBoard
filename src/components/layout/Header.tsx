"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useBoardContext } from "@/context/BoardContext";
import { formatDisplay } from "@/lib/dates";

function useBreadcrumbs() {
  const pathname = usePathname();
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
  }

  return crumbs;
}

export default function Header() {
  const crumbs = useBreadcrumbs();

  return (
    <header className="h-14 border-b border-stone-200 bg-white/80 backdrop-blur-sm flex items-center px-6">
      <nav className="flex items-center gap-1.5 text-sm">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-stone-300" />}
            {crumb.href ? (
              <Link href={crumb.href} className="text-stone-500 hover:text-stone-700 transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium text-stone-800">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
    </header>
  );
}
