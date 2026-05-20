import { cn } from "@/lib/cn";

export function ProgressBar({
  value,
  className,
  variant = "default",
  label,
  showValue,
}) {
  const fill =
    variant === "success"
      ? "bg-success"
      : variant === "warning"
        ? "bg-warning"
        : "bg-accent";

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-1 flex justify-between text-xs">
          {label && <span className="text-muted">{label}</span>}
          {showValue && (
            <span className="font-medium text-primary">{value}%</span>
          )}
        </div>
      )}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-accent-muted"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-[var(--duration-normal)]", fill)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
