import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  AppError,
  ForbiddenError,
  InternalServerError,
  RateLimitError,
  ServiceUnavailableError,
  UnauthorizedError,
} from "../errors";
import { logger } from "../logger";

export function withErrorHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Global error wrapper
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      let statusCode = 500;
      let message = new InternalServerError().message;
      // biome-ignore lint/suspicious/noExplicitAny: error payload is dynamic
      const responsePayload: any = {};

      // Extract sessionId from the Auth header: decode base64 first segment
      let sessionId: string | undefined;
      const authHeader = req.headers.get("Authorization");
      if (authHeader?.startsWith("Bearer ")) {
        try {
          const payloadB64 = authHeader.slice(7).split(".")[0];
          const decoded = JSON.parse(
            Buffer.from(payloadB64, "base64url").toString("utf-8")
          );
          sessionId =
            typeof decoded?.sessionId === "string"
              ? decoded.sessionId
              : undefined;
        } catch {
          // ignore
        }
      }

      if (error instanceof SyntaxError) {
        statusCode = 400;
        message = "JSON inválido ou malformado.";
        logger.warn("Invalid JSON body", sessionId);
      } else if (error instanceof z.ZodError) {
        statusCode = 400;
        message = "A validação dos dados falhou.";
        responsePayload.issues = error.issues;
        logger.warn("Validation error", sessionId, { issues: error.issues });
      } else if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;

        if (error instanceof RateLimitError) {
          responsePayload.limit = error.limit;
          responsePayload.reset = error.resetAt; // align with client RateLimitError type
          logger.warn("Rate limit hit", sessionId, { limit: error.limit });
        } else if (error instanceof UnauthorizedError) {
          logger.warn("Unauthorized access", sessionId);
        } else if (error instanceof ForbiddenError) {
          logger.warn("Forbidden access", sessionId);
        } else if (error instanceof ServiceUnavailableError) {
          logger.warn("Service unavailable (Circuit Breaker)", sessionId);
        }
      } else {
        logger.error("Unhandled Server Error", sessionId, {
          error: error instanceof Error ? error.message : String(error),
        });
      }

      return NextResponse.json(
        { error: message, ...responsePayload },
        { status: statusCode }
      );
    }
  };
}
