import { cn } from "../../lib/cn";

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
}) {
  if (!data?.length) {
    return (
      <p className="py-8 text-center text-sm text-jea-text-muted">{emptyMessage}</p>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-jea-border-soft bg-jea-bg/80 text-xs text-jea-text-muted">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn("px-4 py-3 text-start font-medium", col.className)}
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
                className={cn(
                  "border-b border-jea-border-soft transition-colors",
                  onRowClick && "cursor-pointer",
                  selected ? "bg-jea-cyan-muted/40" : "hover:bg-jea-bg"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-4 py-3 text-jea-navy", col.className)}
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
