"use client";

import { MessageCircleQuestionIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingChatButtonProps {
  onClick: () => void;
}

export function FloatingChatButton({
  onClick,
}: Readonly<FloatingChatButtonProps>) {
  return (
    <Button
      className="flex h-12 w-12 items-center justify-center bg-chart-5 text-white hover:bg-chart-2 dark:bg-chart-5-dark dark:text-white dark:hover:bg-chart-2-dark"
      onClick={onClick}
      size="icon"
      variant="outline"
    >
      <MessageCircleQuestionIcon className="h-6 w-6" />
    </Button>
  );
}
