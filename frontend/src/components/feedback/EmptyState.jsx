import { cn } from "../../lib/cn";

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-jea-border bg-jea-bg/50 px-6 py-12 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-jea-cyan-muted">
          <Icon className="h-6 w-6 text-jea-cyan" aria-hidden />
        </div>
      )}
      <h3 className="text-sm font-semibold text-jea-navy">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-jea-text-muted">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
