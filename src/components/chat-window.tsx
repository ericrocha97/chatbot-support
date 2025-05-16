'use client'
import { CircleXIcon, SendIcon } from 'lucide-react'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect, useRef, useState } from 'react'

type Message = {
  id: string
  sender: 'user' | 'bot'
  text: string
}

interface ChatWindowProps {
  onClose: () => void
}

export function ChatWindow({ onClose }: Readonly<ChatWindowProps>) {
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSendMessage = async () => {
    if (!message.trim()) return
    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: message,
    }
    setChatMessages(msgs => [...msgs, userMsg])
    setMessage('')
    setLoading(true)
    try {
      console.log('Sending message:', message)
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: chatMessages.map(({ sender, text }) => ({
            role: sender === 'user' ? 'user' : 'model',
            parts: [{ text }],
          })),
        }),
      })
      const data = await res.json()
      const botMsg: Message = {
        id: crypto.randomUUID(),
        sender: 'bot',
        text: data.error || 'Erro ao obter resposta',
      }
      setChatMessages(msgs => [...msgs, botMsg])
    } catch (e) {
      setChatMessages(msgs => [
        ...msgs,
        {
          id: crypto.randomUUID(),
          sender: 'bot',
          text: 'Erro ao conectar com o servidor.',
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      handleSendMessage()
    }
  }

  // Scroll automático para a última mensagem
  const contentRef = useRef<HTMLDivElement>(null)
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [chatMessages, loading])

  function formatBotText(text: string): string {
    if (!text) return ''
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\n/g, '<br />')
    html = html.replace(/(^|<br \/>)(\d+)\.\s/g, '$1<strong>$2.</strong> ')
    return html
  }

  return (
    <div className="fixed bottom-0 right-0 flex flex-col z-50 w-full h-full max-w-full max-h-full sm:bottom-4 sm:right-4 sm:w-[400px] sm:h-[600px]">
      <Card className="w-full h-full flex flex-col sm:w-[400px] sm:h-[600px]">
        <CardHeader className="flex justify-between flex-row items-center">
          <CardTitle>Chat para suporte</CardTitle>
          <Button
            className="flex justify-center items-center"
            variant="destructive"
            size="icon"
            onClick={onClose}
            disabled={loading}
          >
            <CircleXIcon className="w-6 h-6" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto" ref={contentRef}>
          <div className="flex flex-col gap-2 ">
            <div className="mb-2 text-xs text-muted-foreground text-center">
              <span>
                Este chat é alimentado por IA e pode cometer erros. Não utilize
                respostas para decisões críticas sem validação profissional.
              </span>
            </div>
            {chatMessages.map(item => (
              <div
                key={item.id}
                className={`flex ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={'max-w-[85%]'}>
                  {item.sender === 'user' ? (
                    <div className="bg-chart-4 text-primary-foreground rounded-tr-xl rounded-bl-xl p-3 mb-3 whitespace-pre-wrap break-words">
                      <span className="font-semibold">Você: </span>
                      {item.text}
                    </div>
                  ) : (
                    <div
                      className="bg-chart-5 text-primary-foreground dark:text-secondary-foreground rounded-tr-xl rounded-bl-xl p-3 mb-3 whitespace-pre-wrap break-words prose prose-sm dark:prose-invert"
                      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                      dangerouslySetInnerHTML={{
                        __html: formatBotText(item.text),
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%]">
                  <div className="bg-chart-5 text-primary-foreground dark:text-secondary-foreground rounded-tr-xl rounded-bl-xl p-3 mb-3 opacity-70">
                    ContBill está digitando...
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <Input
            type="text"
            placeholder="Digite sua mensagem..."
            className="w-64"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={loading}
            ref={inputRef}
          />
          <Button
            onClick={handleSendMessage}
            className="flex justify-center items-center"
            size="icon"
            disabled={loading || !message.trim()}
          >
            <SendIcon className="w-6 h-6" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
