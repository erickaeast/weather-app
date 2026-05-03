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
        className="h-9 min-w-[6.5rem] shrink-0 rounded-full border border-white/20 bg-black/20 backdrop-blur-md"
        aria-hidden
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-9 shrink-0 items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-sm font-medium shadow backdrop-blur-md transition-colors hover:bg-black/35 dark:border-white/15 dark:bg-black/40 dark:hover:bg-black/55"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="text-base leading-none" aria-hidden>
        {dark ? "☀️" : "🌙"}
      </span>
      <span className="text-white/95">{dark ? "light" : "dark"}</span>
    </button>
  );
}
