import { NextRequest } from 'next/server';

// Same-origin proxy to the backend.
//
// `rewrites()` in next.config.mjs cannot be used for this: Next.js bakes the
// rewrite destination into .next/routes-manifest.json at build time, so a
// BACKEND_URL injected only at runtime (as PaaS platforms do) never reaches it.
// A route handler reads the variable on every request instead.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// How long the backend has to start responding. Route handlers have no proxy
// timeout of their own, so without this a backend that accepts the connection
// and then stalls would pin a request until the platform's much longer limit.
const UPSTREAM_TIMEOUT_MS = 30_000;

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
    if (HOP_BY_HOP.has(key) || key === 'host') return;
    // fetch() sets its own framing for the streamed body and negotiates its own
    // encoding with the backend.
    if (key === 'content-length' || key === 'accept-encoding') return;
    // undici rejects Expect outright; Next.js has already settled the
    // 100-continue handshake with the client by the time we get here.
    if (key === 'expect') return;
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
  const hasBody = method !== 'GET' && method !== 'HEAD';

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, UPSTREAM_TIMEOUT_MS);
  // A browser that goes away should not leave the backend call running.
  request.signal.addEventListener('abort', () => controller.abort());

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method,
      headers: requestHeaders(request),
      // Streamed, not buffered: a large upload must not be materialized in this
      // process before any of it reaches the backend. `duplex` is required by
      // undici whenever the body is a stream.
      body: hasBody ? request.body : undefined,
      ...(hasBody ? { duplex: 'half' } : {}),
      signal: controller.signal,
      redirect: 'manual',
      cache: 'no-store',
    } as RequestInit);
  } catch {
    return Response.json(
      timedOut
        ? { detail: 'Backend did not respond in time.' }
        : { detail: 'Backend is unreachable. Check the BACKEND_URL environment variable.' },
      { status: timedOut ? 504 : 502 },
    );
  } finally {
    // The timeout covers time-to-first-byte; the response body streams on under
    // the client's own signal.
    clearTimeout(timer);
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
