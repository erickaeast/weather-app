interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-400/40 bg-black/30 px-5 py-4 text-center text-red-100 shadow-lg backdrop-blur-md dark:border-red-500/40 dark:bg-black/50"
    >
      <p className="text-sm font-medium">{message}</p>
      <p className="mt-2 text-xs text-zinc-200/90">
        Try another city or check your connection and try again.
      </p>
    </div>
  );
}
