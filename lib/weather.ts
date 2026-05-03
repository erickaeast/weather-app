import type { WeatherData } from "@/lib/types/weather";

export async function fetchWeather(city: string): Promise<WeatherData> {
  const trimmed = city.trim();
  if (!trimmed) {
    throw new Error("City is required");
  }
  const params = new URLSearchParams({ city: trimmed });
  const res = await fetch(`/api/weather?${params.toString()}`);
  const body: unknown = await res.json();
  if (!res.ok) {
    const msg =
      body &&
      typeof body === "object" &&
      "error" in body &&
      typeof (body as { error?: unknown }).error === "string"
        ? (body as { error: string }).error
        : "Weather request failed";
    throw new Error(msg);
  }
  return body as WeatherData;
}

export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export type TemperatureUnit = "C" | "F";

/** Uses OWM unix timestamps (same instant for city). */
export function isDaytime(
  nowUnix: number,
  sunriseUnix: number,
  sunsetUnix: number,
): boolean {
  return nowUnix >= sunriseUnix && nowUnix <= sunsetUnix;
}

/** Display temperature from stored Celsius; value is rounded for UI. */
export function formatTemp(celsius: number, unit: TemperatureUnit): string {
  if (unit === "F") {
    return `${Math.round(celsiusToFahrenheit(celsius))}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

/** OWM `wind.speed` is m/s (metric). Show mph with °F, km/h with °C. */
export function formatWindSpeed(metersPerSecond: number, unit: TemperatureUnit): string {
  if (unit === "F") {
    const mph = metersPerSecond * 2.2369362920544;
    return `${Math.round(mph)} mph`;
  }
  const kmh = metersPerSecond * 3.6;
  return `${Math.round(kmh)} km/h`;
}

/** Label like "Monday" for a daily forecast row. `timestamp` is Unix seconds. */
export function formatWeekdayLabel(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
  }).format(new Date(timestamp * 1000));
}

/** `timestamp` is Unix seconds (OWM convention). */
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp * 1000));
}

/** `timestamp` is Unix seconds (OWM convention). */
export function formatTime(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp * 1000));
}
