import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/services/api/error-handler";

export function ErrorState({
  error,
  title = "تعذر تحميل البيانات",
  description,
  onRetry,
  className,
}) {
  const message = description ?? (error ? getErrorMessage(error) : undefined);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-error/20 bg-error-subtle/30 px-6 py-10 text-center",
        className
      )}
      role="alert"
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-error-subtle">
        <AlertCircle className="h-5 w-5 text-error" aria-hidden />
      </div>
      <h3 className="text-sm font-semibold text-primary">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-xs text-muted">{message}</p>}
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
}
