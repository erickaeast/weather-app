import Image from "next/image";
import type { DailyItem } from "@/lib/types/weather";
import {
  formatTemp,
  formatWeekdayLabel,
  type TemperatureUnit,
} from "@/lib/weather";

interface DailyForecastProps {
  items: DailyItem[];
  unit: TemperatureUnit;
}

export function DailyForecast({ items, unit }: DailyForecastProps) {
  return (
    <section aria-labelledby="daily-heading">
      <h2
        id="daily-heading"
        className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/70"
      >
        7-day outlook
      </h2>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.date}
            className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/25 px-4 py-3 shadow backdrop-blur-md dark:border-white/10 dark:bg-black/35"
          >
            <span className="w-28 shrink-0 text-sm font-medium text-white">
              {formatWeekdayLabel(item.date)}
            </span>
            <Image
              src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
              alt=""
              width={36}
              height={36}
              className="shrink-0"
            />
            <span className="min-w-0 flex-1 truncate text-sm capitalize text-white/85">
              {item.description}
            </span>
            <span className="shrink-0 text-sm tabular-nums text-white">
              <span className="font-semibold">
                {formatTemp(item.temp_max, unit)}
              </span>
              <span className="mx-1 text-white/50">/</span>
              <span className="text-white/80">
                {formatTemp(item.temp_min, unit)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
