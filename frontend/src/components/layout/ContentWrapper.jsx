import { cn } from "@/lib/cn";

/**
 * Vertical stack for page sections with consistent gap.
 */
export function ContentWrapper({ children, className, gap = "default" }) {
  const gapClass =
    gap === "sm"
      ? "gap-4"
      : gap === "lg"
        ? "gap-8"
        : "gap-[var(--layout-section-gap)]";

  return (
    <div className={cn("flex flex-col", gapClass, className)}>{children}</div>
  );
}
