import type { RateLimitError } from '@/features/chat/types'

export function formatRateLimitMessage(error: RateLimitError): string {
  return `Limite diário de ${error.limit} mensagens atingido. Tente novamente amanhã.`
}
