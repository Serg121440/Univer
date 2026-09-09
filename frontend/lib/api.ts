// Base URL for the backend API.
//
// NEXT_PUBLIC_* values are inlined at build time, which is not available on
// platforms that inject environment variables only at runtime. When it is unset
// we fall back to same-origin `/api/*` requests, which next.config.mjs rewrites
// to the backend using the runtime BACKEND_URL — this also avoids CORS entirely.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export function apiUrl(path: string): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return API_URL ? `${API_URL}${suffix}` : `/api${suffix}`;
}
