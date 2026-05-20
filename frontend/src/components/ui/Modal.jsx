import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "./Button";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
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

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-jea-navy/40 backdrop-blur-[2px]"
        aria-label="إغلاق"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          "relative z-10 w-full rounded-xl border border-jea-border-soft bg-jea-surface shadow-jea-lg",
          sizes[size],
          className
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-jea-border-soft px-5 py-4">
          <div>
            <h2 id="modal-title" className="text-base font-semibold text-jea-navy">
              {title}
            </h2>
            {description && (
              <p className="mt-0.5 text-xs text-jea-text-muted">{description}</p>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="إغلاق">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-jea-border-soft px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
