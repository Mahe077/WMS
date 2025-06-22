"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"

interface NotificationButtonProps {
  onToggle: () => void
  unreadCount: number
}

export function NotificationButton({ onToggle, unreadCount }: NotificationButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      onClick={onToggle}
    >
      <Bell className="h-5 w-5 text-gray-600" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </Badge>
      )}
    </Button>
  )
}
