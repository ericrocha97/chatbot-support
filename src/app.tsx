import { useState } from "react";
import { Header } from "./components/header";
import { ChatWindow } from "./components/chat-window";
import { MessageCircleQuestionIcon } from "lucide-react";
import { Button } from "./components/ui/button";

export interface ChatMessage {
  id: number;
  text: string;
  sender: string;
}

export function App() {
  const [showChat, setShowChat] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  function handleCloseChat() {
    setShowChat(false);
  }

  return (
    <div className="mx-auto flex max-w-[1216px] flex-col gap-5 py-5">
      <Header />
      <div className="fixed bottom-4 right-4 z-10">
        {showChat && (
          <ChatWindow
            onClose={() => handleCloseChat()}
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
          />
        )}
        <Button
          className="w-12 h-12 flex justify-center items-center"
          variant="outline"
          size="icon"
          onClick={() => setShowChat(!showChat)}
        >
          <MessageCircleQuestionIcon className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
