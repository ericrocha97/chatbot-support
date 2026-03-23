import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { SYSTEM_PROMPT } from "../../constants/prompts";
import { CircuitBreaker } from "../circuit-breaker";
import { env } from "../env";

interface Message {
  parts: { text: string }[];
  role: "user" | "model";
}

const aiCircuitBreaker = new CircuitBreaker(5, 60_000);

export async function getAiCompletion(
  message: string,
  history: Message[]
): Promise<string> {
  // Wrap ai call in circuit breaker
  return await aiCircuitBreaker.execute(async () => {
    // We convert the custom history format back to core messages suitable for AI SDK
    const coreMessages = history.map((h) => ({
      role: (h.role === "model" ? "assistant" : "user") as "user" | "assistant",
      content: h.parts[0].text,
    }));

    const { text } = await generateText({
      model: google(env.AI_MODEL),
      system: SYSTEM_PROMPT,
      messages: [...coreMessages, { role: "user" as const, content: message }],
    });

    return text;
  });
}
