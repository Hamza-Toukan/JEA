import { cn } from "../../lib/cn";

export function ContentWrapper({ children, className, gap = "default" }) {
  const gapClass =
    gap === "sm" ? "gap-4" : gap === "lg" ? "gap-8" : "gap-6";

  return <div className={cn("space-y-6", gapClass, className)}>{children}</div>;
}
