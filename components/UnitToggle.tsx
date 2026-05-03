"use client";

import type { TemperatureUnit } from "@/lib/weather";

interface UnitToggleProps {
  value: TemperatureUnit;
  onChange: (unit: TemperatureUnit) => void;
}

export function UnitToggle({ value, onChange }: UnitToggleProps) {
  return (
    <div
      className="inline-flex rounded-full border border-white/20 bg-black/25 p-0.5 shadow backdrop-blur-md dark:border-white/15 dark:bg-black/40"
      role="group"
      aria-label="Temperature unit"
    >
      <button
        type="button"
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
          value === "F"
            ? "bg-white/90 text-zinc-900 dark:bg-white dark:text-zinc-900"
            : "text-white/90 hover:bg-white/10"
        }`}
        onClick={() => onChange("F")}
        aria-pressed={value === "F"}
      >
        °F
      </button>
      <button
        type="button"
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
          value === "C"
            ? "bg-white/90 text-zinc-900 dark:bg-white dark:text-zinc-900"
            : "text-white/90 hover:bg-white/10"
        }`}
        onClick={() => onChange("C")}
        aria-pressed={value === "C"}
      >
        °C
      </button>
    </div>
  );
}
