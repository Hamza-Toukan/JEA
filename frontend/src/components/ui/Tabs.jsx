import { cn } from "@/lib/cn";
import { tabsVariants } from "@/lib/component-variants";

export function Tabs({ tabs, active, onChange, className, "aria-label": ariaLabel }) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(tabsVariants.list, className)}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              tabsVariants.trigger,
              isActive ? tabsVariants.triggerActive : tabsVariants.triggerInactive
            )}
          >
            {tab.label}
            {tab.count != null && (
              <span className="ms-1.5 text-subtle">({tab.count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
