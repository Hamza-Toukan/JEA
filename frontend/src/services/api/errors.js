/** @readonly */
export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION: "VALIDATION_ERROR",
  NETWORK: "NETWORK_ERROR",
  TIMEOUT: "TIMEOUT",
  UNKNOWN: "UNKNOWN",
};

export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} [status=0]
   * @param {string} [code]
   * @param {unknown} [data]
   */
  constructor(message, status = 0, code, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

/**
 * @param {Response} response
 */
export async function parseErrorResponse(response) {
  let body = null;

  try {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      body = await response.json();
    } else {
      body = { message: await response.text() };
    }
  } catch {
    body = null;
  }

  const message =
    body?.message || body?.error || response.statusText || "Request failed";
  const code = body?.code || statusToCode(response.status);

  return new ApiError(message, response.status, code, body);
}

/**
 * @param {number} status
 */
function statusToCode(status) {
  if (status === 401) return ERROR_CODES.UNAUTHORIZED;
  if (status === 403) return ERROR_CODES.FORBIDDEN;
  if (status === 404) return ERROR_CODES.NOT_FOUND;
  if (status === 422 || status === 400) return ERROR_CODES.VALIDATION;
  return ERROR_CODES.UNKNOWN;
}

/**
 * @param {unknown} error
 */
export function isApiError(error) {
  return error instanceof ApiError;
}

/**
 * Normalized error shape for UI and logging.
 * @param {unknown} error
 */
export function normalizeApiError(error) {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      status: error.status,
      code: error.code || statusToCode(error.status),
      data: error.data,
      isUnauthorized: error.status === 401,
      isForbidden: error.status === 403,
      isNotFound: error.status === 404,
      isValidation: error.status === 400 || error.status === 422,
      isRetryable: error.status >= 500 || error.status === 429,
      isNetwork: false,
      isTimeout: error.code === ERROR_CODES.TIMEOUT,
      raw: error,
    };
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    return {
      message: "انتهت مهلة الطلب",
      status: 0,
      code: ERROR_CODES.TIMEOUT,
      data: null,
      isUnauthorized: false,
      isForbidden: false,
      isNotFound: false,
      isValidation: false,
      isRetryable: true,
      isNetwork: false,
      isTimeout: true,
      raw: error,
    };
  }

  if (error instanceof TypeError) {
    return {
      message: "تعذر الاتصال بالخادم",
      status: 0,
      code: ERROR_CODES.NETWORK,
      data: null,
      isUnauthorized: false,
      isForbidden: false,
      isNotFound: false,
      isValidation: false,
      isRetryable: true,
      isNetwork: true,
      isTimeout: false,
      raw: error,
    };
  }

  const message =
    error instanceof Error ? error.message : "حدث خطأ غير متوقع";

  return {
    message,
    status: 0,
    code: ERROR_CODES.UNKNOWN,
    data: null,
    isUnauthorized: false,
    isForbidden: false,
    isNotFound: false,
    isValidation: false,
    isRetryable: false,
    isNetwork: false,
    isTimeout: false,
    raw: error,
  };
}
