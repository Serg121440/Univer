import { NextRequest } from 'next/server';

// Same-origin proxy to the backend.
//
// `rewrites()` in next.config.mjs cannot be used for this: Next.js bakes the
// rewrite destination into .next/routes-manifest.json at build time, so a
// BACKEND_URL injected only at runtime (as PaaS platforms do) never reaches it.
// A route handler reads the variable on every request instead.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function backendUrl(): string {
  const raw =
    process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return raw.replace(/\/$/, '');
}

// Headers that describe a single hop and must not be forwarded.
const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

function requestHeaders(request: NextRequest): Headers {
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (HOP_BY_HOP.has(key) || key === 'host' || key === 'content-length') return;
    // fetch() negotiates its own encoding with the backend.
    if (key === 'accept-encoding') return;
    headers.set(key, value);
  });
  return headers;
}

function responseHeaders(response: Response): Headers {
  const headers = new Headers();
  response.headers.forEach((value, key) => {
    if (HOP_BY_HOP.has(key)) return;
    // fetch() already decoded the body, so the upstream length/encoding lie.
    if (key === 'content-encoding' || key === 'content-length') return;
    headers.set(key, value);
  });
  return headers;
}

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  const { path } = await context.params;
  const target = `${backendUrl()}/${path.map(encodeURIComponent).join('/')}${request.nextUrl.search}`;
  const method = request.method;

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method,
      headers: requestHeaders(request),
      body: method === 'GET' || method === 'HEAD' ? undefined : await request.arrayBuffer(),
      redirect: 'manual',
      cache: 'no-store',
    });
  } catch {
    return Response.json(
      { detail: 'Backend is unreachable. Check the BACKEND_URL environment variable.' },
      { status: 502 },
    );
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders(upstream),
  });
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
  proxy as HEAD,
  proxy as OPTIONS,
};
