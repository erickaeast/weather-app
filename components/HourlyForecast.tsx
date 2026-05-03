import Image from "next/image";
import type { HourlyItem } from "@/lib/types/weather";
import { formatTemp, formatTime, type TemperatureUnit } from "@/lib/weather";

interface HourlyForecastProps {
  items: HourlyItem[];
  unit: TemperatureUnit;
}

export function HourlyForecast({ items, unit }: HourlyForecastProps) {
  return (
    <section aria-labelledby="hourly-heading">
      <h2
        id="hourly-heading"
        className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/70"
      >
        Hourly
      </h2>
      <div className="relative -mx-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-black/25 to-transparent dark:from-black/40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-black/25 to-transparent dark:from-black/40" />
        <ul className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
          {items.slice(0, 8).map((item) => (
            <li
              key={item.time}
              className="flex w-[4.5rem] shrink-0 flex-col items-center gap-2 rounded-2xl border border-white/15 bg-black/25 px-3 py-3 text-center shadow backdrop-blur-md dark:border-white/10 dark:bg-black/35"
            >
              <span className="text-xs tabular-nums text-white/75">
                {formatTime(item.time)}
              </span>
              <Image
                src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                alt=""
                width={40}
                height={40}
              />
              <span className="text-sm font-semibold tabular-nums text-white">
                {formatTemp(item.temp, unit)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
