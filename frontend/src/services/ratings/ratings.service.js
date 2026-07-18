import { API_ENDPOINTS } from "../api/endpoints";
import { get, post, put, del } from "../api/request";
import { APP_CONFIG } from "@/config/app";

export function listRatings(params = {}) {
  if (!APP_CONFIG.apiEnabled) {
    return Promise.resolve({ data: [], total: 0, limit: params.limit || 50, offset: params.offset || 0, success: true });
  }
  return get(API_ENDPOINTS.ratings.list, {
    params: {
      limit: params.limit != null ? String(params.limit) : undefined,
      offset: params.offset != null ? String(params.offset) : undefined,
    },
  });
}

export function getRating(id) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve(null);
  return get(API_ENDPOINTS.ratings.detail(id));
}

export function createRating(data) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve({ success: true, data: { ...data, id: "temp-id" } });
  return post(API_ENDPOINTS.ratings.create, data);
}

export function updateRating(id, data) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve({ success: true, data: { ...data, id } });
  return put(API_ENDPOINTS.ratings.update(id), data);
}

export function deleteRating(id) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve({ success: true, message: "Deleted successfully" });
  return del(API_ENDPOINTS.ratings.delete(id));
}

export const ratingsService = { listRatings, getRating, createRating, updateRating, deleteRating };
