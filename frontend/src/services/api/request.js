import { APP_CONFIG } from "@/config/app";
import { ApiError, ERROR_CODES, normalizeApiError, parseErrorResponse } from "./errors";
import {
  handleUnauthorized,
  runErrorInterceptors,
  runRequestInterceptors,
} from "./interceptors";

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * @typedef {Object} RequestConfig
 * @property {string} url
 * @property {string} [method]
 * @property {unknown} [body]
 * @property {Record<string, string>} [headers]
 * @property {Record<string, string>} [params]
 * @property {string} [token]
 * @property {AbortSignal} [signal]
 * @property {number} [timeoutMs]
 * @property {number} [retry] — reserved for future retry support
 * @property {boolean} [skipAuth]
 * @property {boolean} [skipUnauthorizedHandler]
 */

/**
 * @param {string} path
 * @param {Record<string, string>} [params]
 */
export function buildUrl(path, params) {
  const base = path.startsWith("http") ? path : `${DEFAULT_BASE_URL}${path}`;
  if (!params || Object.keys(params).length === 0) return base;

  const url = new URL(base, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return path.startsWith("http") ? url.toString() : `${url.pathname}${url.search}`;
}

/**
 * Core HTTP request — all domain services use this.
 * @param {RequestConfig} config
 */
export async function request(config) {
  const resolved = await runRequestInterceptors({
    method: "GET",
    timeoutMs: APP_CONFIG.requestTimeoutMs,
    ...config,
  });

  const {
    url,
    method = "GET",
    body,
    headers = {},
    params,
    signal: externalSignal,
    timeoutMs = APP_CONFIG.requestTimeoutMs,
    skipUnauthorizedHandler = false,
  } = resolved;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  if (externalSignal) {
    externalSignal.addEventListener("abort", () => controller.abort(), {
      once: true,
    });
  }

  const requestHeaders = new Headers(headers);

  if (
    body != null &&
    !(body instanceof FormData) &&
    !requestHeaders.has("Content-Type")
  ) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const init = {
    method,
    headers: requestHeaders,
    signal: controller.signal,
    credentials: "include",
    body:
      body == null
        ? undefined
        : body instanceof FormData
          ? body
          : JSON.stringify(body),
  };

  try {
    const response = await fetch(buildUrl(url, params), init);
    clearTimeout(timeoutId);

    if (!response.ok) {
      const apiError = await parseErrorResponse(response);
      throw apiError;
    }

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return response.json();
    }

    return response.text();
  } catch (error) {
    clearTimeout(timeoutId);

    const normalized = normalizeApiError(error);

    if (normalized.isUnauthorized && !skipUnauthorizedHandler) {
      handleUnauthorized();
    }

    const rethrown =
      error instanceof ApiError
        ? error
        : new ApiError(
            normalized.message,
            normalized.status,
            normalized.code,
            normalized.data
          );

    throw await runErrorInterceptors(rethrown);
  }
}

/**
 * @param {string} path
 * @param {Omit<RequestConfig, 'url' | 'method'>} [options]
 */
export function get(path, options) {
  return request({ ...options, url: path, method: "GET" });
}

/**
 * @param {string} path
 * @param {unknown} [body]
 * @param {Omit<RequestConfig, 'url' | 'method' | 'body'>} [options]
 */
export function post(path, body, options) {
  return request({ ...options, url: path, method: "POST", body });
}

/**
 * @param {string} path
 * @param {unknown} [body]
 * @param {Omit<RequestConfig, 'url' | 'method' | 'body'>} [options]
 */
export function patch(path, body, options) {
  return request({ ...options, url: path, method: "PATCH", body });
}

/**
 * @param {string} path
 * @param {Omit<RequestConfig, 'url' | 'method'>} [options]
 */
export function del(path, options) {
  return request({ ...options, url: path, method: "DELETE" });
}

/** @deprecated Use named exports — kept for gradual migration */
export const api = { get, post, patch, delete: del };
