"use client";

import { useState } from "react";
import { ChatWindow } from "@/features/chat/components/chat-window";
import { FloatingChatButton } from "@/features/chat/components/floating-chat-button";

export function ChatSupport() {
  const [showChat, setShowChat] = useState<boolean>(false);

  function handleCloseChat() {
    setShowChat(false);
  }

  return (
    <div className="fixed right-4 bottom-4 z-10">
      {showChat && <ChatWindow onClose={handleCloseChat} />}
      <FloatingChatButton onClick={() => setShowChat(!showChat)} />
    </div>
  );
}
