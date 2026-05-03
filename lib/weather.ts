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
