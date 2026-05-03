import Image from "next/image";
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
  const iconSrc = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

  return (
    <section className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
      <div className="relative h-28 w-28 shrink-0">
        <Image
          src={iconSrc}
          alt=""
          width={112}
          height={112}
          className="drop-shadow-lg"
          priority
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium uppercase tracking-wide text-white/80">
          {data.city}, {data.country}
        </p>
        <p className="mt-1 text-6xl font-semibold tabular-nums tracking-tight text-white drop-shadow-md sm:text-7xl">
          {formatTemp(data.temp, unit)}
        </p>
        <p className="mt-2 capitalize text-lg text-white/90 drop-shadow">
          {data.description}
        </p>
        <dl className="mt-4 grid grid-cols-1 gap-2 text-sm text-white/85 sm:grid-cols-3 sm:gap-4">
          <div>
            <dt className="text-white/65">Feels like</dt>
            <dd className="font-medium tabular-nums">
              {formatTemp(data.feels_like, unit)}
            </dd>
          </div>
          <div>
            <dt className="text-white/65">Humidity</dt>
            <dd className="font-medium tabular-nums">{data.humidity}%</dd>
          </div>
          <div>
            <dt className="text-white/65">Wind</dt>
            <dd className="font-medium tabular-nums">
              {formatWindSpeed(data.wind_speed, unit)}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
