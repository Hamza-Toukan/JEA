import { cn } from "@/lib/cn";

/**
 * Standard page wrapper — max width, vertical rhythm, optional full-height layouts.
 */
export function PageContainer({ children, className, fullHeight = false }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1600px]",
        fullHeight && "flex min-h-0 flex-1 flex-col",
        className
      )}
    >
      {children}
    </div>
  );
}
