import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useNotificationsStore } from "@/store";
import { alertVariants } from "@/lib/component-variants";

const variantStyles = {
  info: `${alertVariants.base} ${alertVariants.variant.info}`,
  success: `${alertVariants.base} ${alertVariants.variant.success}`,
  warning: `${alertVariants.base} ${alertVariants.variant.warning}`,
  danger: `${alertVariants.base} ${alertVariants.variant.danger}`,
};

export function Toaster() {
  const toasts = useNotificationsStore((s) => s.toasts);
  const dismissToast = useNotificationsStore((s) => s.dismissToast);

  if (!toasts.length) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-4 top-4 z-[var(--z-toast)] flex flex-col items-end gap-2 sm:inset-x-auto sm:end-6 sm:top-6"
      aria-live="polite"
      aria-relevant="additions"
    >
      {toasts.map((toast) => {
        const variant = toast.variant ?? "info";

        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-md",
              variantStyles[variant] ?? variantStyles.info
            )}
          >
            <div className="min-w-0 flex-1 text-start">
              <p className="text-sm font-medium">{toast.title}</p>
              {toast.message && (
                <p className="mt-0.5 text-xs opacity-90">{toast.message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 rounded p-1 opacity-70 transition-opacity hover:opacity-100"
              aria-label="إغلاق"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        );
      })}
    </div>
  );
}
