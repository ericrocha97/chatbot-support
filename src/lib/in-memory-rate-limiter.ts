export interface RateLimitResult {
  limit: number;
  remaining: number;
  reset: number;
  success: boolean;
}

export class InMemoryRateLimiter {
  private readonly limitCount: number;
  private readonly windowMs: number;
  private readonly records: Map<string, { count: number; resetAt: number }>;

  constructor(limit = 10, windowMs = 3_600_000) {
    this.limitCount = limit;
    this.windowMs = windowMs;
    this.records = new Map();

    // Cleanup interval
    setInterval(() => this.cleanup(), this.windowMs * 2);
  }

  limit(key: string): RateLimitResult {
    const now = Date.now();
    const record = this.records.get(key);
    const resetAt = now + this.windowMs;

    if (!record || now > record.resetAt) {
      this.records.set(key, { count: 1, resetAt });
      return {
        success: true,
        limit: this.limitCount,
        remaining: this.limitCount - 1,
        reset: resetAt,
      };
    }

    if (record.count >= this.limitCount) {
      return {
        success: false,
        limit: this.limitCount,
        remaining: 0,
        reset: record.resetAt,
      };
    }

    record.count++;
    return {
      success: true,
      limit: this.limitCount,
      remaining: this.limitCount - record.count,
      reset: record.resetAt,
    };
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, record] of this.records.entries()) {
      if (now > record.resetAt) {
        this.records.delete(key);
      }
    }
  }
}

export const fallbackLimiter = new InMemoryRateLimiter(10, 3_600_000);
