import { cn } from "../../lib/cn";

/**
 * Standard page wrapper — consistent max-width and vertical rhythm.
 */
export function PageContainer({ children, className, fullHeight = false }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1600px]",
        fullHeight && "flex h-full min-h-0 flex-col",
        className
      )}
    >
      {children}
    </div>
  );
}
