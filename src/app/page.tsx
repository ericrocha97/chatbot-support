'use client'
import { ChatWindow } from '@/components/chat-window'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MessageCircleQuestionIcon } from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const [showChat, setShowChat] = useState<boolean>(false)

  function handleCloseChat() {
    setShowChat(false)
  }

  return (
    <div className="mx-auto max-w-[800px] flex flex-col gap-6 py-8 px-2 sm:px-4">
      <Header title="ContBill - Contabilidade" />
      <div className="mb-4 p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-100 text-center text-xs border border-yellow-300 dark:border-yellow-700">
        <strong>Aviso:</strong> Esta página é apenas um exemplo de interface
        para demonstração de portfólio. Nenhuma informação aqui representa uma
        empresa real ou oferta de serviços contábeis.
      </div>

      <Card className="shadow-md border border-border/60">
        <CardHeader className="text-xl font-bold pb-2">
          Sobre a ContBill
        </CardHeader>
        <CardContent className="text-muted-foreground leading-relaxed pt-0">
          A ContBill é um escritório de contabilidade com mais de 10 anos de
          experiência. <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          commodo velit nec diam placerat.
        </CardContent>
      </Card>

      <Card className="shadow-md border border-border/60">
        <CardHeader className="text-xl font-bold pb-2">Serviços</CardHeader>
        <CardContent className="text-muted-foreground pt-0">
          <ul className="list-disc pl-5 space-y-1">
            <li>Contabilidade para empresas</li>
            <li>Imposto de Renda PF e PJ</li>
            <li>Assessoria fiscal e tributária</li>
            <li>Folha de pagamento</li>
            <li>Abertura e encerramento de empresas</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-md border border-border/60">
        <CardHeader className="text-xl font-bold pb-2">Depoimentos</CardHeader>
        <CardContent className="text-muted-foreground pt-0">
          <blockquote className="italic border-l-4 border-chart-5 pl-4 text-sm">
            “Lorem ipsum dolor sit amet, consectetur adipiscing elit. A ContBill
            tem sido essencial para o sucesso da minha empresa.”
          </blockquote>
          <div className="mt-2 text-xs not-italic text-right text-muted-foreground">
            – João da Silva, Empreendedor
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border border-border/60">
        <CardHeader className="text-xl font-bold pb-2">Contato</CardHeader>
        <CardContent className="text-muted-foreground pt-0">
          <div className="mb-1">Fale conosco:</div>
          <ul className="pl-4 space-y-1">
            <li>
              <span className="font-medium">📱 WhatsApp:</span> (45) 99999-9999
            </li>
            <li>
              <span className="font-medium">📧 Email:</span>{' '}
              contato@contbill.com.br
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-md border border-border/60">
        <CardHeader className="text-xl font-bold pb-2">Diferenciais</CardHeader>
        <CardContent className="text-muted-foreground pt-0">
          <ul className="list-disc pl-5 space-y-1">
            <li>Atendimento personalizado</li>
            <li>Equipe qualificada</li>
            <li>Transparência e ética</li>
            <li>Tecnologia de ponta</li>
          </ul>
        </CardContent>
      </Card>

      {/* Botão flutuante para abrir o chat */}
      <div className="fixed bottom-4 right-4 z-10">
        {showChat && <ChatWindow onClose={handleCloseChat} />}
        <Button
          className="w-12 h-12 flex justify-center items-center bg-chart-5 dark:bg-chart-5-dark text-white dark:text-white hover:bg-chart-2 dark:hover:bg-chart-2-dark"
          variant="outline"
          size="icon"
          onClick={() => setShowChat(!showChat)}
        >
          <MessageCircleQuestionIcon className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}
