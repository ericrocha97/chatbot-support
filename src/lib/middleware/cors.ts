import type { NextRequest } from "next/server";
import { env } from "../env";
import { ForbiddenError } from "../errors";
import { logger } from "../logger";

export function applyCors(req: NextRequest) {
  if (!env.ALLOWED_ORIGINS) {
    return;
  }

  const origin = req.headers.get("origin");

  if (!origin) {
    return; // Optional: reject if no origin? Usually allow server-to-server.
  }

  const allowed = env.ALLOWED_ORIGINS.split(",").map((s) => s.trim());

  if (!allowed.includes(origin)) {
    logger.warn("CORS blocked request", undefined, { origin, allowed });
    throw new ForbiddenError(`Origem ${origin} não autorizada pelo CORS.`);
  }
}
