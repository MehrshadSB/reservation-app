/**
 * HTTP client for `apps/api`.
 *
 * Frontends never import `@repo/database`.
 * Session cookies are HttpOnly; send `credentials: "include"`.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const apiUrl = process.env.API_URL ?? "http://localhost:4000";
  return fetch(`${apiUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...init.headers,
    },
  });
}
