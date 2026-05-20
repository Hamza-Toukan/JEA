import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { iconButtonVariants } from "@/lib/component-variants";

export const IconButton = forwardRef(function IconButton(
  { className, children, "aria-label": ariaLabel, type = "button", disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        iconButtonVariants.base,
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
