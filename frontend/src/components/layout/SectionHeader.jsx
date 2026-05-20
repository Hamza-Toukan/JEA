import { cn } from "../../lib/cn";

/**
 * Page-level title block (use inside PageContainer).
 */
export function SectionHeader({ title, description, actions, className, size = "default" }) {
  return (
    <header
      className={cn(
        "mb-6 flex flex-wrap items-start justify-between gap-4",
        className
      )}
    >
      <div className="min-w-0">
        <h1
          className={cn(
            "font-semibold tracking-tight text-jea-navy",
            size === "lg" ? "text-2xl" : "text-xl"
          )}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-jea-text-muted">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      )}
    </header>
  );
}
