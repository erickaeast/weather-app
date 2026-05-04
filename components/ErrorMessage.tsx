interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-300/80 bg-red-50/95 px-5 py-4 text-center shadow-md backdrop-blur-sm transition-[background-color,border-color,color] duration-300 dark:border-red-500/45 dark:bg-red-950/40 dark:shadow-lg"
    >
      <p className="text-sm font-semibold text-red-900 dark:text-red-100">
        {message}
      </p>
      <p className="mt-2 text-xs text-red-800/90 dark:text-red-200/90">
        Try another city or check your connection and try again.
      </p>
    </div>
  );
}
