'use client'

import type { Message } from '../types'
import { formatBotText } from '../utils/message-formatter'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { sender, text } = message
  return (
    <div
      className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className="max-w-[85%]">
        {sender === 'user' ? (
          <div className="bg-chart-4 text-primary-foreground rounded-tr-xl rounded-bl-xl p-3 mb-3 whitespace-pre-wrap break-words">
            <span className="font-semibold">Você: </span>
            {text}
          </div>
        ) : (
          <div
            className="bg-chart-5 text-primary-foreground dark:text-secondary-foreground rounded-tr-xl rounded-bl-xl p-3 mb-3 whitespace-pre-wrap break-words prose prose-sm dark:prose-invert"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: this is safe as we control the content and it is sanitized before being sent to the client
            dangerouslySetInnerHTML={{
              __html: formatBotText(text),
            }}
          />
        )}
      </div>
    </div>
  )
}
