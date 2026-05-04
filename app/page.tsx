"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CurrentWeather } from "@/components/CurrentWeather";
import { DailyForecast } from "@/components/DailyForecast";
import { ErrorMessage } from "@/components/ErrorMessage";
import { HourlyForecast } from "@/components/HourlyForecast";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UnitToggle } from "@/components/UnitToggle";
import { WeatherBackground } from "@/components/WeatherBackground";
import { WeatherSkeleton } from "@/components/WeatherSkeleton";
import { useUiTheme } from "@/hooks/useUiTheme";
import type { WeatherData } from "@/lib/types/weather";
import {
  fetchWeather,
  isDaytime,
  type TemperatureUnit,
} from "@/lib/weather";

const DEFAULT_CITY = "Atlanta";
const LAST_CITY_KEY = "weather_last_city";

/** Fallback OWM-like icon code when there’s no payload yet (neutral clouds). */
const FALLBACK_CONDITION_ID = 802;

/** Readable over bright + dark animated backgrounds (Phase 4 contrast). */
const heroEyebrowClass =
  "text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-800 transition-colors duration-300 [text-shadow:0_1px_3px_rgba(255,255,255,0.85)] dark:text-white/55 dark:[text-shadow:0_2px_12px_rgba(0,0,0,0.45)]";

const heroTitleClass =
  "mt-1 truncate text-3xl font-semibold tracking-tight text-zinc-900 transition-colors duration-300 [text-shadow:0_1px_4px_rgba(255,255,255,0.9)] dark:text-white dark:[text-shadow:0_2px_16px_rgba(0,0,0,0.5)] sm:text-4xl";

export default function Home() {
  const theme = useUiTheme();
  const [query, setQuery] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>("F");
  const [emptyHint, setEmptyHint] = useState<string | null>(null);

  const loadWeather = useCallback(async (city: string) => {
    const trimmed = city.trim();
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(trimmed);
      setWeatherData(data);
      setQuery(data.current.city);
      localStorage.setItem(LAST_CITY_KEY, trimmed);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Something went wrong. Try again.";
      setError(msg);
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem(LAST_CITY_KEY)
        : null;
    const initial = saved?.trim() || DEFAULT_CITY;
    void loadWeather(initial);
  }, [loadWeather]);

  const handleSearch = useCallback(
    (raw: string) => {
      const q = raw.trim();
      if (!q) {
        setEmptyHint("Enter a city name to search.");
        return;
      }
      setEmptyHint(null);
      void loadWeather(q);
    },
    [loadWeather],
  );

  const bgConditionId = weatherData?.current.conditionId ?? FALLBACK_CONDITION_ID;
  const bgIsDay = useMemo(() => {
    if (!weatherData) return true;
    const c = weatherData.current;
    return isDaytime(c.dt, c.sunrise, c.sunset);
  }, [weatherData]);

  return (
    <div className="relative min-h-full flex-1">
      <WeatherBackground
        conditionId={bgConditionId}
        isDay={bgIsDay}
        theme={theme}
        loading={isLoading}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 pb-12 transition-[gap,padding] duration-300 sm:gap-8 sm:px-6 md:px-8 lg:max-w-4xl">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className={heroEyebrowClass}>Weather</p>
            <h1 className={heroTitleClass}>
              {weatherData?.current.city ??
                (isLoading ? "…" : error ? "—" : "Weather")}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <UnitToggle value={unit} onChange={setUnit} />
            <ThemeToggle />
          </div>
        </header>

        <div className="w-full max-w-md">
          <SearchBar
            value={query}
            onChange={(v) => {
              setQuery(v);
              if (emptyHint) setEmptyHint(null);
            }}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </div>

        {emptyHint && (
          <p className="text-center text-sm font-medium text-amber-900 [text-shadow:0_1px_2px_rgba(255,255,255,0.8)] transition-colors duration-300 dark:text-amber-100 dark:[text-shadow:0_2px_8px_rgba(0,0,0,0.4)]">
            {emptyHint}
          </p>
        )}

        <div className="rounded-3xl border border-zinc-200/70 bg-white/70 p-5 text-zinc-900 shadow-[0_4px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5)] ring-1 ring-black/[0.04] backdrop-blur-xl transition-[background-color,border-color,box-shadow,color] duration-300 sm:p-6 md:p-7 dark:border-white/10 dark:bg-black/50 dark:text-white dark:shadow-[0_8px_48px_rgba(0,0,0,0.42)] dark:ring-white/[0.06]">
          {isLoading && <WeatherSkeleton />}

          {!isLoading && error && <ErrorMessage message={error} />}

          {!isLoading && !error && weatherData && (
            <div className="space-y-10 md:space-y-12">
              <CurrentWeather data={weatherData.current} unit={unit} />
              <HourlyForecast items={weatherData.hourly} unit={unit} />
              <DailyForecast items={weatherData.daily} unit={unit} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
