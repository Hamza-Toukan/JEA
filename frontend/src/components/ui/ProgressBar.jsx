import { cn } from "../../lib/cn";

export function ProgressBar({
  value,
  className,
  variant = "default",
  label,
  showValue,
}) {
  const fill =
    variant === "success"
      ? "bg-jea-success"
      : variant === "warning"
        ? "bg-jea-warning"
        : "bg-jea-cyan";

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-1 flex justify-between text-xs">
          {label && <span className="text-jea-text-muted">{label}</span>}
          {showValue && (
            <span className="font-medium text-jea-navy">{value}%</span>
          )}
        </div>
      )}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-jea-cyan-muted"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-300", fill)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
