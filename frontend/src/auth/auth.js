import { apiFetch } from "../services/api";

const getCurrentUser = async () => {
  const response = await apiFetch("/auth/me");

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to get current user");
  }

  return response.json();
};

export { getCurrentUser };
