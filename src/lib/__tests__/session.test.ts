import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// We set env vars before importing session to not break validation
process.env.SESSION_TOKEN_SECRET = "test-secret";
process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-key";

import { createSession, validateSession } from "../session";

describe("Session Management", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("creates and validates a token", async () => {
    const { sessionId, token } = await createSession();
    expect(sessionId).toBeDefined();
    expect(token).toBeDefined();

    const decoded = await validateSession(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.sessionId).toBe(sessionId);
  });

  it("returns null for invalid token signature", async () => {
    const decoded = await validateSession("invalid.token.signature");
    expect(decoded).toBeNull();
  });

  it("returns null for expired token", async () => {
    const { token } = await createSession();

    // Advance time by 6 minutes (default expiry is 5 mins)
    vi.advanceTimersByTime(6 * 60 * 1000);

    const decoded = await validateSession(token);
    expect(decoded).toBeNull();
  });
});
