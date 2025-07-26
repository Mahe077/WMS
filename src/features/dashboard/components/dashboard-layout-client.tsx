"use client"

import { Suspense, useCallback, useState } from "react"

import { NotificationToast } from "@/components/common/notification-toast"

import { SettingsPanel } from "@/components/common/settings-panel"
import { NotificationPanel } from "@/components/common/notification-panel"
import { LogoutConfirmDialog } from "@/components/common/logout-confirm-dialog"
import { ProtectedRoute } from "@/components/common/protected-route"

import { useAuth } from "@/features/auth/hooks/useAuth"
import { PageSkeleton } from "@/components/common/page-skeleton"

import { DashboardHeader } from "./dashboard-header"
import { DashboardSidebar } from "./dashboard-sidebar"

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth()

  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false)
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = useCallback(() => {
    logout()
    setShowLogoutDialog(false)
  }, [logout])

  const toggleNotificationPanel = useCallback(() => {
    setNotificationPanelOpen(prev => !prev)
  }, [])

  const closeSettingsPanel = useCallback(() => {
    setSettingsPanelOpen(false)
  }, [])

  const closeNotificationPanel = useCallback(() => {
    setNotificationPanelOpen(false)
  }, [])

  const openLogoutDialog = useCallback(() => {
    setShowLogoutDialog(true)
  }, [])

  const closeLogoutDialog = useCallback(() => {
    setShowLogoutDialog(false)
  }, [])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader
          toggleNotificationPanel={toggleNotificationPanel}
          unreadNotificationCount={10} // This should probably come from a state or prop
        />

        {/* Settings Side Panel */}
        <SettingsPanel isOpen={settingsPanelOpen} onClose={closeSettingsPanel} />

        {/* Notification Panel */}
        <NotificationPanel isOpen={notificationPanelOpen} onClose={closeNotificationPanel} />

        {/* Logout Confirmation Dialog */}
        <LogoutConfirmDialog
          isOpen={showLogoutDialog}
          onConfirm={handleLogout}
          onCancel={closeLogoutDialog}
        />

        {/* Layout Container */}
        <div className="flex pt-16">
          {/* Fixed Sidebar Navigation */}
          <DashboardSidebar onShowLogoutDialog={openLogoutDialog} />

          {/* Main Content */}
          <main className="flex-1 min-h-screen p-4 lg:p-7 transition-all duration-300 ease-in-out
            lg:ml-64">
            <Suspense fallback={<PageSkeleton />}>
              {children}
            </Suspense>
          </main>
        </div>

        <NotificationToast />
      </div>
    </ProtectedRoute>
  )
}
