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

/**
 * @param {string} username
 * @param {string} otp
 */
export function verifyOtp(username, otp) {
  return post(API_ENDPOINTS.auth.verifyOtp, { username, otp }, {
    skipAuth: true,
    skipUnauthorizedHandler: true,
  });
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
  verifyOtp,
  refreshSession,
};
