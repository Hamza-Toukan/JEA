import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { inputVariants } from "@/lib/component-variants";

export const Input = forwardRef(function Input(
  { className, icon: Icon, error, id, "aria-label": ariaLabel, ...props },
  ref
) {
  return (
    <div className="w-full">
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
            aria-hidden
          />
        )}
        <input
          ref={ref}
          id={id}
          aria-label={ariaLabel}
          aria-invalid={error ? true : undefined}
          className={cn(
            inputVariants.field,
            Icon ? inputVariants.iconOffset : inputVariants.plainPadding,
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export const Select = forwardRef(function Select(
  { className, error, children, id, ...props },
  ref
) {
  return (
    <div className="w-full">
      <select
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(inputVariants.field, inputVariants.plainPadding, className)}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea(
  { className, error, id, rows = 4, ...props },
  ref
) {
  return (
    <div className="w-full">
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        className={cn(inputVariants.textarea, className)}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
