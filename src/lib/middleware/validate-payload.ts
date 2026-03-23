import { z } from "zod";

export const payloadSchema = z.object({
  message: z
    .string()
    .min(1, "A mensagem não pode estar vazia.")
    .max(2000, "A mensagem excedeu o limite de 2000 caracteres.")
    .transform((str) => str.replace(/<[^>]*>?/gm, "")), // Basic XSS sanitization
  history: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        parts: z
          .array(
            z.object({
              text: z.string().max(2000, "Texto do histórico muito longo."),
            })
          )
          .min(1, "Cada item do histórico deve ter pelo menos uma parte."),
      })
    )
    .max(50, "Histórico muito longo.")
    .default([]),
});
