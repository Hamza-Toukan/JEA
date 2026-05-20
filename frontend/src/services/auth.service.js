import { api } from "./api/client";

/**
 * @param {{ email: string, password: string }} credentials
 */
export async function login(credentials, token) {
  return api.post("/api/auth/login", credentials, { token });
}

export async function getCurrentUser(token) {
  return api.get("/api/auth/me", { token });
}

export const authService = {
  login,
  getCurrentUser,
};
