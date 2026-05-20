import { cn } from "../../lib/cn";

export function Card({ className, children, padding = false }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-jea-border-soft bg-jea-surface shadow-jea-sm",
        padding && "p-5",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, title, description, action, children }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 border-b border-jea-border-soft px-5 py-4",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        {title && (
          <h3 className="text-sm font-semibold text-jea-navy">{title}</h3>
        )}
        {description && (
          <p className="mt-0.5 text-xs text-jea-text-muted">{description}</p>
        )}
        {children}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, children }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

export function CardFooter({ className, children }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 border-t border-jea-border-soft px-5 py-4",
        className
      )}
    >
      {children}
    </div>
  );
}
