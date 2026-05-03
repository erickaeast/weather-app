"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialDark =
      stored === "dark" || (stored !== "light" && prefersDark);
    document.documentElement.classList.toggle("dark", initialDark);
    setDark(initialDark);
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    setDark(next);
  }

  if (dark === null) {
    return (
      <div
        className="h-9 w-9 shrink-0 rounded-full border border-white/20 bg-black/20 backdrop-blur-md"
        aria-hidden
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/25 text-lg shadow backdrop-blur-md transition-colors hover:bg-black/35 dark:border-white/15 dark:bg-black/40 dark:hover:bg-black/55"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
