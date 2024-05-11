import { CircleXIcon, SendIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { useState } from "react";
import { ChatMessage } from "@/app";

const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const generationConfig = {
  temperature: 1,
  topK: 0,
  topP: 0.95,
  maxOutputTokens: 8192,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

interface ChatWindowProps {
  onClose: () => void;
  chatMessages: ChatMessage[];
  setChatMessages: (chatMessage: ChatMessage[]) => void;
}

export function ChatWindow({
  onClose,
  chatMessages,
  setChatMessages,
}: Readonly<ChatWindowProps>) {
  const [message, setMessage] = useState("");

  const genAI = new GoogleGenerativeAI(API_KEY);

  const systemInstruction =
    "Você é um chatbot de uma empresa de um escritório de contabilidade chamada ContBill, os clientes vão mandar mensagens perguntando coisas relacionadas a contabilidade de suas empresas.";

  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction,
    generationConfig,
    safetySettings,
  });

  const chat = model.startChat({});

  async function handleSendMessage() {
    const newMessage: ChatMessage = {
      id: chatMessages.length + 1,
      text: message,
      sender: "user",
    };
    setChatMessages([...chatMessages, newMessage]);
    setMessage("");
    const result = await chat.sendMessage(message);
    const response = result.response;

    const newResponse: ChatMessage = {
      id: chatMessages.length + 1,
      text: response.text(),
      sender: "bot",
    };
    setMessage("");
    setChatMessages([...chatMessages, newMessage, newResponse]);
  }

  return (
    <div className="fixed bottom-4 right-4 flex flex-col">
      <Card className="w-[350px] max-h-[500px]">
        <CardHeader className="flex justify-between flex-row items-center">
          <CardTitle>Chat para suporte</CardTitle>
          <Button
            className="flex justify-center items-center"
            onClick={onClose}
            variant="destructive"
            size="icon"
          >
            <CircleXIcon className="w-6 h-6" />
          </Button>
        </CardHeader>
        <CardContent className="max-h-[350px] overflow-y-auto">
          <div className="flex flex-col gap-2 ">
            {chatMessages.map((item) => (
              <div
                key={item.id}
                className={`flex ${
                  item.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className={"max-w-[80%]"}>
                  <p
                    className={`bg-${
                      item.sender === "user" ? "primary" : "secondary"
                    } rounded-tr-xl rounded-bl-xl p-3 mb-3`}
                  >
                    <span className="font-semibold">{`${item.sender}: `}</span>
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Input
            type="message"
            placeholder="Digite sua mensagem..."
            className="w-64"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            onClick={handleSendMessage}
            className="flex justify-center items-center"
            size="icon"
          >
            <SendIcon className="w-6 h-6" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
