import { cn } from "../../lib/cn";

const fieldClass =
  "h-9 w-full rounded-lg border border-jea-border bg-jea-surface text-sm text-jea-text placeholder:text-jea-text-subtle transition-colors focus:border-jea-cyan focus:outline-none focus:ring-2 focus:ring-jea-cyan/20 disabled:cursor-not-allowed disabled:opacity-50";

export function Input({
  className,
  icon: Icon,
  error,
  id,
  "aria-label": ariaLabel,
  ...props
}) {
  return (
    <div className="w-full">
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-jea-text-subtle"
            aria-hidden
          />
        )}
        <input
          id={id}
          aria-label={ariaLabel}
          aria-invalid={error ? true : undefined}
          className={cn(fieldClass, Icon && "ps-9 pe-3", !Icon && "px-3", className)}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-jea-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Select({ className, error, children, id, ...props }) {
  return (
    <div className="w-full">
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(fieldClass, "px-3", className)}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-xs text-jea-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Textarea({ className, error, id, rows = 4, ...props }) {
  return (
    <div className="w-full">
      <textarea
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        className={cn(
          "min-h-[100px] w-full resize-y rounded-lg border border-jea-border bg-jea-surface px-3 py-2 text-sm text-jea-text placeholder:text-jea-text-subtle transition-colors focus:border-jea-cyan focus:outline-none focus:ring-2 focus:ring-jea-cyan/20 disabled:opacity-50",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-jea-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
