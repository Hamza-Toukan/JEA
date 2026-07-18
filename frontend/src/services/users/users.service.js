import { API_ENDPOINTS } from "../api/endpoints";
import { get, post, put, del } from "../api/request";
import { APP_CONFIG } from "@/config/app";

/**
 * @param {{ limit?: number, offset?: number }} [params]
 */
export function listUsers(params = {}) {
  if (!APP_CONFIG.apiEnabled) {
    return Promise.resolve({ data: [], total: 0, limit: params.limit || 50, offset: params.offset || 0, success: true });
  }

  return get(API_ENDPOINTS.users.list, {
    params: {
      limit: params.limit != null ? String(params.limit) : undefined,
      offset: params.offset != null ? String(params.offset) : undefined,
    },
  });
}

/**
 * @param {string} userId
 */
export function getUser(userId) {
  if (!APP_CONFIG.apiEnabled) {
    return Promise.resolve(null);
  }

  return get(API_ENDPOINTS.users.detail(userId));
}

/**
 * @param {Object} userData
 */
export function createUser(userData) {
  if (!APP_CONFIG.apiEnabled) {
    return Promise.resolve({ success: true, data: { ...userData, id: "temp-id" } });
  }

  return post(API_ENDPOINTS.users.create, userData);
}

/**
 * @param {string} userId
 * @param {Object} userData
 */
export function updateUser(userId, userData) {
  if (!APP_CONFIG.apiEnabled) {
    return Promise.resolve({ success: true, data: { ...userData, id: userId } });
  }

  return put(API_ENDPOINTS.users.update(userId), userData);
}

/**
 * @param {string} userId
 */
export function deleteUser(userId) {
  if (!APP_CONFIG.apiEnabled) {
    return Promise.resolve({ success: true, message: "Deleted successfully" });
  }

  return del(API_ENDPOINTS.users.delete(userId));
}

export const usersService = {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
