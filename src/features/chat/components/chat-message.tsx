"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "../types";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { sender, text } = message;
  return (
    <div
      className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}
    >
      <div className="max-w-[85%]">
        {sender === "user" ? (
          <div className="mb-3 whitespace-pre-wrap break-words rounded-tr-xl rounded-bl-xl bg-chart-4 p-3 text-primary-foreground">
            <span className="font-semibold">Você: </span>
            {text}
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert mb-3 max-w-none break-words rounded-tr-xl rounded-bl-xl bg-chart-5 p-3 prose-pre:p-0 text-primary-foreground prose-p:leading-relaxed dark:text-secondary-foreground">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
