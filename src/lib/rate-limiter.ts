import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { CircuitBreaker } from "./circuit-breaker";
import {
  fallbackLimiter,
  type RateLimitResult,
} from "./in-memory-rate-limiter";
import { logger } from "./logger";

// We initialize Redis only if we can, else it will be undefined and we gracefully fallback
let redis: Redis | undefined;
let upstashRatelimit: Ratelimit | undefined;

try {
  // fromEnv will throw if KV_REST_API_URL / KV_REST_API_TOKEN are not set
  redis = Redis.fromEnv();
  if (redis) {
    upstashRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(10, "1d"),
      analytics: true,
    });
  }
} catch (_error) {
  logger.warn(
    "Redis env vars not found. Starting with fallback in-memory rate limiter."
  );
}

// Circuit breaker specifically for Redis
const redisCircuitBreaker = new CircuitBreaker(3, 30_000);

export async function rateLimit(key: string): Promise<RateLimitResult> {
  if (upstashRatelimit) {
    try {
      // Execute the request via circuit breaker
      const { success, limit, remaining, reset } =
        await redisCircuitBreaker.execute(() => upstashRatelimit.limit(key));
      return { success, limit, remaining, reset };
    } catch (error) {
      logger.error(
        "Redis ratelimit failed. Using fallback limiter.",
        undefined,
        {
          key,
          error: String(error),
        }
      );
      // If it throws (either network error or circuit breaker OPEN), we fallback
    }
  }

  // Graceful degradation
  return fallbackLimiter.limit(key);
}
