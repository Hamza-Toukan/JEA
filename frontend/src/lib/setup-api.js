import { setAuthTokenGetter, setUnauthorizedHandler } from "@/services/api/interceptors";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationsStore } from "@/store/notifications.store";

/**
 * Wire API interceptors to global auth state (call once at app boot).
 */
export function setupApiLayer() {
  setAuthTokenGetter(() => useAuthStore.getState().token);

  setUnauthorizedHandler(() => {
    const { clearSession, isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) return;

    clearSession();

    useNotificationsStore.getState().addToast({
      title: "انتهت صلاحية الجلسة",
      message: "يرجى تسجيل الدخول مرة أخرى.",
      variant: "warning",
    });
  });
}
