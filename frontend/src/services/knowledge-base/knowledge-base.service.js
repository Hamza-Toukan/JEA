import { API_ENDPOINTS } from "../api/endpoints";
import { get } from "../api/request";
import { APP_CONFIG } from "@/config/app";

/**
 * @param {{ page?: number, limit?: number, search?: string, category?: string }} [params]
 */
export function listArticles(params = {}) {
  if (!APP_CONFIG.apiEnabled) {
    return Promise.resolve({ items: [], total: 0 });
  }

  return get(API_ENDPOINTS.knowledgeBase.list, {
    params: {
      page: params.page != null ? String(params.page) : undefined,
      limit: params.limit != null ? String(params.limit) : undefined,
      search: params.search,
      category: params.category,
    },
  });
}

/**
 * @param {string} articleId
 */
export function getArticle(articleId) {
  if (!APP_CONFIG.apiEnabled) {
    return Promise.resolve(null);
  }

  return get(API_ENDPOINTS.knowledgeBase.detail(articleId));
}

export const knowledgeBaseService = {
  listArticles,
  getArticle,
};
