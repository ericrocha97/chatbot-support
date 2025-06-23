'use client'

import { Button } from '@/components/ui/button'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { CircleXIcon } from 'lucide-react'

interface ChatHeaderProps {
  loading: boolean
  onClose: () => void
}

export function ChatHeader({ loading, onClose }: Readonly<ChatHeaderProps>) {
  return (
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
  )
}
