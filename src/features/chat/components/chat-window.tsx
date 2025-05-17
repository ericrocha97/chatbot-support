'use client'

import { CardContent } from '@/components/ui/card'
import { useEffect, useRef } from 'react'
import { useChat } from '../hooks/use-chat'
import type { ChatWindowProps } from '../types'
import { ChatContainer } from './chat-container'
import { ChatDisclaimer } from './chat-disclaimer'
import { ChatHeader } from './chat-header'
import { ChatInput } from './chat-input'
import { ChatMessage } from './chat-message'
import { ChatTypingIndicator } from './chat-typing-indicator'

export function ChatWindow({ onClose }: Readonly<ChatWindowProps>) {
  const { chatMessages, message, loading, setMessage, sendMessage } = useChat()
  const contentRef = useRef<HTMLDivElement>(null)

  // Scroll automático para a última mensagem
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [chatMessages, loading])

  return (
    <ChatContainer>
      <ChatHeader loading={loading} onClose={onClose} />

      <CardContent className="flex-1 overflow-y-auto" ref={contentRef}>
        <div className="flex flex-col gap-2">
          <ChatDisclaimer />

          {chatMessages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {loading && <ChatTypingIndicator />}
        </div>
      </CardContent>

      <ChatInput
        message={message}
        loading={loading}
        onMessageChange={setMessage}
        onSendMessage={sendMessage}
      />
    </ChatContainer>
  )
}
