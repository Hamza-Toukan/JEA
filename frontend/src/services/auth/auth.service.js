import { API_ENDPOINTS } from "../api/endpoints";
import { get, post } from "../api/request";

/**
 * @param {{ email: string, password: string }} credentials
 */
export function login(credentials) {
  return post(API_ENDPOINTS.auth.login, credentials, {
    skipAuth: true,
    skipUnauthorizedHandler: true,
  });
}

export function getCurrentUser() {
  return get(API_ENDPOINTS.auth.me);
}

/**
 * Placeholder for refresh-token rotation (future).
 * @param {string} refreshToken
 */
export function refreshSession(refreshToken) {
  return post(API_ENDPOINTS.auth.refresh, { refreshToken }, {
    skipAuth: true,
    skipUnauthorizedHandler: true,
  });
}

export const authService = {
  login,
  getCurrentUser,
  refreshSession,
};
