import { api } from "./api/client";

/**
 * Placeholder — wire when analytics API is available.
 * @param {Object} [params]
 * @param {string} [params.range]
 * @param {string} [token]
 */
export async function getOperationsOverview(params = {}, token) {
  // return api.get(`/api/analytics/overview?range=${params.range}`, { token });
  void params;
  void token;
  return Promise.resolve(null);
}

export const analyticsService = {
  getOperationsOverview,
};
