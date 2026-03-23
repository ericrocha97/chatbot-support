import { type NextRequest, NextResponse } from "next/server";
import { RateLimitError, UnauthorizedError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { applyCors } from "@/lib/middleware/cors";
import { withErrorHandler } from "@/lib/middleware/error-handler";
import { payloadSchema } from "@/lib/middleware/validate-payload";
import { rateLimit } from "@/lib/rate-limiter";
import { getAiCompletion } from "@/lib/services/ai";
import { validateSession } from "@/lib/session";

export const POST = withErrorHandler(async (req: NextRequest) => {
  applyCors(req);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Token de sessão não fornecido.");
  }
  const token = authHeader.slice(7);
  const session = await validateSession(token);

  if (!session) {
    throw new UnauthorizedError("Sessão inválida ou expirada.");
  }

  const result = await rateLimit(session.sessionId);
  if (!result.success) {
    throw new RateLimitError(result.limit, result.reset);
  }

  const json = await req.json();
  const { message, history } = payloadSchema.parse(json);

  logger.info("Chat request started", session.sessionId, {
    messageLength: message.length,
  });

  const text = await getAiCompletion(message, history);

  logger.info("Chat request completed", session.sessionId);

  return NextResponse.json({ text });
});

export const OPTIONS = () => {
  return new NextResponse(null, { status: 204 });
};
