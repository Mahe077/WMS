"use client"

import { useEffect } from "react"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/contexts/app-context"

export function NotificationToast() {
  const { notifications, removeNotification } = useNotifications()

  useEffect(() => {
    notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        removeNotification(notification.id)
      }, 5000)

      return () => clearTimeout(timer)
    })
  }, [notifications, removeNotification])

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification, index) => {
        const Icon = {
          success: CheckCircle,
          error: AlertCircle,
          warning: AlertTriangle,
          info: Info,
        }[notification.type]

        const bgColor = {
          success: "bg-green-50 border-green-200",
          error: "bg-red-50 border-red-200",
          warning: "bg-orange-50 border-orange-200",
          info: "bg-blue-50 border-blue-200",
        }[notification.type]

        const iconColor = {
          success: "text-green-600",
          error: "text-red-600",
          warning: "text-orange-600",
          info: "text-blue-600",
        }[notification.type]

        return (
          <div
            key={`${notification.id}-${index}`}
            className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg max-w-sm ${bgColor}`}
          >
            <Icon className={`h-5 w-5 ${iconColor}`} />
            <div className="flex-1">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeNotification(notification.id)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )
      })}
    </div>
  )
}
