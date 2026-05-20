import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "./Button";

export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "start",
  className,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        className="absolute inset-0 bg-jea-navy/30"
        aria-label="إغلاق"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 flex h-full w-full max-w-md flex-col border-jea-border-soft bg-jea-surface shadow-jea-lg",
          side === "start" ? "border-s ms-auto" : "border-e",
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-jea-border-soft px-5 py-4">
          <h2 className="text-base font-semibold text-jea-navy">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="إغلاق">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </div>
  );
}
