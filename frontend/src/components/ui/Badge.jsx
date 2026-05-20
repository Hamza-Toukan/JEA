import { cn } from "../../lib/cn";

const variants = {
  default: "bg-jea-cyan-muted text-jea-navy border-jea-cyan-light",
  success: "bg-jea-success-bg text-jea-success border-emerald-200",
  warning: "bg-jea-warning-bg text-jea-warning border-amber-200",
  danger: "bg-jea-danger-bg text-jea-danger border-red-200",
  info: "bg-jea-info-bg text-jea-info border-blue-200",
  neutral: "bg-jea-bg text-jea-text-muted border-jea-border",
};

export function Badge({ variant = "default", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
