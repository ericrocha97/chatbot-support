import { getGeminiCompletion } from '@/lib/services/gemini'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    const { message, history } = await req.json()
    const text = await getGeminiCompletion(
      ip,
      typeof message === 'string' ? message : message?.text,
      Array.isArray(history) ? history : []
    )
    return NextResponse.json({ text })
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (() => {
        try {
          JSON.parse(error.message)
          return true
        } catch {
          return false
        }
      })()
    ) {
      const info = JSON.parse(error.message) as {
        limit: number
        reset: string
        code: number
      }
      return NextResponse.json(
        {
          error: 'Limite diário de uso atingido.',
          limit: info.limit,
          reset: info.reset,
        },
        { status: info.code }
      )
    }

    console.error('Gemini error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Erro ao chamar Gemini',
      },
      { status: 500 }
    )
  }
}
