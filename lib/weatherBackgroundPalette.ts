/** Maps OWM condition ids to visual groups (see `docs/prd.md` Animated Background Spec). */
export type WeatherConditionGroup =
  | "clear"
  | "cloudsLight"
  | "cloudsHeavy"
  | "drizzle"
  | "rain"
  | "thunder"
  | "snow"
  | "fog"
  | "default";

export function getWeatherConditionGroup(conditionId: number): WeatherConditionGroup {
  if (conditionId >= 200 && conditionId < 300) return "thunder";
  if (conditionId >= 300 && conditionId < 400) return "drizzle";
  if (conditionId >= 500 && conditionId < 600) return "rain";
  if (conditionId >= 600 && conditionId < 700) return "snow";
  if (conditionId >= 700 && conditionId < 800) return "fog";
  if (conditionId === 800) return "clear";
  if (conditionId > 800 && conditionId <= 804) {
    return conditionId <= 802 ? "cloudsLight" : "cloudsHeavy";
  }
  return "default";
}

/** Linear gradient CSS for the sky layer (light / dark theme variants from PRD). */
export function getSkyGradient(
  group: WeatherConditionGroup,
  isDay: boolean,
  theme: "light" | "dark",
): string {
  const t = theme === "dark" ? "dark" : "light";

  if (group === "clear") {
    if (isDay) {
      return t === "light"
        ? "linear-gradient(to bottom, #FDB813 0%, #87CEEB 100%)"
        : "linear-gradient(to bottom, #1a1a2e 0%, #16213e 100%)";
    }
    return t === "light"
      ? "linear-gradient(to bottom, #0f3460 0%, #533483 100%)"
      : "linear-gradient(to bottom, #0a0a1a 0%, #0f3460 100%)";
  }

  const table: Record<
    Exclude<WeatherConditionGroup, "clear">,
    { light: string; dark: string }
  > = {
    cloudsLight: {
      light: "linear-gradient(to bottom, #B0C4DE 0%, #E8EAF6 100%)",
      dark: "linear-gradient(to bottom, #2d2d44 0%, #1a1a2e 100%)",
    },
    cloudsHeavy: {
      light: "linear-gradient(to bottom, #8C9BA8 0%, #CFD8DC 100%)",
      dark: "linear-gradient(to bottom, #1c1c1c 0%, #2d2d44 100%)",
    },
    drizzle: {
      light: "linear-gradient(to bottom, #455A64 0%, #607D8B 100%)",
      dark: "linear-gradient(to bottom, #1a1a2e 0%, #0d0d1a 100%)",
    },
    rain: {
      light: "linear-gradient(to bottom, #455A64 0%, #607D8B 100%)",
      dark: "linear-gradient(to bottom, #1a1a2e 0%, #0d0d1a 100%)",
    },
    thunder: {
      light: "linear-gradient(to bottom, #263238 0%, #37474F 100%)",
      dark: "linear-gradient(to bottom, #0a0a0a 0%, #1a1a2e 100%)",
    },
    snow: {
      light: "linear-gradient(to bottom, #E3F2FD 0%, #BBDEFB 100%)",
      dark: "linear-gradient(to bottom, #1a2744 0%, #0d1b2e 100%)",
    },
    fog: {
      light: "linear-gradient(to bottom, #B0BEC5 0%, #ECEFF1 100%)",
      dark: "linear-gradient(to bottom, #1c1c1c 0%, #2d2d2d 100%)",
    },
    default: {
      light: "linear-gradient(to bottom, #90A4AE 0%, #CFD8DC 100%)",
      dark: "linear-gradient(to bottom, #1a1a2e 0%, #2d2d44 100%)",
    },
  };

  const entry = table[group];
  return t === "light" ? entry.light : entry.dark;
}

export function canvasParticlesEnabled(group: WeatherConditionGroup): boolean {
  return (
    group === "drizzle" ||
    group === "rain" ||
    group === "thunder" ||
    group === "snow"
  );
}

export function rainIntensityCap(group: WeatherConditionGroup): number {
  if (group === "drizzle") return 80;
  return 150;
}
