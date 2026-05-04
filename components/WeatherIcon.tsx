import Image from "next/image";

interface WeatherIconProps {
  iconCode: string;
  width: number;
  height: number;
  /** Passed to `next/image` `sizes` for responsive loading. */
  sizes: string;
  priority?: boolean;
  className?: string;
  /** If set, used as accessible name; otherwise icon is decorative (`aria-hidden`). */
  label?: string;
}

/** OpenWeatherMap condition icon via `next/image` (remotePatterns in `next.config.ts`). */
export function WeatherIcon({
  iconCode,
  width,
  height,
  sizes,
  priority = false,
  className,
  label,
}: WeatherIconProps) {
  const src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const decorative = label == null || label === "";

  return (
    <Image
      src={src}
      alt={decorative ? "" : label}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      className={className}
      aria-hidden={decorative}
    />
  );
}
