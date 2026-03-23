"use client";

export function ChatTypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%]">
        <div className="mb-3 rounded-tr-xl rounded-bl-xl bg-chart-5 p-3 text-primary-foreground opacity-70 dark:text-secondary-foreground">
          ContBill está digitando...
        </div>
      </div>
    </div>
  );
}
