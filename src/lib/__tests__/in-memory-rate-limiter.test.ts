import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryRateLimiter } from "../in-memory-rate-limiter";

describe("InMemoryRateLimiter", () => {
  let limiter: InMemoryRateLimiter;

  beforeEach(() => {
    vi.useFakeTimers();
    limiter = new InMemoryRateLimiter(5, 1000);
  });

  it("allows requests within limit", () => {
    for (let i = 0; i < 5; i++) {
      const res = limiter.limit("session-1");
      expect(res.success).toBe(true);
      expect(res.remaining).toBe(4 - i);
    }
  });

  it("blocks requests over limit", () => {
    for (let i = 0; i < 5; i++) {
      limiter.limit("session-1");
    }
    const res = limiter.limit("session-1");
    expect(res.success).toBe(false);
    expect(res.remaining).toBe(0);
  });

  it("resets limit after windowMs", () => {
    for (let i = 0; i < 5; i++) {
      limiter.limit("session-1");
    }
    expect(limiter.limit("session-1").success).toBe(false);

    vi.advanceTimersByTime(1001);

    const res = limiter.limit("session-1");
    expect(res.success).toBe(true);
    expect(res.remaining).toBe(4);
  });
});
