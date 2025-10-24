import { getAccessToken, refreshAccessToken } from "./auth";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const host = "https://jkl3auy9fi.execute-api.us-east-1.amazonaws.com/v1";

  let token = getAccessToken();
  if (!token) token = await refreshAccessToken();
  if (!token) throw new Error("Not authenticated");

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${host}${path}`, {
    ...options,
    headers,
  });
}
