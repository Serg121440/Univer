/** @type {import('next').NextConfig} */

// The backend proxy lives in app/api/[...path]/route.ts rather than in
// rewrites(): Next.js resolves rewrite destinations at build time, which would
// freeze BACKEND_URL into the image instead of reading it when the server runs.
const nextConfig = {
  output: "standalone",
};

export default nextConfig;
