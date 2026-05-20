/**
 * Request/response interceptor registry.
 * Supports auth injection, 401 handling, and future refresh-token flow.
 */

/** @typedef {(config: import('./request').RequestConfig) => import('./request').RequestConfig | Promise<import('./request').RequestConfig>} RequestInterceptor */
/** @typedef {(error: unknown) => unknown} ErrorInterceptor */

/** @type {RequestInterceptor[]} */
const requestInterceptors = [];

/** @type {ErrorInterceptor[]} */
const errorInterceptors = [];

/** @type {(() => string | null | undefined) | null} */
let authTokenGetter = null;

/** @type {(() => void) | null} */
let unauthorizedHandler = null;

/**
 * @param {() => string | null | undefined} getter
 */
export function setAuthTokenGetter(getter) {
  authTokenGetter = getter;
}

/**
 * @param {() => void} handler
 */
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

/**
 * @param {RequestInterceptor} interceptor
 */
export function addRequestInterceptor(interceptor) {
  requestInterceptors.push(interceptor);
}

/**
 * @param {ErrorInterceptor} interceptor
 */
export function addErrorInterceptor(interceptor) {
  errorInterceptors.push(interceptor);
}

/**
 * @param {import('./request').RequestConfig} config
 */
export async function runRequestInterceptors(config) {
  let next = { ...config };

  for (const interceptor of requestInterceptors) {
    next = await interceptor(next);
  }

  const token = config.token ?? authTokenGetter?.();

  if (token && !next.headers?.Authorization) {
    next.headers = {
      ...next.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return next;
}

/**
 * @param {unknown} error
 */
export async function runErrorInterceptors(error) {
  let current = error;

  for (const interceptor of errorInterceptors) {
    current = await interceptor(current);
  }

  return current;
}

/**
 * Call after normalized 401 detection.
 */
export function handleUnauthorized() {
  unauthorizedHandler?.();
}
