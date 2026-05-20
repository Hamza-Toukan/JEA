import { cn } from "../../lib/cn";

export function PageHeader({ title, description, actions, className }) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-wrap items-start justify-between gap-4",
        className
      )}
    >
      <div className="min-w-0">
        <h2 className="text-xl font-semibold tracking-tight text-jea-navy">
          {title}
        </h2>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-jea-text-muted">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
