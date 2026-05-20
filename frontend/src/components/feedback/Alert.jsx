import { AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { variants } from "@/lib/variants";
import { alertVariants } from "@/lib/component-variants";

const icons = {
  info: Info,
  warning: AlertTriangle,
  danger: XCircle,
  success: CheckCircle2,
};

const resolveAlert = variants(alertVariants.base, {
  variant: alertVariants.variant,
});

export function Alert({
  variant = "info",
  title,
  children,
  className,
  role = "status",
}) {
  const Icon = icons[variant];

  return (
    <div role={role} className={cn(resolveAlert({ variant }), className)}>
      <Icon
        className={cn("mt-0.5 h-4 w-4 shrink-0", alertVariants.icon[variant])}
        aria-hidden
      />
      <div className="min-w-0">
        {title && <p className="font-medium">{title}</p>}
        {children && (
          <p className={cn("text-xs opacity-90", title && "mt-1")}>{children}</p>
        )}
      </div>
    </div>
  );
}
