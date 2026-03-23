import { describe, expect, it } from "vitest";
import { payloadSchema } from "../validate-payload";

describe("Payload Validation", () => {
  it("accepts valid payload", () => {
    const valid = {
      message: "Hello",
      history: [
        { role: "user", parts: [{ text: "hi" }] },
        { role: "model", parts: [{ text: "hello" }] },
      ],
    };
    const result = payloadSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects too long message", () => {
    const invalid = {
      message: "a".repeat(2001),
      history: [],
    };
    const result = payloadSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects invalid role in history", () => {
    const invalid = {
      message: "Hello",
      history: [{ role: "admin", parts: [{ text: "hi" }] }],
    };
    const result = payloadSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects history item with empty parts array", () => {
    const invalid = {
      message: "Hello",
      history: [{ role: "user", parts: [] }],
    };
    const result = payloadSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("sanitizes HTML from message via Zod transform", () => {
    const payload = {
      message: "<script>alert()</script>Hello",
      history: [],
    };
    const result = payloadSchema.safeParse(payload);
    expect(result.success).toBe(true);
    // sanitization is done via Zod .transform() in the schema
    if (result.success) {
      expect(result.data.message).not.toContain("<script>");
      expect(result.data.message).toContain("Hello");
    }
  });
});
