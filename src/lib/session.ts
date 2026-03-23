import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { env } from "./env";

export interface SessionPayload {
  createdAt: number;
  expiresAt: number;
  sessionId: string;
}

const sessionPayloadSchema = z.object({
  sessionId: z.uuid(),
  createdAt: z.number().int().positive(),
  expiresAt: z.number().int().positive(),
});

function sign(payload: string): string {
  const hmac = createHmac("sha256", env.SESSION_TOKEN_SECRET);
  hmac.update(payload);
  return hmac.digest("base64url");
}

// biome-ignore lint/suspicious/useAwait: Async by design
export async function createSession(): Promise<{
  sessionId: string;
  token: string;
}> {
  const sessionId = randomUUID();
  const now = Date.now();
  const expiresAt = now + env.SESSION_TOKEN_EXPIRY_MINUTES * 60 * 1000;

  const payload: SessionPayload = { sessionId, createdAt: now, expiresAt };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(payloadB64);

  return {
    sessionId,
    token: `${payloadB64}.${signature}`,
  };
}

// biome-ignore lint/suspicious/useAwait: Async by design
export async function validateSession(
  token: string
): Promise<SessionPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }

  const [payloadB64, signature] = parts;
  const expectedSig = sign(payloadB64);

  // Use timingSafeEqual to prevent timing attacks
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const payloadBuffer = Buffer.from(payloadB64, "base64url");
    const payloadStr = payloadBuffer.toString("utf-8");
    const parsed = sessionPayloadSchema.safeParse(JSON.parse(payloadStr));

    if (!parsed.success) {
      return null;
    }
    const payload = parsed.data;

    if (Date.now() > payload.expiresAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
