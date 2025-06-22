"use client"

import React from "react";
import { Button } from "@/components/ui/button"
import { BellDot } from "lucide-react"

interface NotificationButtonProps {
  onToggle: () => void
  unreadCount: number
}

export function NotificationButton({
  onToggle,
  unreadCount,
}: NotificationButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      onClick={onToggle}
    >
      <div className="relative">
        <BellDot className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <React.Fragment>
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          </React.Fragment>
        )}
      </div>
    </Button>
  );
}
