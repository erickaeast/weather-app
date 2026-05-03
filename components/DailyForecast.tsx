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

/** Temps are stored in °C; positions segment on a shared week scale (Apple Weather–style). */
function weekRangeBars(items: DailyItem[]) {
  const mins = items.map((i) => i.temp_min);
  const maxs = items.map((i) => i.temp_max);
  const weekMin = Math.min(...mins);
  const weekMax = Math.max(...maxs);
  const span = weekMax - weekMin;
  if (span === 0) {
    return items.map((item) => ({
      item,
      leftPct: 38,
      widthPct: 24,
    }));
  }
  return items.map((item) => {
    const leftPct = ((item.temp_min - weekMin) / span) * 100;
    const rightPct = ((item.temp_max - weekMin) / span) * 100;
    const widthPct = Math.max(rightPct - leftPct, 3);
    return { item, leftPct, widthPct };
  });
}

export function DailyForecast({ items, unit }: DailyForecastProps) {
  const rows = weekRangeBars(items);

  return (
    <section aria-labelledby="daily-heading">
      <h2
        id="daily-heading"
        className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/70"
      >
        7-day outlook
      </h2>
      <ul className="flex flex-col gap-3">
        {rows.map(({ item, leftPct, widthPct }) => (
          <li
            key={item.date}
            className="rounded-2xl border border-white/15 bg-black/25 px-4 py-3 shadow backdrop-blur-md dark:border-white/10 dark:bg-black/35"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex min-w-0 items-center gap-3 sm:w-[11rem] sm:shrink-0">
                <span className="w-[5.5rem] shrink-0 text-sm font-medium text-white">
                  {formatWeekdayLabel(item.date)}
                </span>
                <Image
                  src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                  alt=""
                  width={36}
                  height={36}
                  className="shrink-0"
                />
                <span className="min-w-0 flex-1 truncate text-xs capitalize text-white/75 sm:hidden">
                  {item.description}
                </span>
              </div>
              <div className="hidden min-w-0 flex-1 truncate text-sm capitalize text-white/80 sm:block sm:max-w-[8rem]">
                {item.description}
              </div>
              <div className="flex min-w-0 flex-1 items-center gap-3 sm:max-w-none">
                <span
                  className="w-11 shrink-0 text-right text-sm font-medium tabular-nums text-sky-200 dark:text-sky-300"
                  title="Low"
                >
                  {formatTemp(item.temp_min, unit)}
                </span>
                <div
                  className="relative h-2 min-w-[4rem] flex-1 rounded-full bg-white/15 ring-1 ring-white/10"
                  aria-hidden
                >
                  <div
                    className="absolute top-0 h-full min-w-[6px] rounded-full bg-gradient-to-r from-sky-400 via-amber-300 to-orange-400 shadow-sm ring-1 ring-white/20"
                    style={{
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                    }}
                  />
                </div>
                <span
                  className="w-11 shrink-0 text-left text-sm font-medium tabular-nums text-orange-200 dark:text-orange-300"
                  title="High"
                >
                  {formatTemp(item.temp_max, unit)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
