'use client'

import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SendIcon } from 'lucide-react'
import { useRef } from 'react'

interface ChatInputProps {
  message: string
  loading: boolean
  onMessageChange: (message: string) => void
  onSendMessage: () => void
}

export function ChatInput({
  message,
  loading,
  onMessageChange,
  onSendMessage,
}: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      onSendMessage()
    }
  }

  return (
    <CardFooter className="flex justify-between items-center">
      <Input
        type="text"
        placeholder="Digite sua mensagem..."
        className="w-64"
        value={message}
        onChange={e => onMessageChange(e.target.value)}
        onKeyDown={handleInputKeyDown}
        disabled={loading}
        ref={inputRef}
      />
      <Button
        onClick={onSendMessage}
        className="flex justify-center items-center"
        size="icon"
        disabled={loading || !message.trim()}
      >
        <SendIcon className="w-6 h-6" />
      </Button>
    </CardFooter>
  )
}
