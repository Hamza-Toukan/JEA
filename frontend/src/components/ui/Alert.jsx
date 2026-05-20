import { cn } from "../../lib/cn";
import { AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react";

const config = {
  info: {
    icon: Info,
    box: "border-blue-200 bg-jea-info-bg text-jea-info",
    iconColor: "text-jea-cyan",
  },
  warning: {
    icon: AlertTriangle,
    box: "border-amber-200 bg-jea-warning-bg text-amber-900",
    iconColor: "text-jea-warning",
  },
  danger: {
    icon: XCircle,
    box: "border-red-200 bg-jea-danger-bg text-red-900",
    iconColor: "text-jea-danger",
  },
  success: {
    icon: CheckCircle2,
    box: "border-emerald-200 bg-jea-success-bg text-emerald-900",
    iconColor: "text-jea-success",
  },
};

export function Alert({ variant = "info", title, children, className }) {
  const { icon: Icon, box, iconColor } = config[variant];

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border px-4 py-3 text-sm",
        box,
        className
      )}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", iconColor)} />
      <div className="min-w-0">
        {title && <p className="font-medium">{title}</p>}
        {children && (
          <p className={cn("text-xs opacity-90", title && "mt-1")}>{children}</p>
        )}
      </div>
    </div>
  );
}
