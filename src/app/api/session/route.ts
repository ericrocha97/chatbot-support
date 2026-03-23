import { type NextRequest, NextResponse } from "next/server";
import { RateLimitError } from "@/lib/errors";
import { InMemoryRateLimiter } from "@/lib/in-memory-rate-limiter";
import { logger } from "@/lib/logger";
import { getCorsHeaders } from "@/lib/middleware/cors";
import { withErrorHandler } from "@/lib/middleware/error-handler";
import { createSession } from "@/lib/session";

// Dedicated limiter for session creation: 30 per hour per IP
// Separate from the chat rate limiter to avoid coupling concerns
const sessionCreationLimiter = new InMemoryRateLimiter(30, 60 * 60 * 1000);

export const POST = withErrorHandler(async (req: NextRequest) => {
  const corsHeaders = getCorsHeaders(req);

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  // Rate limit session creation per IP to prevent token farming
  const result = sessionCreationLimiter.limit(`session-create:${ip}`);
  if (!result.success) {
    logger.warn("Session creation rate limited", undefined, { ip });
    throw new RateLimitError(result.limit, result.reset);
  }

  const session = await createSession();
  logger.info("Created new session", session.sessionId);

  return NextResponse.json(session, { headers: corsHeaders });
});

export const OPTIONS = (req: NextRequest) => {
  const corsHeaders = getCorsHeaders(req);
  return new NextResponse(null, { status: 204, headers: corsHeaders });
};
