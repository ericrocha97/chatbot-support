'use client'

import { ChatWindow } from '@/features/chat/components/chat-window'
import { FloatingChatButton } from '@/features/chat/components/floating-chat-button'
import { useState } from 'react'

export function ChatSupport() {
  const [showChat, setShowChat] = useState<boolean>(false)

  function handleCloseChat() {
    setShowChat(false)
  }

  return (
    <div className="fixed bottom-4 right-4 z-10">
      {showChat && <ChatWindow onClose={handleCloseChat} />}
      <FloatingChatButton onClick={() => setShowChat(!showChat)} />
    </div>
  )
}
