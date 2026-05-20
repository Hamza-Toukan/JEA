import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";
import { variants } from "../../lib/variants";

const buttonVariants = variants(
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150 jea-focus-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variant: {
      primary:
        "bg-jea-navy text-white hover:bg-jea-navy-mid shadow-jea-sm border border-jea-navy",
      secondary:
        "bg-jea-surface text-jea-navy border border-jea-border hover:bg-jea-bg hover:border-jea-cyan/40",
      ghost:
        "bg-transparent text-jea-text-muted hover:bg-jea-cyan-muted hover:text-jea-navy border border-transparent",
      danger:
        "bg-jea-danger text-white hover:bg-red-700 border border-jea-danger",
      accent:
        "bg-jea-cyan text-white hover:bg-jea-navy-mid border border-jea-cyan",
    },
    size: {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-9 px-4 text-sm gap-2",
      lg: "h-10 px-5 text-sm gap-2",
    },
  }
);

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  icon: Icon,
  iconPosition = "start",
  isLoading = false,
  disabled,
  ...props
}) {
  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
      ) : (
        Icon &&
        iconPosition === "start" && <Icon className="h-4 w-4 shrink-0" aria-hidden />
      )}
      {children}
      {!isLoading && Icon && iconPosition === "end" && (
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
      )}
    </button>
  );
}
