import { API_ENDPOINTS } from "../api/endpoints";
import { get } from "../api/request";
import { APP_CONFIG } from "@/config/app";

/**
 * @param {{ page?: number, limit?: number }} [params]
 */
export function listWorkflows(params = {}) {
  if (!APP_CONFIG.apiEnabled) {
    return Promise.resolve({ items: [], total: 0 });
  }

  return get(API_ENDPOINTS.workflows.list, {
    params: {
      page: params.page != null ? String(params.page) : undefined,
      limit: params.limit != null ? String(params.limit) : undefined,
    },
  });
}

/**
 * @param {string} workflowId
 */
export function getWorkflow(workflowId) {
  if (!APP_CONFIG.apiEnabled) {
    return Promise.resolve(null);
  }

  return get(API_ENDPOINTS.workflows.detail(workflowId));
}

export const workflowsService = {
  listWorkflows,
  getWorkflow,
};
