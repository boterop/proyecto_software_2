import { apiFetch, ApiError } from "./api";
import { clearStoredToken, getStoredToken, setStoredToken } from "./authStorage";

export async function registerUser({ name, email, password }) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginUser({ email, password }) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setStoredToken(data.token);
  return data;
}

export async function fetchCurrentUser() {
  const token = getStoredToken();
  if (!token) {
    return null;
  }
  try {
    return await apiFetch("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      clearStoredToken();
      return null;
    }
    throw err;
  }
}

export function logoutUser() {
  clearStoredToken();
}
