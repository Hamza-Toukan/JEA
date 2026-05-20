import { API_ENDPOINTS } from "../api/endpoints";
import { get } from "../api/request";
import { APP_CONFIG } from "@/config/app";

/**
 * @param {{ range?: string }} [params]
 */
export function getOperationsOverview(params = {}) {
  if (!APP_CONFIG.apiEnabled) {
    return Promise.resolve(null);
  }

  return get(API_ENDPOINTS.analytics.operations, {
    params: { range: params.range },
  });
}

/**
 * @param {{ range?: string }} [params]
 */
export function getAnalyticsOverview(params = {}) {
  if (!APP_CONFIG.apiEnabled) {
    return Promise.resolve(null);
  }

  return get(API_ENDPOINTS.analytics.overview, {
    params: { range: params.range },
  });
}

export const analyticsService = {
  getOperationsOverview,
  getAnalyticsOverview,
};
