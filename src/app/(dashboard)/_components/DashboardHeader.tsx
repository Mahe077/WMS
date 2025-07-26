"use client"

import Image from "next/image"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NotificationButton } from "@/components/common/notification-button"
import { useApp } from "@/contexts/app-context"
import { WarehouseSelector } from "@/components/common/warehouse-selector"

interface DashboardHeaderProps {
  toggleNotificationPanel: () => void;
  unreadNotificationCount: number;
}

export function DashboardHeader({ toggleNotificationPanel, unreadNotificationCount }: DashboardHeaderProps) {
  const { state, dispatch } = useApp();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 lg:px-6 py-3 z-50 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left Section - Logo and Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
          >
            {state.sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image src="/wla.png" alt="Logo" width={40} height={40} unoptimized={true} className="h-7 w-19 lg:h-8 lg:w-20" priority />
            </div>
            <div className="hidden sm:flex sm:flex-col">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">Waratah Logistics</h1>
              <span className="text-xs text-gray-500 hidden sm:block">Manage you Inventory</span>
            </div>
            <Badge variant="secondary" className="hidden md:inline-flex bg-blue-50 text-blue-700 border-blue-200">
              v2.1.0
            </Badge>
          </div>
        </div>

        {/* Right Section - Actions and User */}
        <div className="flex items-center space-x-2 lg:space-x-3">
          {/* Notifications */}
          <NotificationButton onToggle={toggleNotificationPanel} unreadCount={unreadNotificationCount} />
          <WarehouseSelector />
        </div>
      </div>
    </header>
  );
}
