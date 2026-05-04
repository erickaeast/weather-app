import { WeatherIcon } from "@/components/WeatherIcon";
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
        className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 transition-colors duration-300 dark:text-white/70"
      >
        Hourly
      </h2>
      <div className="-mx-1">
        <ul className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
          {items.slice(0, 8).map((item) => (
            <li
              key={item.time}
              className="flex w-[4.5rem] shrink-0 flex-col items-center gap-2 rounded-2xl border border-zinc-200/80 bg-white/50 px-3 py-3 text-center shadow-sm backdrop-blur-md transition-colors duration-300 dark:border-white/10 dark:bg-black/35"
            >
              <span className="text-xs tabular-nums text-zinc-600 transition-colors duration-300 dark:text-white/75">
                {formatTime(item.time)}
              </span>
              <WeatherIcon
                iconCode={item.icon}
                width={40}
                height={40}
                sizes="40px"
                label={item.description}
                className="contrast-[1.02] transition-[filter,opacity] duration-300 dark:brightness-110"
              />
              <span className="text-sm font-semibold tabular-nums text-zinc-900 transition-colors duration-300 dark:text-white">
                {formatTemp(item.temp, unit)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
