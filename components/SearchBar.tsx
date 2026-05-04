"use client";

import { useCallback } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  isLoading,
}: SearchBarProps) {
  const submit = useCallback(() => {
    if (isLoading) return;
    onSearch(value.trim());
  }, [value, isLoading, onSearch]);

  return (
    <div className="flex w-full gap-2">
      <label htmlFor="city-search" className="sr-only">
        Search city
      </label>
      <input
        id="city-search"
        type="search"
        enterKeyHint="search"
        placeholder="Search city…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        disabled={isLoading}
        aria-busy={isLoading}
        className="min-w-0 flex-1 rounded-full border border-zinc-300/70 bg-white/75 px-4 py-2.5 text-sm text-zinc-900 shadow-inner shadow-black/5 backdrop-blur-md transition-[background-color,border-color,color,box-shadow] duration-300 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 disabled:opacity-60 dark:border-white/20 dark:bg-black/35 dark:text-white dark:shadow-black/30 dark:placeholder:text-white/55 dark:focus:border-white/35 dark:focus:ring-white/20"
      />
      <button
        type="button"
        onClick={submit}
        disabled={isLoading}
        className="shrink-0 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-[background-color,opacity,transform] duration-300 hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
      >
        {isLoading ? "…" : "Search"}
      </button>
    </div>
  );
}
