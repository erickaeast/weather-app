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
        className="h-9 min-w-[6.5rem] shrink-0 rounded-full border border-zinc-300/60 bg-white/50 backdrop-blur-md dark:border-white/20 dark:bg-black/25"
        aria-hidden
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-9 shrink-0 items-center gap-2 rounded-full border border-zinc-300/70 bg-white/60 px-3 py-1.5 text-sm font-medium text-zinc-900 shadow-sm backdrop-blur-md transition-[background-color,border-color,color] duration-300 hover:bg-white/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-white/15 dark:bg-black/40 dark:text-white dark:hover:bg-black/55 dark:focus-visible:ring-white/50 dark:focus-visible:ring-offset-zinc-900"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="text-base leading-none" aria-hidden>
        {dark ? "☀️" : "🌙"}
      </span>
      <span className="text-zinc-800 dark:text-white/95">{dark ? "light" : "dark"}</span>
    </button>
  );
}
