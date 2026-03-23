"use client";

import { SendIcon } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  loading: boolean;
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

export function ChatInput({
  message,
  loading,
  onMessageChange,
  onSendMessage,
}: Readonly<ChatInputProps>) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      onSendMessage();
    }
  };

  return (
    <CardFooter className="flex items-center justify-between">
      <Input
        className="w-64"
        disabled={loading}
        onChange={(e) => onMessageChange(e.target.value)}
        onKeyDown={handleInputKeyDown}
        placeholder="Digite sua mensagem..."
        ref={inputRef}
        type="text"
        value={message}
      />
      <Button
        className="flex items-center justify-center"
        disabled={loading || !message.trim()}
        onClick={onSendMessage}
        size="icon"
      >
        <SendIcon className="h-6 w-6" />
      </Button>
    </CardFooter>
  );
}
