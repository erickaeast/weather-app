export function WeatherSkeleton() {
  return (
    <div className="animate-pulse space-y-8" aria-busy aria-label="Loading weather">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="h-28 w-28 shrink-0 rounded-full bg-white/20" />
        <div className="flex w-full max-w-md flex-1 flex-col gap-3">
          <div className="mx-auto h-4 w-40 rounded bg-white/20 sm:mx-0" />
          <div className="mx-auto h-16 w-56 rounded-lg bg-white/25 sm:mx-0" />
          <div className="mx-auto h-5 w-48 rounded bg-white/15 sm:mx-0" />
          <div className="mt-2 grid grid-cols-3 gap-3">
            <div className="h-10 rounded-lg bg-white/15" />
            <div className="h-10 rounded-lg bg-white/15" />
            <div className="h-10 rounded-lg bg-white/15" />
          </div>
        </div>
      </div>
      <div>
        <div className="mb-3 h-3 w-16 rounded bg-white/15" />
        <div className="flex gap-3 overflow-hidden pb-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-28 w-[4.5rem] shrink-0 rounded-2xl bg-white/15"
            />
          ))}
        </div>
      </div>
      <div>
        <div className="mb-3 h-3 w-28 rounded bg-white/15" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-14 rounded-2xl bg-white/15" />
          ))}
        </div>
      </div>
    </div>
  );
}
