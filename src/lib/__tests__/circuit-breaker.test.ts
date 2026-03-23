import { beforeEach, describe, expect, it, vi } from "vitest";
import { CircuitBreaker } from "../circuit-breaker";

describe("CircuitBreaker", () => {
  let cb: CircuitBreaker;

  beforeEach(() => {
    vi.useFakeTimers();
    cb = new CircuitBreaker(3, 1000);
  });

  it("starts in CLOSED state and executes action successfully", async () => {
    const action = vi.fn().mockResolvedValue("success");
    const result = await cb.execute(action);
    expect(result).toBe("success");
    expect(cb.state).toBe("CLOSED");
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("transitions to OPEN after failure threshold is reached", async () => {
    const action = vi.fn().mockRejectedValue(new Error("fail"));

    await expect(cb.execute(action)).rejects.toThrow("fail");
    await expect(cb.execute(action)).rejects.toThrow("fail");
    await expect(cb.execute(action)).rejects.toThrow("fail");

    expect(cb.state).toBe("OPEN");

    await expect(cb.execute(action)).rejects.toThrow(
      "Serviço temporariamente indisponível."
    );
    expect(action).toHaveBeenCalledTimes(3);
  });

  it("transitions to HALF_OPEN after reset timeout", async () => {
    const action = vi.fn().mockRejectedValue(new Error("fail"));

    for (let i = 0; i < 3; i++) {
      await expect(cb.execute(action)).rejects.toThrow("fail");
    }
    expect(cb.state).toBe("OPEN");

    vi.advanceTimersByTime(1001);

    const successAction = vi.fn().mockResolvedValue("success");
    const result = await cb.execute(successAction);
    expect(result).toBe("success");

    expect(cb.state).toBe("CLOSED");
  });

  it("goes back to OPEN if HALF_OPEN call fails", async () => {
    const errorAction = vi.fn().mockRejectedValue(new Error("fail"));

    for (let i = 0; i < 3; i++) {
      await expect(cb.execute(errorAction)).rejects.toThrow("fail");
    }

    vi.advanceTimersByTime(1001);

    await expect(cb.execute(errorAction)).rejects.toThrow("fail");

    expect(cb.state).toBe("OPEN");
  });
});
