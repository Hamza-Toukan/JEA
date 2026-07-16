import { setAuthTokenGetter, setUnauthorizedHandler, addRequestInterceptor } from "@/services/api/interceptors";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationsStore } from "@/store/notifications.store";

/**
 * Wire API interceptors to global auth state (call once at app boot).
 */
export function setupApiLayer() {
  setAuthTokenGetter(() => useAuthStore.getState().token);

  addRequestInterceptor((config) => {
    config.headers = {
      ...config.headers,
      "ngrok-skip-browser-warning": "69420",
    };
    return config;
  });

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
