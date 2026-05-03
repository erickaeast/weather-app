/** Normalized current conditions (all temperatures in °C). */
export interface WeatherCurrent {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  city: string;
  country: string;
  /** OWM weather condition id (e.g. 800 = clear) — used by animated background. */
  conditionId: number;
  /** Unix seconds — local “now” for the reported location context. */
  dt: number;
  sunrise: number;
  sunset: number;
}

export interface HourlyItem {
  /** Unix seconds */
  time: number;
  temp: number;
  icon: string;
  description: string;
}

export interface DailyItem {
  /** Unix seconds — representative timestamp for the calendar day (used for labels). */
  date: number;
  temp_min: number;
  temp_max: number;
  icon: string;
  description: string;
}

export interface WeatherData {
  current: WeatherCurrent;
  hourly: HourlyItem[];
  daily: DailyItem[];
}
