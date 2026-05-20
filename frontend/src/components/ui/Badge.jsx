import { cn } from "@/lib/cn";
import { variants } from "@/lib/variants";
import { badgeVariants } from "@/lib/component-variants";

const resolveBadge = variants(badgeVariants.base, {
  variant: badgeVariants.variant,
});

export function Badge({ variant = "default", className, children }) {
  return (
    <span className={cn(resolveBadge({ variant }), className)}>{children}</span>
  );
}
