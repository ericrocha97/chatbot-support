"use client";

import { CircleXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface ChatHeaderProps {
  loading: boolean;
  onClose: () => void;
}

export function ChatHeader({ loading, onClose }: Readonly<ChatHeaderProps>) {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Chat para suporte</CardTitle>
      <Button
        className="flex items-center justify-center"
        disabled={loading}
        onClick={onClose}
        size="icon"
        variant="destructive"
      >
        <CircleXIcon className="h-6 w-6" />
      </Button>
    </CardHeader>
  );
}
