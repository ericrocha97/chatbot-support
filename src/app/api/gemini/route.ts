import { ratelimit } from '@/lib/rateLimiter'
import { GoogleGenAI } from '@google/genai'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown'

    const { success, limit, remaining, reset } = await ratelimit.limit(ip)

    if (!success) {
      return NextResponse.json(
        {
          error: 'Limite diário de uso atingido. Tente novamente amanhã.',
          limit,
          reset: new Date(reset * 1000).toISOString(),
        },
        { status: 429 }
      )
    }
    const { message, history } = await req.json()
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
    const config = {
      responseMimeType: 'text/plain',
      systemInstruction: [
        {
          text: 'Você é um chatbot de uma empresa de um escritório de contabilidade chamada ContBill, os clientes vão mandar mensagens perguntando coisas relacionadas a contabilidade de suas empresas.',
        },
      ],
    }
    const model = 'gemini-2.0-flash'

    // Monta o histórico de mensagens para o modelo
    const contents = [
      ...(Array.isArray(history) ? history : []),
      {
        role: 'user',
        parts: [
          { text: typeof message === 'string' ? message : message?.text },
        ],
      },
    ]
    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    })
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return NextResponse.json({ text })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: error || 'Erro ao chamar Gemini' },
      { status: 500 }
    )
  }
}
