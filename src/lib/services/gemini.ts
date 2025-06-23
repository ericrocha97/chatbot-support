import { ratelimit } from '@/lib/rate-limiter'
import { GoogleGenAI } from '@google/genai'

interface Message {
  role: string
  parts: { text: string }[]
}

const geminiModel = process.env.GEMINI_MODEL

export async function getGeminiCompletion(
  ip: string,
  message: string,
  history: Message[]
): Promise<string> {
  const { success, limit, remaining, reset } = await ratelimit.limit(ip)
  if (!success) {
    const err = new Error(JSON.stringify({ limit, reset, code: 429 }))
    throw err
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  const config = {
    responseMimeType: 'text/plain',
    systemInstruction: [
      {
        text: 'Você é um chatbot de uma empresa de um escritório de contabilidade chamada ContBill, os clientes vão mandar mensagens perguntando coisas relacionadas a contabilidade de suas empresas.',
      },
    ],
  }
  const model = geminiModel || 'gemini-2.5-flash'

  const contents: Message[] = [
    ...history,
    { role: 'user', parts: [{ text: message }] },
  ]

  const response = await ai.models.generateContent({
    model,
    config,
    contents,
  })

  const text = response.candidates?.[0]?.content?.parts?.[0]?.text
  return text || ''
}
