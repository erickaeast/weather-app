"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  canvasParticlesEnabled,
  getLoadingGradient,
  getSkyGradient,
  getWeatherConditionGroup,
  rainIntensityCap,
} from "@/lib/weatherBackgroundPalette";

/** Snow particle cap (PRD / Phase 5). Rain caps: drizzle 80, rain/thunder 150. */
const SNOW_CAP = 80;

interface WeatherBackgroundProps {
  conditionId: number;
  isDay: boolean;
  theme: "light" | "dark";
  /** Fetch in progress — neutral drifting gradient, no condition effects. */
  loading?: boolean;
}

interface RainDrop {
  x: number;
  y: number;
  len: number;
  speed: number;
}

interface Snowflake {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function usePageVisible(): boolean {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const handler = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);
  return visible;
}

function initRain(count: number, width: number, height: number): RainDrop[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    len: 10 + Math.random() * 16,
    speed: 8 + Math.random() * 12,
  }));
}

function initSnow(count: number, width: number, height: number): Snowflake[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 1.2 + Math.random() * 2.2,
    vy: 0.6 + Math.random() * 1.4,
    vx: -0.4 + Math.random() * 0.8,
  }));
}

export function WeatherBackground({
  conditionId,
  isDay,
  theme,
  loading = false,
}: WeatherBackgroundProps) {
  const group = useMemo(
    () => getWeatherConditionGroup(conditionId),
    [conditionId],
  );
  const weatherGradient = useMemo(
    () => getSkyGradient(group, isDay, theme),
    [group, isDay, theme],
  );
  const loadingGradient = useMemo(
    () => getLoadingGradient(theme),
    [theme],
  );
  const targetGradient = loading ? loadingGradient : weatherGradient;

  const reducedMotion = usePrefersReducedMotion();
  const prevTargetRef = useRef<string | null>(null);
  const skipCrossfadeRef = useRef(true);
  const [underlayGradient, setUnderlayGradient] = useState(targetGradient);
  const [overlayGradient, setOverlayGradient] = useState(targetGradient);
  const [overlayGeneration, setOverlayGeneration] = useState(0);

  useEffect(() => {
    if (skipCrossfadeRef.current) {
      skipCrossfadeRef.current = false;
      prevTargetRef.current = targetGradient;
      setUnderlayGradient(targetGradient);
      setOverlayGradient(targetGradient);
      return;
    }
    if (targetGradient === prevTargetRef.current) return;
    const prev = prevTargetRef.current ?? targetGradient;
    prevTargetRef.current = targetGradient;
    setUnderlayGradient(prev);
    setOverlayGradient(targetGradient);
    setOverlayGeneration((g) => g + 1);
  }, [targetGradient]);

  const pageVisible = usePageVisible();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<RainDrop[]>([]);
  const snowRef = useRef<Snowflake[]>([]);
  const rafRef = useRef<number>(0);
  const [lightning, setLightning] = useState(0);

  const particlesOn =
    !loading &&
    !reducedMotion &&
    pageVisible &&
    canvasParticlesEnabled(group);

  const rainMode = group !== "snow";

  useEffect(() => {
    if (loading || group !== "thunder" || reducedMotion || !pageVisible) return;
    let cancelled = false;
    let timeoutId = 0;

    const scheduleNext = () => {
      const delay = 2200 + Math.random() * 5200;
      timeoutId = window.setTimeout(() => {
        if (cancelled) return;
        setLightning(0.55);
        window.setTimeout(() => setLightning(0), 90);
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [group, reducedMotion, loading, pageVisible]);

  const resizeAndInit = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (group === "snow") {
      snowRef.current = initSnow(SNOW_CAP, w, h);
    } else {
      dropsRef.current = initRain(rainIntensityCap(group), w, h);
    }
  }, [group]);

  useEffect(() => {
    if (!particlesOn) return;
    resizeAndInit();
    window.addEventListener("resize", resizeAndInit);
    return () => window.removeEventListener("resize", resizeAndInit);
  }, [particlesOn, resizeAndInit]);

  useEffect(() => {
    if (!particlesOn) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    const paintRain = (w: number, h: number) => {
      const drops = dropsRef.current;
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1.2;
      for (const d of drops) {
        d.y += d.speed;
        d.x += -0.15 + Math.random() * 0.3;
        if (d.y > h + d.len) {
          d.y = -d.len;
          d.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1.5, d.y + d.len);
        ctx.stroke();
      }
    };

    const paintSnow = (w: number, h: number) => {
      const flakes = snowRef.current;
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      for (const f of flakes) {
        f.y += f.vy;
        f.x += f.vx + Math.sin(f.y * 0.01) * 0.15;
        if (f.y > h + 4) {
          f.y = -4;
          f.x = Math.random() * w;
        }
        if (f.x < -4) f.x = w + 4;
        if (f.x > w + 4) f.x = -4;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      if (!running) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      if (rainMode) paintRain(w, h);
      else paintSnow(w, h);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [particlesOn, rainMode]);

  const showClouds =
    !loading &&
    !reducedMotion &&
    (group === "cloudsLight" ||
      group === "cloudsHeavy" ||
      group === "thunder");

  const showFog = !loading && !reducedMotion && group === "fog";

  const showSun =
    !loading && !reducedMotion && group === "clear" && isDay;
  const showMoon =
    !loading && !reducedMotion && group === "clear" && !isDay;
  const showStars =
    !loading && !reducedMotion && group === "clear" && !isDay;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute inset-0 z-0"
        style={{ background: underlayGradient }}
      />
      <div
        key={overlayGeneration}
        className={`absolute inset-0 z-[1] ${
          overlayGeneration === 0 || reducedMotion ? "" : "wx-bg-enter"
        } ${loading && !reducedMotion ? "wx-loading-drift" : ""}`}
        style={{ background: overlayGradient }}
      />

      {showStars && (
        <div className="absolute inset-0">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className="wx-twinkle absolute will-change-transform rounded-full bg-white"
              style={{
                width: 1 + (i % 3),
                height: 1 + (i % 3),
                top: `${(i * 97) % 55}%`,
                left: `${(i * 53) % 92}%`,
                opacity: 0.5 + (i % 5) * 0.1,
                animationDelay: `${(i % 12) * 0.28}s`,
              }}
            />
          ))}
        </div>
      )}

      {showSun && (
        <div
          className="wx-sun-glow absolute -right-[10%] top-[8%] h-40 w-40 will-change-transform rounded-full bg-amber-300/95 blur-md sm:h-48 sm:w-48"
          style={{ boxShadow: "0 0 80px 28px rgba(253, 184, 19, 0.55)" }}
        />
      )}

      {showMoon && (
        <div className="absolute left-[18%] top-[12%] h-24 w-24 will-change-transform rounded-full bg-slate-200/90 blur-sm sm:h-28 sm:w-28" />
      )}

      {showClouds && (
        <>
          <div
            className={`wx-cloud-a absolute -left-[20%] top-[18%] h-28 w-[55%] will-change-transform rounded-full bg-white/35 blur-2xl ${
              group === "cloudsHeavy" ? "opacity-70" : "opacity-50"
            }`}
          />
          <div
            className={`wx-cloud-b absolute -right-[25%] top-[30%] h-36 w-[60%] will-change-transform rounded-full bg-slate-300/40 blur-3xl ${
              group === "cloudsHeavy" ? "opacity-65" : "opacity-45"
            }`}
          />
          <div
            className={`wx-cloud-a absolute left-[5%] top-[42%] h-24 w-[45%] will-change-transform rounded-full bg-white/25 blur-2xl ${
              group === "thunder" ? "opacity-55" : "opacity-35"
            }`}
            style={{ animationDuration: "62s" }}
          />
        </>
      )}

      {showFog && (
        <>
          <div className="wx-fog-layer absolute inset-x-0 top-[20%] h-1/4 will-change-transform bg-gradient-to-b from-slate-200/45 to-transparent blur-3xl dark:from-slate-900/50" />
          <div
            className="wx-fog-layer absolute inset-x-0 top-[35%] h-1/3 will-change-transform bg-gradient-to-b from-slate-100/35 to-transparent blur-3xl dark:from-slate-800/45"
            style={{ animationDelay: "-12s" }}
          />
          <div
            className="wx-fog-layer absolute inset-x-0 bottom-[15%] h-1/4 will-change-transform bg-gradient-to-t from-slate-200/40 to-transparent blur-3xl dark:from-slate-900/45"
            style={{ animationDelay: "-5s" }}
          />
        </>
      )}

      {particlesOn && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-[1]"
          aria-hidden
        />
      )}

      {!loading && group === "thunder" && lightning > 0 && (
        <div
          className="absolute inset-0 z-[2] bg-white"
          style={{ opacity: lightning }}
        />
      )}
    </div>
  );
}
