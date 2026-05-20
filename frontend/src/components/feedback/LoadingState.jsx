import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export function LoadingState({
  label = "جاري التحميل...",
  className,
  size = "md",
}) {
  const iconSize =
    size === "sm" ? "h-5 w-5" : size === "lg" ? "h-10 w-10" : "h-8 w-8";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 text-muted",
        className
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2 className={cn(iconSize, "animate-spin text-accent")} aria-hidden />
      <p className="text-sm">{label}</p>
    </div>
  );
}
