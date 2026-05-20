/**
 * Role identifiers — aligned with backend RBAC (future).
 * @readonly
 */
export const ROLES = {
  ADMIN: "admin",
  SUPERVISOR: "supervisor",
  AGENT: "agent",
};

/** @type {readonly string[]} */
export const ALL_ROLES = [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.AGENT];

/**
 * @param {string | string[] | undefined} userRoles
 * @param {string | string[]} required
 */
export function hasAnyRole(userRoles, required) {
  const requiredList = Array.isArray(required) ? required : [required];
  const userList = Array.isArray(userRoles)
    ? userRoles
    : userRoles
      ? [userRoles]
      : [];

  return requiredList.some((role) => userList.includes(role));
}

/**
 * @param {string | string[] | undefined} userRoles
 * @param {string | string[]} required
 */
export function hasAllRoles(userRoles, required) {
  const requiredList = Array.isArray(required) ? required : [required];
  const userList = Array.isArray(userRoles)
    ? userRoles
    : userRoles
      ? [userRoles]
      : [];

  return requiredList.every((role) => userList.includes(role));
}
