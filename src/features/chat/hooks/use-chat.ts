'use client'

import { useState } from 'react'
import type { Message, RateLimitError } from '../types'
import { formatRateLimitMessage } from '../utils/rate-limit-message-formatter'

export function useChat() {
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim()) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: message,
    }

    setChatMessages(msgs => [...msgs, userMsg])
    setMessage('')
    setLoading(true)

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: chatMessages.map(({ sender, text }) => ({
            role: sender === 'user' ? 'user' : 'model',
            parts: [{ text }],
          })),
        }),
      })

      const data = await res.json()
      let errorMessage = ''

      if (res.status === 429) {
        // Rate limit error
        const rateLimitError = data as RateLimitError
        errorMessage = formatRateLimitMessage(rateLimitError)
      } else if (res.status !== 200) {
        errorMessage = data.error || 'Erro ao obter resposta'
      }

      const botMsg: Message = {
        id: crypto.randomUUID(),
        sender: 'bot',
        text: res.status === 200 ? data.text : errorMessage,
      }
      setChatMessages(msgs => [...msgs, botMsg])
    } catch (e) {
      setChatMessages(msgs => [
        ...msgs,
        {
          id: crypto.randomUUID(),
          sender: 'bot',
          text: 'Erro ao conectar com o servidor.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return {
    chatMessages,
    message,
    loading,
    setMessage,
    sendMessage,
  }
}
