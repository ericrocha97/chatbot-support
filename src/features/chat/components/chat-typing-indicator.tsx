'use client'

export function ChatTypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%]">
        <div className="bg-chart-5 text-primary-foreground dark:text-secondary-foreground rounded-tr-xl rounded-bl-xl p-3 mb-3 opacity-70">
          ContBill está digitando...
        </div>
      </div>
    </div>
  )
}
