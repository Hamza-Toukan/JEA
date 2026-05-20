import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

/**
 * Standard paginated list query — keeps page state co-located with query.
 *
 * @template TData
 * @param {Object} config
 * @param {readonly unknown[]} config.queryKeyBase
 * @param {(params: { page: number; limit: number }) => Promise<TData>} config.queryFn
 * @param {number} [config.initialPage]
 * @param {number} [config.pageSize]
 * @param {boolean} [config.enabled]
 */
export function usePaginatedQuery({
  queryKeyBase,
  queryFn,
  initialPage = 1,
  pageSize = 25,
  enabled = true,
  ...queryOptions
}) {
  const [page, setPage] = useState(initialPage);

  const query = useQuery({
    queryKey: [...queryKeyBase, { page, limit: pageSize }],
    queryFn: () => queryFn({ page, limit: pageSize }),
    enabled,
    placeholderData: (previous) => previous,
    ...queryOptions,
  });

  const nextPage = useCallback(() => setPage((p) => p + 1), []);
  const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const goToPage = useCallback((p) => setPage(Math.max(1, p)), []);

  return {
    ...query,
    page,
    pageSize,
    setPage,
    nextPage,
    prevPage,
    goToPage,
  };
}
