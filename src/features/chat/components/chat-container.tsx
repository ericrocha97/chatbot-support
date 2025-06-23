'use client'

import { Card } from '@/components/ui/card'
import type { ReactNode } from 'react'

interface ChatContainerProps {
  children: ReactNode
}

export function ChatContainer({ children }: Readonly<ChatContainerProps>) {
  return (
    <div className="fixed bottom-0 right-0 flex flex-col z-50 w-full h-full max-w-full max-h-full sm:bottom-4 sm:right-4 sm:w-[400px] sm:h-[600px]">
      <Card className="w-full h-full flex flex-col sm:w-[400px] sm:h-[600px]">
        {children}
      </Card>
    </div>
  )
}
