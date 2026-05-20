import { cn } from "../../lib/cn";

export function Tabs({ tabs, active, onChange, className, "aria-label": ariaLabel }) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex gap-1 rounded-lg border border-jea-border-soft bg-jea-bg p-1",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors jea-focus-ring",
            active === tab.id
              ? "bg-jea-surface text-jea-navy shadow-jea-sm"
              : "text-jea-text-muted hover:text-jea-navy"
          )}
        >
          {tab.label}
          {tab.count != null && (
            <span className="ms-1.5 text-jea-text-subtle">({tab.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}
