import { API_ENDPOINTS } from "../api/endpoints";
import { get, post, put, del } from "../api/request";
import { APP_CONFIG } from "@/config/app";

export function listSessions(params = {}) {
  if (!APP_CONFIG.apiEnabled) {
    return Promise.resolve({ data: [], total: 0, limit: params.limit || 50, offset: params.offset || 0, success: true });
  }
  return get(API_ENDPOINTS.sessions.list, {
    params: {
      limit: params.limit != null ? String(params.limit) : undefined,
      offset: params.offset != null ? String(params.offset) : undefined,
    },
  });
}

export function getSession(id) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve(null);
  return get(API_ENDPOINTS.sessions.detail(id));
}

export function createSession(data) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve({ success: true, data: { ...data, id: "temp-id" } });
  return post(API_ENDPOINTS.sessions.create, data);
}

export function updateSession(id, data) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve({ success: true, data: { ...data, id } });
  return put(API_ENDPOINTS.sessions.update(id), data);
}

export function deleteSession(id) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve({ success: true, message: "Deleted successfully" });
  return del(API_ENDPOINTS.sessions.delete(id));
}

export const sessionsService = { listSessions, getSession, createSession, updateSession, deleteSession };
