import { useCallback } from "react";
import { useNotificationsStore } from "@/store";

/**
 * Toast API for mutations and imperative feedback.
 */
export function useToast() {
  const addToast = useNotificationsStore((s) => s.addToast);
  const dismissToast = useNotificationsStore((s) => s.dismissToast);

  const toast = useCallback(
    (options) => addToast(options),
    [addToast]
  );

  return { toast, dismissToast };
}
