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

/** Fallback OWM-like icon code when there is no payload yet (neutral clouds). */
const FALLBACK_CONDITION_ID = 802;

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

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-6 pb-12 sm:px-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55 drop-shadow-sm">
              Weather
            </p>
            <h1 className="mt-1 truncate text-3xl font-semibold tracking-tight text-white drop-shadow-md sm:text-4xl">
              {weatherData?.current.city ??
                (isLoading ? "…" : error ? "—" : "Weather")}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <UnitToggle value={unit} onChange={setUnit} />
            <ThemeToggle />
          </div>
        </header>

        <SearchBar
          value={query}
          onChange={(v) => {
            setQuery(v);
            if (emptyHint) setEmptyHint(null);
          }}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {emptyHint && (
          <p className="text-center text-sm text-amber-100/95 drop-shadow">
            {emptyHint}
          </p>
        )}

        <div className="rounded-3xl border border-white/15 bg-black/25 p-6 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-black/35">
          {isLoading && <WeatherSkeleton />}

          {!isLoading && error && (
            <ErrorMessage message={error} />
          )}

          {!isLoading && !error && weatherData && (
            <div className="space-y-10">
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
