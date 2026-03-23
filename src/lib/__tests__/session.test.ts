import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// env vars are set in vitest.setup.ts before any module is loaded
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

  it("returns null for token with valid signature but malformed payload", async () => {
    // Craft a token: base64 payload with bad shape + valid signature won't match Zod
    const badPayload = Buffer.from(JSON.stringify({ foo: "bar" })).toString(
      "base64url"
    );
    const { createHmac } = await import("node:crypto");
    const sig = createHmac("sha256", "test-secret")
      .update(badPayload)
      .digest("base64url");
    const badToken = `${badPayload}.${sig}`;

    const decoded = await validateSession(badToken);
    expect(decoded).toBeNull();
  });
});
