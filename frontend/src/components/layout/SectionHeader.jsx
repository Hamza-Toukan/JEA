import { cn } from "@/lib/cn";

/**
 * Page section title block — consistent hierarchy across features.
 */
export function SectionHeader({
  title,
  description,
  actions,
  className,
  size = "default",
  as: Tag = "h1",
}) {
  return (
    <header
      className={cn(
        "mb-6 flex flex-wrap items-start justify-between gap-4",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <Tag
          className={cn(
            "font-semibold tracking-tight text-primary",
            size === "lg" ? "text-2xl" : "text-xl"
          )}
        >
          {title}
        </Tag>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      )}
    </header>
  );
}
