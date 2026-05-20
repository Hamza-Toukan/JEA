import { cn } from "@/lib/cn";
import { cardVariants } from "@/lib/component-variants";

export function Card({ className, children, padding = false }) {
  return (
    <div
      className={cn(
        cardVariants.base,
        padding && "p-[var(--layout-card-padding)]",
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
        "flex flex-wrap items-start justify-between gap-3",
        cardVariants.header,
        className
      )}
    >
      <div className="min-w-0 flex-1">
        {title && (
          <h3 className="text-sm font-semibold text-primary">{title}</h3>
        )}
        {description && (
          <p className="mt-0.5 text-xs text-muted">{description}</p>
        )}
        {children}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, children }) {
  return <div className={cn(cardVariants.body, className)}>{children}</div>;
}

export function CardFooter({ className, children }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        cardVariants.footer,
        className
      )}
    >
      {children}
    </div>
  );
}
