export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} status
   * @param {string} [code]
   * @param {unknown} [data]
   */
  constructor(message, status, code, data) {
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
    body = await response.json();
  } catch {
    body = null;
  }

  const message =
    body?.message || body?.error || response.statusText || "Request failed";
  const code = body?.code;

  return new ApiError(message, response.status, code, body);
}
