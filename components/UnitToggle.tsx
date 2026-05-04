"use client";

import type { TemperatureUnit } from "@/lib/weather";

interface UnitToggleProps {
  value: TemperatureUnit;
  onChange: (unit: TemperatureUnit) => void;
}

export function UnitToggle({ value, onChange }: UnitToggleProps) {
  return (
    <div
      className="inline-flex rounded-full border border-zinc-300/70 bg-white/60 p-0.5 shadow-sm backdrop-blur-md transition-[background-color,border-color] duration-300 dark:border-white/15 dark:bg-black/40"
      role="group"
      aria-label="Temperature unit"
    >
      <button
        type="button"
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-[background-color,color] duration-300 ${
          value === "F"
            ? "bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900"
            : "text-zinc-700 hover:bg-zinc-900/5 dark:text-white/90 dark:hover:bg-white/10"
        }`}
        onClick={() => onChange("F")}
        aria-pressed={value === "F"}
      >
        °F
      </button>
      <button
        type="button"
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-[background-color,color] duration-300 ${
          value === "C"
            ? "bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900"
            : "text-zinc-700 hover:bg-zinc-900/5 dark:text-white/90 dark:hover:bg-white/10"
        }`}
        onClick={() => onChange("C")}
        aria-pressed={value === "C"}
      >
        °C
      </button>
    </div>
  );
}
