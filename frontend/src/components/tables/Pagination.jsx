import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}) {
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 text-xs text-jea-text-muted",
        className
      )}
    >
      <span>
        عرض {from}–{to} من {totalItems}
      </span>
      <div className="flex gap-1">
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          السابق
        </Button>
        <Button variant="primary" size="sm" disabled>
          {page}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          التالي
        </Button>
      </div>
    </div>
  );
}
