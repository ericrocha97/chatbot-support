export type MessageSender = 'user' | 'bot'

export interface Message {
  id: string
  sender: MessageSender
  text: string
}

export interface ChatWindowProps {
  onClose: () => void
}

export interface RateLimitError {
  error: string
  limit: number
  reset: number
}
