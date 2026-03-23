"use client";

import { useCallback, useEffect, useState } from "react";
import type { Message, RateLimitError } from "../types";
import { formatRateLimitMessage } from "../utils/rate-limit-message-formatter";

export function useChat() {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const renewSession = useCallback(async () => {
    try {
      const res = await fetch("/api/session", { method: "POST" });
      if (!res.ok) {
        throw new Error("Failed to create session");
      }
      const data = await res.json();
      setSessionToken(data.token);
      return data.token;
    } catch {
      return null;
    }
  }, []);

  // Auto-login when the hook is used (e.g., chat is opened)
  useEffect(() => {
    renewSession();
  }, [renewSession]);

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Intentional
  const sendMessage = async () => {
    if (!message.trim()) {
      return;
    }

    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text: message,
    };

    setChatMessages((msgs) => [...msgs, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      let token = sessionToken;
      if (!token) {
        token = await renewSession();
        if (!token) {
          throw new Error("No session token");
        }
      }

      let res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message,
          history: chatMessages.map(({ sender, text }) => ({
            role: sender === "user" ? "user" : "model",
            parts: [{ text }],
          })),
        }),
      });

      // If token expired, renew and retry once
      if (res.status === 401) {
        token = await renewSession();
        if (token) {
          res = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              message,
              history: chatMessages.map(({ sender, text }) => ({
                role: sender === "user" ? "user" : "model",
                parts: [{ text }],
              })),
            }),
          });
        }
      }

      const data = await res.json();
      let errorMessage = "";

      if (res.status === 429) {
        const rateLimitError = data as RateLimitError;
        errorMessage = formatRateLimitMessage(rateLimitError);
      } else if (!res.ok) {
        errorMessage = data.error ?? "Erro ao obter resposta";
      }

      const botMsg: Message = {
        id: crypto.randomUUID(),
        sender: "bot",
        text: res.ok ? data.text : errorMessage,
      };
      setChatMessages((msgs) => [...msgs, botMsg]);
    } catch {
      setChatMessages((msgs) => [
        ...msgs,
        {
          id: crypto.randomUUID(),
          sender: "bot",
          text: "Não consegui me conectar. Verifique sua conexão com a internet ou tente novamente em instantes.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    chatMessages,
    message,
    loading,
    setMessage,
    sendMessage,
  };
}
