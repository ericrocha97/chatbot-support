import { type NextRequest, NextResponse } from "next/server";
import {
  RateLimitError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/errors";
import { logger } from "@/lib/logger";
import { getCorsHeaders } from "@/lib/middleware/cors";
import { withErrorHandler } from "@/lib/middleware/error-handler";
import { payloadSchema } from "@/lib/middleware/validate-payload";
import { rateLimit } from "@/lib/rate-limiter";
import { getAiCompletion } from "@/lib/services/ai";
import { validateSession } from "@/lib/session";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const corsHeaders = getCorsHeaders(req);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Token de sessão não fornecido.");
  }
  const token = authHeader.slice(7);
  const session = await validateSession(token);

  if (!session) {
    throw new UnauthorizedError("Sessão inválida ou expirada.");
  }

  // Rate limit by IP to prevent abuse even after session renewal
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const result = await rateLimit(ip);
  if (!result.success) {
    throw new RateLimitError(result.limit, result.reset);
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    throw new ValidationError("JSON inválido ou malformado.");
  }
  const { message, history } = payloadSchema.parse(json);

  logger.info("Chat request started", session.sessionId, {
    messageLength: message.length,
  });

  const text = await getAiCompletion(message, history);

  logger.info("Chat request completed", session.sessionId);

  return NextResponse.json({ text }, { headers: corsHeaders });
});

export const OPTIONS = (req: NextRequest) => {
  const corsHeaders = getCorsHeaders(req);
  return new NextResponse(null, { status: 204, headers: corsHeaders });
};
