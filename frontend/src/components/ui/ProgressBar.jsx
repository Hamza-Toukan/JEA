import { cn } from "../../lib/cn";

export function ProgressBar({ value, className, variant = "default" }) {
  const fill =
    variant === "success"
      ? "bg-jea-success"
      : variant === "warning"
        ? "bg-jea-warning"
        : "bg-jea-cyan";

  return (
    <div
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-jea-cyan-muted",
        className
      )}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-300", fill)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
