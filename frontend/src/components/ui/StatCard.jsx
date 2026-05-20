import { cn } from "@/lib/cn";
import { Card, CardBody } from "./Card";

export function StatCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconBg = "bg-accent-muted",
  iconColor = "text-primary-hover",
}) {
  const changeColors = {
    up: "text-success",
    down: "text-error",
    neutral: "text-muted",
  };

  return (
    <Card>
      <CardBody className="flex items-start justify-between gap-4 p-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-primary">
            {value}
          </p>
          {change && (
            <p className={cn("mt-1 text-xs", changeColors[changeType])}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              iconBg
            )}
          >
            <Icon className={cn("h-5 w-5", iconColor)} aria-hidden />
          </div>
        )}
      </CardBody>
    </Card>
  );
}
