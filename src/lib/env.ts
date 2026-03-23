import { z } from "zod";

const envSchema = z.object({
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1, "API key is required"),
  AI_MODEL: z.string().default("gemini-2.5-flash"),
  ALLOWED_ORIGINS: z.string().optional(),
  SESSION_TOKEN_SECRET: z.string().min(1, "Session token secret is required"),
  SESSION_TOKEN_EXPIRY_MINUTES: z.coerce.number().int().positive().default(5),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Environment validation failed:");
      console.error(
        error.issues
          .map((err) => `  - ${err.path.join(".")}: ${err.message}`)
          .join("\n")
      );
      process.exit(1);
    }
    throw error;
  }
};

export const env = parseEnv();
