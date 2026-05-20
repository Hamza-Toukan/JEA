import { cn } from "../../lib/cn";

export function Input({ className, icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-jea-text-subtle" />
      )}
      <input
        className={cn(
          "h-9 w-full rounded-lg border border-jea-border bg-jea-surface text-sm text-jea-text placeholder:text-jea-text-subtle transition-colors focus:border-jea-cyan focus:outline-none focus:ring-2 focus:ring-jea-cyan/20",
          Icon && "ps-9 pe-3",
          !Icon && "px-3",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        "h-9 rounded-lg border border-jea-border bg-jea-surface px-3 text-sm text-jea-text focus:border-jea-cyan focus:outline-none focus:ring-2 focus:ring-jea-cyan/20",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "min-h-[100px] w-full resize-y rounded-lg border border-jea-border bg-jea-surface px-3 py-2 text-sm text-jea-text placeholder:text-jea-text-subtle focus:border-jea-cyan focus:outline-none focus:ring-2 focus:ring-jea-cyan/20",
        className
      )}
      {...props}
    />
  );
}
