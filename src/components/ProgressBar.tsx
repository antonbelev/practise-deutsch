interface Props {
  value: number; // 0..1
  className?: string;
}

export function ProgressBar({ value, className = "" }: Props) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-surface-2 ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
