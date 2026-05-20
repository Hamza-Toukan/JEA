import { cn } from "../../lib/cn";

export function Tabs({ tabs, active, onChange, className }) {
  return (
    <div
      className={cn(
        "inline-flex gap-1 rounded-lg border border-jea-border-soft bg-jea-bg p-1",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            active === tab.id
              ? "bg-jea-surface text-jea-navy shadow-jea-sm"
              : "text-jea-text-muted hover:text-jea-navy"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
