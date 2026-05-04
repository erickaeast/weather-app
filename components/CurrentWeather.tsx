import { WeatherIcon } from "@/components/WeatherIcon";
import type { WeatherCurrent } from "@/lib/types/weather";
import {
  formatTemp,
  formatWindSpeed,
  type TemperatureUnit,
} from "@/lib/weather";

interface CurrentWeatherProps {
  data: WeatherCurrent;
  unit: TemperatureUnit;
}

export function CurrentWeather({ data, unit }: CurrentWeatherProps) {
  return (
    <section className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
      <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
        <WeatherIcon
          iconCode={data.icon}
          width={128}
          height={128}
          sizes="(max-width: 640px) 112px, 128px"
          priority
          className="h-full w-full object-contain drop-shadow-lg contrast-[1.03] transition-[filter,opacity] duration-300 dark:brightness-110 dark:contrast-105"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600 transition-colors duration-300 dark:text-white/70">
          {data.city}, {data.country}
        </p>
        <p className="mt-1 text-7xl font-bold tabular-nums tracking-tighter text-zinc-950 transition-colors duration-300 dark:text-white dark:drop-shadow-md sm:text-8xl">
          {formatTemp(data.temp, unit)}
        </p>
        <p className="mt-2 text-base font-normal capitalize leading-snug text-zinc-600 transition-colors duration-300 dark:text-white/80">
          {data.description}
        </p>
        <dl className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3 sm:gap-6">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 transition-colors duration-300 dark:text-white/55">
              Feels like
            </dt>
            <dd className="mt-1 font-semibold tabular-nums text-zinc-900 transition-colors duration-300 dark:text-white">
              {formatTemp(data.feels_like, unit)}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 transition-colors duration-300 dark:text-white/55">
              Humidity
            </dt>
            <dd className="mt-1 font-semibold tabular-nums text-zinc-900 transition-colors duration-300 dark:text-white">
              {data.humidity}%
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 transition-colors duration-300 dark:text-white/55">
              Wind
            </dt>
            <dd className="mt-1 font-semibold tabular-nums text-zinc-900 transition-colors duration-300 dark:text-white">
              {formatWindSpeed(data.wind_speed, unit)}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
