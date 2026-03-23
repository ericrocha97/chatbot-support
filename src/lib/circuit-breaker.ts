import { ServiceUnavailableError } from "./errors";
import { logger } from "./logger";

export type CircuitBreakerState = "CLOSED" | "OPEN" | "HALF_OPEN";

export class CircuitBreaker {
  state: CircuitBreakerState = "CLOSED";
  private failures = 0;
  private readonly failureThreshold: number;
  private readonly resetTimeout: number;
  private nextAttemptAt = 0;

  constructor(failureThreshold = 5, resetTimeout = 30_000) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
  }

  async execute<T>(action: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() > this.nextAttemptAt) {
        this.transitionTo("HALF_OPEN");
      } else {
        throw new ServiceUnavailableError(
          "Serviço temporariamente indisponível."
        );
      }
    }

    try {
      const result = await action();

      if (this.state === "HALF_OPEN") {
        this.transitionTo("CLOSED");
      } else if (this.state === "CLOSED") {
        // Reset failure count on success to avoid accumulation of sporadic failures
        this.failures = 0;
      }
      return result;
    } catch (error) {
      this.failures++;

      if (
        this.state === "HALF_OPEN" ||
        this.failures >= this.failureThreshold
      ) {
        this.transitionTo("OPEN");
      }

      throw error;
    }
  }

  private transitionTo(newState: CircuitBreakerState) {
    logger.warn(
      `Circuit breaker transition: ${this.state} -> ${newState}`,
      undefined,
      {
        from: this.state,
        to: newState,
        failures: this.failures,
      }
    );

    this.state = newState;

    if (newState === "OPEN") {
      this.nextAttemptAt = Date.now() + this.resetTimeout;
    } else if (newState === "CLOSED") {
      this.failures = 0;
      this.nextAttemptAt = 0;
    }
  }
}
