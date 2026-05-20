import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { variants } from "@/lib/variants";
import { buttonVariants } from "@/lib/component-variants";

const resolveButton = variants(buttonVariants.base, {
  variant: buttonVariants.variant,
  size: buttonVariants.size,
});

export const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    className,
    children,
    icon: Icon,
    iconPosition = "start",
    isLoading = false,
    disabled,
    type = "button",
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(resolveButton({ variant, size }), className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
      ) : (
        Icon &&
        iconPosition === "start" && <Icon className="h-4 w-4 shrink-0" aria-hidden />
      )}
      {children}
      {!isLoading && Icon && iconPosition === "end" && (
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
      )}
    </button>
  );
});
