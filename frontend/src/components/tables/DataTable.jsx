import { cn } from "@/lib/cn";
import { tableVariants } from "@/lib/component-variants";
import { EmptyState } from "@/components/feedback";

/**
 * @typedef {Object} Column
 * @property {string} key
 * @property {string} header
 * @property {string} [className]
 * @property {(row: object) => React.ReactNode} [render]
 */

export function DataTable({
  columns,
  data,
  keyField = "id",
  onRowClick,
  selectedKey,
  emptyMessage = "لا توجد بيانات",
  className,
  "aria-label": ariaLabel,
}) {
  if (!data?.length) {
    return (
      <EmptyState
        title={emptyMessage}
        className="border-none bg-transparent py-8"
      />
    );
  }

  return (
    <div className={cn("overflow-x-auto -mx-1 px-1", className)}>
      <table className="w-full min-w-[480px] text-sm" aria-label={ariaLabel}>
        <thead>
          <tr className={tableVariants.head}>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(tableVariants.headCell, col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const key = row[keyField];
            const selected = selectedKey != null && selectedKey === key;

            return (
              <tr
                key={key}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onRowClick(row);
                        }
                      }
                    : undefined
                }
                tabIndex={onRowClick ? 0 : undefined}
                className={cn(
                  tableVariants.row,
                  onRowClick && tableVariants.rowInteractive,
                  selected && tableVariants.rowSelected
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(tableVariants.cell, col.className)}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
