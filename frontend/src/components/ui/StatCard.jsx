import { cn } from "../../lib/cn";
import { Card, CardBody } from "./Card";

export function StatCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconBg = "bg-jea-cyan-muted",
  iconColor = "text-jea-navy-mid",
}) {
  const changeColors = {
    up: "text-jea-success",
    down: "text-jea-danger",
    neutral: "text-jea-text-muted",
  };

  return (
    <Card>
      <CardBody className="flex items-start justify-between gap-4 p-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-jea-text-muted">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-jea-navy">
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
