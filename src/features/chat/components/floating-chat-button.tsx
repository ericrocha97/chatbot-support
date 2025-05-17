'use client'

import { Button } from '@/components/ui/button'
import { MessageCircleQuestionIcon } from 'lucide-react'

interface FloatingChatButtonProps {
  onClick: () => void
}

export function FloatingChatButton({ onClick }: FloatingChatButtonProps) {
  return (
    <Button
      className="w-12 h-12 flex justify-center items-center bg-chart-5 dark:bg-chart-5-dark text-white dark:text-white hover:bg-chart-2 dark:hover:bg-chart-2-dark"
      variant="outline"
      size="icon"
      onClick={onClick}
    >
      <MessageCircleQuestionIcon className="w-6 h-6" />
    </Button>
  )
}
