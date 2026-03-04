"use client";

import { useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";

export default function DarkModeInitializer() {
  const { settings } = useSettings();

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.darkMode]);

  return null;
}
