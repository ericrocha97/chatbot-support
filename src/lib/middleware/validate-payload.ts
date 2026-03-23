import { z } from "zod";

export const payloadSchema = z.object({
  message: z
    .string()
    .min(1, "A mensagem não pode estar vazia.")
    .max(2000, "A mensagem excedeu o limite de 2000 caracteres.")
    .transform((str) => str.replace(/<[^>]*>?/gm, "")), // Basic XSS sanitization
  history: z
    .array(
      z.discriminatedUnion("role", [
        z.object({
          role: z.literal("user"),
          parts: z
            .array(z.object({ text: z.string().max(2000, "Texto do usuário no histórico muito longo.") }))
            .min(1, "Cada item do histórico deve ter pelo menos uma parte.")
            .max(1, "Cada item do histórico deve ter no máximo uma parte."),
        }),
        z.object({
          role: z.literal("model"),
          parts: z
            .array(z.object({ text: z.string().max(50000, "Texto da IA no histórico muito longo.") }))
            .min(1, "Cada item do histórico deve ter pelo menos uma parte.")
            .max(1, "Cada item do histórico deve ter no máximo uma parte."),
        }),
      ])
    )
    .max(50, "Histórico muito longo.")
    .default([]),
});
