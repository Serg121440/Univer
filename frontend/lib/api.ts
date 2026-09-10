// All browser calls go to this app's own origin under /api/*, where the route
// handler in app/api/[...path]/route.ts forwards them to the backend named by
// the runtime BACKEND_URL. That keeps requests same-origin (no CORS) and keeps
// the backend address out of the client bundle.
//
// Deliberately no NEXT_PUBLIC_API_URL escape hatch: NEXT_PUBLIC_* is inlined at
// build time, and RelaxDev injects a placeholder value during the image build,
// which would freeze a bogus host into every page.
export function apiUrl(path: string): string {
  return `/api${path.startsWith("/") ? path : `/${path}`}`;
}
