import type { NextRequest } from "next/server";
import { env } from "../env";
import { ForbiddenError } from "../errors";
import { logger } from "../logger";

const CORS_METHODS = "POST, OPTIONS";
const CORS_HEADERS = "Content-Type, Authorization, Accept";

/**
 * Validates the request origin and returns the correct CORS headers to include in the response.
 * Returns an empty object ({}) if no ALLOWED_ORIGINS is configured or if the request has no Origin header.
 * Throws ForbiddenError if the origin is not in the allowlist.
 */
export function getCorsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get("origin");

  // If no allowlist is configured, allow all but don't send credentials header
  if (!env.ALLOWED_ORIGINS) {
    return {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": CORS_METHODS,
      "Access-Control-Allow-Headers": CORS_HEADERS,
    };
  }

  if (!origin) {
    // Server-to-server requests without Origin: allow, but return no CORS headers
    return {};
  }

  const allowed = env.ALLOWED_ORIGINS.split(",").map((s) => s.trim().replace(/\/$/, ""));

  if (!allowed.includes(origin)) {
    logger.warn("CORS blocked request", undefined, { origin, allowed });
    throw new ForbiddenError(`Origem ${origin} não autorizada pelo CORS.`);
  }

  // Echo back the validated origin (required when using credentials)
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": CORS_METHODS,
    "Access-Control-Allow-Headers": CORS_HEADERS,
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}
