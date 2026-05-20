import { cn } from "@/lib/cn";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { SkeletonCard } from "./Skeleton";

/**
 * Standard async UI wrapper — loading / empty / error / success.
 */
export function AsyncState({
  isLoading,
  isError,
  error,
  isEmpty,
  onRetry,
  loadingLabel,
  emptyTitle = "لا توجد بيانات",
  emptyDescription,
  emptyIcon,
  emptyAction,
  skeleton = false,
  children,
  className,
}) {
  if (isLoading) {
    if (skeleton) {
      return (
        <div className={cn("space-y-3", className)}>
          <SkeletonCard />
          <SkeletonCard />
        </div>
      );
    }
    return <LoadingState label={loadingLabel} className={className} />;
  }

  if (isError) {
    return (
      <ErrorState error={error} onRetry={onRetry} className={className} />
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
        className={className}
      />
    );
  }

  return children;
}
