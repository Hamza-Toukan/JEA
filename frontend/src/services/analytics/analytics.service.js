import { API_ENDPOINTS } from "../api/endpoints";
import { get } from "../api/request";
import { APP_CONFIG } from "@/config/app";

/**
 * Fetch dashboard statistics
 */
export function getAnalyticsOverview() {
  if (!APP_CONFIG.apiEnabled) {
    return Promise.resolve(null);
  }

  return get(API_ENDPOINTS.analytics.overview);
}

export const analyticsService = {
  getAnalyticsOverview,
};
