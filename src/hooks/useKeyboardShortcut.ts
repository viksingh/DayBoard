"use client";

import { useEffect } from "react";

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options?: { ctrlOrCmd?: boolean }
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (options?.ctrlOrCmd && !(e.metaKey || e.ctrlKey)) return;
      if (e.key.toLowerCase() !== key.toLowerCase()) return;

      // Don't fire when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (!options?.ctrlOrCmd && (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT")) return;

      e.preventDefault();
      callback();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, callback, options?.ctrlOrCmd]);
}
