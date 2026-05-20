import { cn } from "../../lib/cn";

/**
 * Placeholder until chart library (e.g. Recharts) is integrated.
 */
export function ChartPlaceholder({ height = 192, className, children }) {
  return (
    <div
      className={cn(
        "jea-gradient-accent flex items-center justify-center rounded-lg border border-jea-border-soft text-xs text-jea-text-subtle",
        className
      )}
      style={{ minHeight: height }}
    >
      {children || "منطقة الرسم البياني"}
    </div>
  );
}
