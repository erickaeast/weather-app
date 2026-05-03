import { NextResponse } from "next/server";
import type {
  DailyItem,
  HourlyItem,
  WeatherCurrent,
  WeatherData,
} from "@/lib/types/weather";

const OWM_BASE = "https://api.openweathermap.org/data/2.5";

interface OwmWeatherStub {
  id: number;
  description: string;
  icon: string;
}

interface OwmCurrentJson {
  weather: OwmWeatherStub[];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind?: { speed?: number };
  name: string;
  sys: { country: string; sunrise: number; sunset: number };
  dt: number;
}

interface OwmForecastItem {
  dt: number;
  main: {
    temp: number;
    temp_min?: number;
    temp_max?: number;
  };
  weather: OwmWeatherStub[];
}

interface OwmForecastJson {
  list: OwmForecastItem[];
}

function mapCurrent(data: OwmCurrentJson): WeatherCurrent {
  const w = data.weather[0];
  return {
    temp: data.main.temp,
    feels_like: data.main.feels_like,
    humidity: data.main.humidity,
    wind_speed: data.wind?.speed ?? 0,
    description: w.description,
    icon: w.icon,
    city: data.name,
    country: data.sys.country,
    conditionId: w.id,
    dt: data.dt,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
  };
}

function mapHourly(list: OwmForecastItem[]): HourlyItem[] {
  return list.slice(0, 8).map((item) => {
    const w = item.weather[0];
    return {
      time: item.dt,
      temp: item.main.temp,
      icon: w.icon,
      description: w.description,
    };
  });
}

function startOfDayUtcSeconds(dateStr: string): number {
  return Math.floor(new Date(`${dateStr}T00:00:00.000Z`).getTime() / 1000);
}

function mapDaily(list: OwmForecastItem[]): DailyItem[] {
  const groups = new Map<string, OwmForecastItem[]>();
  for (const item of list) {
    const key = new Date(item.dt * 1000).toISOString().slice(0, 10);
    const existing = groups.get(key);
    if (existing) {
      existing.push(item);
    } else {
      groups.set(key, [item]);
    }
  }

  const days: DailyItem[] = [];
  for (const [dateStr, items] of groups) {
    const tempsMin = items.map(
      (i) => i.main.temp_min ?? i.main.temp,
    );
    const tempsMax = items.map(
      (i) => i.main.temp_max ?? i.main.temp,
    );
    const mid = items[Math.floor(items.length / 2)] ?? items[0];
    const w = mid.weather[0];
    days.push({
      date: startOfDayUtcSeconds(dateStr),
      temp_min: Math.min(...tempsMin),
      temp_max: Math.max(...tempsMax),
      icon: w.icon,
      description: w.description,
    });
  }

  days.sort((a, b) => a.date - b.date);
  return days.slice(0, 7);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.trim();
  if (!city) {
    return NextResponse.json(
      { error: "Missing city parameter" },
      { status: 400 },
    );
  }

  const key = process.env.OWM_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Weather API is not configured" },
      { status: 500 },
    );
  }

  const qs = new URLSearchParams({
    q: city,
    appid: key,
    units: "metric",
  });

  const fetchOpts = { next: { revalidate: 300 } as const };

  let currentRes: Response;
  let forecastRes: Response;
  try {
    [currentRes, forecastRes] = await Promise.all([
      fetch(`${OWM_BASE}/weather?${qs}`, fetchOpts),
      fetch(`${OWM_BASE}/forecast?${qs}`, fetchOpts),
    ]);
  } catch {
    return NextResponse.json(
      { error: "Network error while fetching weather" },
      { status: 502 },
    );
  }

  if (!currentRes.ok) {
    const errBody = await currentRes.json().catch(() => null);
    const message =
      errBody &&
      typeof errBody === "object" &&
      "message" in errBody &&
      typeof (errBody as { message?: string }).message === "string"
        ? (errBody as { message: string }).message
        : "Could not load weather for that location";
    const status = currentRes.status === 404 ? 404 : currentRes.status;
    return NextResponse.json({ error: message }, { status });
  }

  if (!forecastRes.ok) {
    return NextResponse.json(
      { error: "Could not load forecast for that location" },
      { status: forecastRes.status >= 400 ? forecastRes.status : 502 },
    );
  }

  let currentJson: OwmCurrentJson;
  let forecastJson: OwmForecastJson;
  try {
    currentJson = (await currentRes.json()) as OwmCurrentJson;
    forecastJson = (await forecastRes.json()) as OwmForecastJson;
  } catch {
    return NextResponse.json(
      { error: "Invalid response from weather service" },
      { status: 502 },
    );
  }

  const payload: WeatherData = {
    current: mapCurrent(currentJson),
    hourly: mapHourly(forecastJson.list ?? []),
    daily: mapDaily(forecastJson.list ?? []),
  };

  return NextResponse.json(payload);
}
