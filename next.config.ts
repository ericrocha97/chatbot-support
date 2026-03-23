import type { NextConfig } from "next";

// CORS is managed dynamically per-request in src/lib/middleware/cors.ts
// to support multiple allowed origins with proper echo-back behavior.
const nextConfig: NextConfig = {};

export default nextConfig;
