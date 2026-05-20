import { cn } from "../../lib/cn";

const variants = {
  primary:
    "bg-jea-navy text-white hover:bg-jea-navy-mid shadow-jea-sm border border-jea-navy",
  secondary:
    "bg-jea-surface text-jea-navy border border-jea-border hover:bg-jea-bg hover:border-jea-cyan/40",
  ghost:
    "bg-transparent text-jea-text-muted hover:bg-jea-cyan-muted hover:text-jea-navy",
  danger:
    "bg-jea-danger text-white hover:bg-red-700 border border-jea-danger",
  accent:
    "bg-jea-cyan text-white hover:bg-jea-navy-mid border border-jea-cyan",
};

const sizes = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-10 px-5 text-sm gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  icon: Icon,
  iconPosition = "start",
  ...props
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jea-cyan disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && iconPosition === "start" && <Icon className="h-4 w-4 shrink-0" />}
      {children}
      {Icon && iconPosition === "end" && <Icon className="h-4 w-4 shrink-0" />}
    </button>
  );
}
