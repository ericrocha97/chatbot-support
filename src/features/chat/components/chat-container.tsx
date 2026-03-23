"use client";

import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface ChatContainerProps {
  children: ReactNode;
}

export function ChatContainer({ children }: Readonly<ChatContainerProps>) {
  return (
    <div className="fixed right-0 bottom-0 z-50 flex h-full max-h-full w-full max-w-full flex-col sm:right-4 sm:bottom-4 sm:h-[600px] sm:w-[400px]">
      <Card className="flex h-full w-full flex-col sm:h-[600px] sm:w-[400px]">
        {children}
      </Card>
    </div>
  );
}
