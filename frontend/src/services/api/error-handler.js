import { normalizeApiError } from "./errors";
import { useNotificationsStore } from "@/store/notifications.store";

/**
 * User-facing Arabic messages for common API failures.
 * @param {unknown} error
 */
export function getErrorMessage(error) {
  const normalized = normalizeApiError(error);

  if (normalized.isUnauthorized) {
    return "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.";
  }

  if (normalized.isForbidden) {
    return "ليس لديك صلاحية لتنفيذ هذا الإجراء.";
  }

  if (normalized.isNotFound) {
    return "لم يتم العثور على البيانات المطلوبة.";
  }

  if (normalized.isTimeout) {
    return "انتهت مهلة الطلب. حاول مرة أخرى.";
  }

  if (normalized.isNetwork) {
    return "تعذر الاتصال بالخادم. تحقق من الشبكة.";
  }

  return normalized.message || "حدث خطأ غير متوقع";
}

/**
 * @param {unknown} error
 * @param {{ silent?: boolean, title?: string }} [options]
 */
export function handleApiError(error, options = {}) {
  const normalized = normalizeApiError(error);
  const message = options.title || getErrorMessage(error);

  if (!options.silent) {
    useNotificationsStore.getState().addToast({
      title: message,
      variant: normalized.isUnauthorized ? "warning" : "danger",
    });
  }

  return normalized;
}
