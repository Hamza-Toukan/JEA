import { ApiError, parseErrorResponse } from "./errors";

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * @typedef {Object} RequestOptions
 * @property {Record<string, string>} [headers]
 * @property {string} [token]
 * @property {AbortSignal} [signal]
 */

/**
 * @param {string} path
 * @param {RequestInit & RequestOptions} [options]
 */
export async function apiRequest(path, options = {}) {
  const { token, headers: extraHeaders, signal, ...init } = options;

  const headers = new Headers(extraHeaders);

  if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = path.startsWith("http") ? path : `${DEFAULT_BASE_URL}${path}`;

  const response = await fetch(url, {
    ...init,
    headers,
    signal,
    credentials: "include",
  });

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export const api = {
  get: (path, options) => apiRequest(path, { ...options, method: "GET" }),
  post: (path, body, options) =>
    apiRequest(path, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: (path, body, options) =>
    apiRequest(path, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: (path, options) => apiRequest(path, { ...options, method: "DELETE" }),
};
