import { useEffect, useId } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "start",
  className,
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0" style={{ zIndex: "var(--z-drawer)" }}>
      <button
        type="button"
        className="absolute inset-0 bg-[var(--color-overlay)]"
        aria-label="إغلاق"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "absolute top-0 flex h-full w-full max-w-md flex-col bg-surface shadow-jea-lg",
          side === "start"
            ? "inset-inline-end-0 border-s border-border-subtle"
            : "inset-inline-start-0 border-e border-border-subtle",
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <h2 id={titleId} className="text-base font-semibold text-primary">
            {title}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="إغلاق">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </div>
  );
}
