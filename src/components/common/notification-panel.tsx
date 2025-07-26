"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  X,
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  AlertCircle,
  Trash2,
  BookMarkedIcon as MarkAsRead,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

// Assuming the Notification interface is defined in a separate file
interface Notification {
  id: string
  type: "success" | "warning" | "info" | "error"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionable?: boolean
}

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [notifications, setNotifications] = useState<Notification[]>([
    // Mock data - replace with real data fetching
    {
      id: "1",
      type: "warning",
      title: "Low Stock Alert",
      message: "SKU-12345 has only 15 units remaining",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      actionable: true,
    },
    {
      id: "2",
      type: "info",
      title: "New ASN Received",
      message: "ASN #ASN20230512 has been successfully received and is pending putaway.",
      timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
      read: false,
      actionable: true,
    },
    {
      id: "3",
      type: "error",
      title: "QC Hold",
      message: "Damaged goods reported for PO #PO12345. Immediate attention required.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true,
      actionable: true,
    },
    {
      id: "4",
      type: "success",
      title: "Shipment Dispatched",
      message: "Order #SO-98765 has been dispatched and is on its way.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      read: true,
      actionable: false,
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10); // Delay to allow rendering before animation
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 300); // Delay to allow animation to finish
    }
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-end`}
      onClick={handleOverlayClick}
    >
      {/* Optimized Overlay with backdrop blur */}
      <div
        className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300 ease-out ${isAnimating ? "opacity-100" : "opacity-0"}`}
      />

      {/* Optimized Panel with hardware acceleration */}
      <div
        className={`relative h-full w-full sm:w-96 lg:w-[420px] bg-white shadow-2xl flex flex-col transform transition-all duration-300 ease-out ${isAnimating ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"}`}
        style={{
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
          perspective: "1000px",
        }}
      >
        {/* Header with subtle animation */}
        <div
          className={`flex items-center justify-between p-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm transition-all duration-200 ease-out delay-100 ${isAnimating ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
        >
          <div className="flex items-center space-x-2">
            <div
              className={`transition-transform duration-200 ease-out delay-150 ${isAnimating ? "rotate-0 scale-100" : "-rotate-12 scale-75"}`}
            >
              <Bell className="h-5 w-5 text-gray-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className={`h-5 px-2 text-xs transition-all duration-200 ease-out delay-200 ${isAnimating ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
              >
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className={`transition-all duration-200 ease-out hover:scale-110 active:scale-95 ${isAnimating ? "rotate-0 opacity-100" : "rotate-90 opacity-0"}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div
            className={`flex items-center justify-between p-2 border-b border-gray-100 transition-all duration-300 ease-out delay-200 ${isAnimating ? "opacity-100" : "opacity-0"}`}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              <MarkAsRead className="h-3 w-3 mr-1" />
              Mark all as read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          </div>
        )}

        {/* Notifications List */}
        <ScrollArea className="flex-1">
          {notifications.length === 0 ? (
            <div className="flex flex-col pt-4 items-center justify-center h-full text-gray-500">
              <Bell className="h-12 w-12 mb-4 text-gray-300" />
              <p className="text-sm">No new notifications</p>
              <p className="text-xs text-gray-400">You&#39;re all caught up!</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-all duration-300 ease-out ${!notification.read ? getBgColor(notification.type) : "bg-gray-50 border-gray-200"} ${!notification.read ? "border-l-4" : ""}`}
                  style={{ transitionDelay: `${100 + index * 50}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="mt-1">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{notification.title}</h4>
                          {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1 ml-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {notification.actionable && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full text-xs"
                      onClick={() => {
                        markAsRead(notification.id);
                        // Handle action based on notification type
                      }}
                    >
                      View Details
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}