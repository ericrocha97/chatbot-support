import { type NextRequest, NextResponse } from "next/server";
import { RateLimitError } from "@/lib/errors";
import { fallbackLimiter } from "@/lib/in-memory-rate-limiter";
import { logger } from "@/lib/logger";
import { applyCors } from "@/lib/middleware/cors";
import { withErrorHandler } from "@/lib/middleware/error-handler";
import { createSession } from "@/lib/session";

export const POST = withErrorHandler(async (req: NextRequest) => {
  applyCors(req);

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  // Rate limit session creation heavily per IP (limit 30 per window)
  const result = fallbackLimiter.limit(`session-create:${ip}`);
  if (!result.success) {
    logger.warn("Session creation rate limited", undefined, { ip });
    throw new RateLimitError(result.limit, result.reset);
  }

  const session = await createSession();
  logger.info("Created new session", session.sessionId);

  return NextResponse.json(session);
});

export const OPTIONS = () => {
  return new NextResponse(null, { status: 204 });
};
