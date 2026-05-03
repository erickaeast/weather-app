"use client";

import { useEffect } from "react";

const STORAGE_KEY = "theme";

/**
 * Applies `dark` on <html> from localStorage + prefers-color-scheme.
 * ThemeToggle (Phase 2) will read/write the same key.
 */
export function ThemeHtml() {
  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const isDark =
      stored === "dark" ||
      (stored !== "light" && prefersDark);
    root.classList.toggle("dark", isDark);
  }, []);

  return null;
}
