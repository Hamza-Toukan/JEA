import { cn } from "../../lib/cn";

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}) {
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-xs font-medium text-muted"
        >
          {label}
          {required && (
            <span className="text-error ms-0.5" aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-[11px] text-subtle">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
