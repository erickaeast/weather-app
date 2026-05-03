"use client";

import { useCallback, useState } from "react";

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [value, setValue] = useState("");

  const submit = useCallback(() => {
    const q = value.trim();
    if (!q || isLoading) return;
    onSearch(q);
  }, [value, isLoading, onSearch]);

  return (
    <div className="flex w-full max-w-md gap-2">
      <label htmlFor="city-search" className="sr-only">
        Search city
      </label>
      <input
        id="city-search"
        type="search"
        enterKeyHint="search"
        placeholder="Search city…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        disabled={isLoading}
        aria-busy={isLoading}
        className="min-w-0 flex-1 rounded-full border border-white/25 bg-white/15 px-4 py-2.5 text-sm text-white placeholder:text-white/60 shadow-inner backdrop-blur-md focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-60 dark:border-white/15 dark:bg-black/30"
      />
      <button
        type="button"
        onClick={submit}
        disabled={isLoading || !value.trim()}
        className="shrink-0 rounded-full bg-white/90 px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow transition-opacity hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900"
      >
        {isLoading ? "…" : "Search"}
      </button>
    </div>
  );
}
