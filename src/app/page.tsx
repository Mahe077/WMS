"use client"

import { useState } from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  Truck,
  BarChart3,
  Users,
  Clock,
  Warehouse,
  FileText,
  RefreshCw,
  // Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react"
import { LoadingDemo } from "@/components/ui/loading-demo"
import { ProtectedComponent } from "@/components/common/protected-component"
import { ProtectedRoute } from "@/components/common/protected-route"
import { NotificationToast } from "@/components/common/notification-toast"
import { AlertType } from "@/lib/enum"
import { useApp, useNotifications } from "@/contexts/app-context"
import { useAuth } from "@/contexts/auth-context"
import { useUrlSync } from "@/hooks/use-url-sync"

import { UserProfileButton } from "@/components/common/user-profile-button"
import { NotificationButton } from "@/components/common/notification-button"
import { SettingsPanel } from "@/components/common/settings-panel"
import { NotificationPanel } from "@/components/common/notification-panel"
import { LogoutConfirmDialog } from "@/components/common/logout-confirm-dialog"

import { InventoryModule } from "@/components/modules/inventory-module"
import { DockSchedulingModule } from "@/components/modules/dock-scheduling-module"
import { OrderFulfillmentModule } from "@/components/modules/order-fulfillment-module"
import { DashboardModule } from "@/components/modules/dashboard-module"
import InventoryPalletView from "@/components/modules/inventory-pallet-view"
import { DispatchModule } from "@/components/modules/dispatch-module"
import { ReturnsModule } from "@/components/modules/returns-module"
import { ReportsModule } from "@/components/modules/reports-module"
import { UserManagementModule } from "@/components/modules/user-management-module"
import { ReceivingModule } from "@/components/modules/receiving-module"

function WMSDashboardContent() {
  const { state, dispatch } = useApp()
  const { addNotification } = useNotifications()
  const { state: authState, logout, can } = useAuth()

  // Add URL synchronization
  useUrlSync()

  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false)
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  // const [userMenuOpen, setUserMenuOpen] = useState(false)

  const stats = [
    {
      title: "Active Orders",
      value: 247,
      change: "+12%",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Inventory Items",
      value: 15432,
      change: "+3%",
      icon: Warehouse,
      color: "text-green-600",
    },
    {
      title: "Pending Shipments",
      value: 89,
      change: "-5%",
      icon: Truck,
      color: "text-orange-600",
    },
    {
      title: "Returns Processing",
      value: 23,
      change: "+8%",
      icon: RefreshCw,
      color: "text-purple-600",
    },
  ]

  const alerts = [
    { type: AlertType.Warning, message: "Low stock alert: SKU-12345 (Qty: 15)", time: "2 hours ago" },
    { type: AlertType.Info, message: "New ASN received: ASN-2024-001", time: "4 hours ago" },
    { type: AlertType.Error, message: "QC Hold: Damaged goods in Bay A-12", time: "6 hours ago" },
  ]

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, permission: null },
    { id: "receiving", label: "Receiving", icon: Package, permission: "view:receiving" },
    { id: "inventory", label: "Inventory", icon: Warehouse, permission: "view:inventory" },
    { id: "dock-scheduling", label: "Dock Scheduling", icon: Truck, permission: "view:dispatch" },
    { id: "orders", label: "Orders", icon: FileText, permission: "view:orders" },
    { id: "dispatch", label: "Dispatch", icon: Truck, permission: "view:dispatch" },
    { id: "returns", label: "Returns", icon: RefreshCw, permission: "view:returns" },
    { id: "reports", label: "Reports", icon: BarChart3, permission: "view:reports" },
    { id: "users", label: "Users", icon: Users, permission: "view:users", role: ["admin", "manager"] },
    // { id: "settings", label: "Settings", icon: Settings, permission: "view:settings", role: ["admin", "manager"] },
    { id: "loading-demo", label: "Loading Demo", icon: Clock, permission: null }, // For demo purposes
  ]

  const handleModuleChange = (moduleId: string) => {
    // The URL sync hook will handle the actual navigation
    dispatch({ type: "SET_ACTIVE_MODULE", payload: moduleId })
    dispatch({ type: "SET_SIDEBAR_OPEN", payload: false })

    navigationItems.find((item) => item.id === moduleId);
  };

  const renderActiveModule = () => {
    switch (state.activeModule) {
      case "receiving":
        return (
          <ProtectedComponent requiredPermission="view:receiving">
            <ReceivingModule />
          </ProtectedComponent>
        )
      case "inventory":
        return (
          <ProtectedComponent requiredPermission="view:inventory">
            <InventoryModule />
          </ProtectedComponent>
        )
      case "pallet-view":
        return (
          <ProtectedComponent requiredPermission="view:inventory">
            <InventoryPalletView />
          </ProtectedComponent>
        )
      case "dock-scheduling":
        return (
          <ProtectedComponent requiredPermission="view:dispatch">
            <DockSchedulingModule />
          </ProtectedComponent>
        )
      case "orders":
        return (
          <ProtectedComponent requiredPermission="view:orders">
            <OrderFulfillmentModule />
          </ProtectedComponent>
        )
      case "dispatch":
        return (
          <ProtectedComponent requiredPermission="view:dispatch">
            <DispatchModule />
          </ProtectedComponent>
        )
      case "returns":
        return (
          <ProtectedComponent requiredPermission="view:returns">
            <ReturnsModule />
          </ProtectedComponent>
        )
      case "reports":
        return (
          <ProtectedComponent requiredPermission="view:reports">
            <ReportsModule />
          </ProtectedComponent>
        )
      case "users":
        return (
          <ProtectedComponent requiredPermission="view:users" requiredRole={["admin", "manager"]}>
            <UserManagementModule />
          </ProtectedComponent>
        )
      case "loading-demo":
        return (
          <div className="flex items-center justify-center h-full">
            <LoadingDemo />
          </div>
        )
      default:
        return <DashboardModule stats={stats} alerts={alerts} />
    }
  }

  const handleLogout = () => {
    logout()
    setShowLogoutDialog(false)
    addNotification({
      type: "info",
      message: "You have been logged out successfully",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 sticky top-0 z-40 shadow-sm">
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
                <Image src="/wla.png" alt="Logo" width={40} height={40} className="h-8 w-8 lg:h-8 lg:w-22" priority />
                {/* <Warehouse className="h-8 w-8 lg:h-10 lg:w-10 text-blue-600" /> */}
                {/* <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div> */}
              </div>
              <div className="flex flex-col">
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
            <NotificationButton onToggle={() => setNotificationPanelOpen(true)} unreadCount={10} />

            {/* Settings Panel Toggle - Desktop Only */}
            {/* <ProtectedComponent requiredRole={["admin", "manager"]}>
              <Button
                variant="ghost"
                size="sm"
                className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setSettingsPanelOpen(true)}
              >
                <Settings className="h-5 w-5 text-gray-600" />
              </Button>
            </ProtectedComponent> */}

            {/* User Profile */}
            <UserProfileButton onLogout={logout} />
          </div>
        </div>
      </header>

      {/* Settings Side Panel */}
      <SettingsPanel isOpen={settingsPanelOpen} onClose={() => setSettingsPanelOpen(false)} />

      {/* Notification Panel */}
      <NotificationPanel isOpen={notificationPanelOpen} onClose={() => setNotificationPanelOpen(false)} />

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog
        isOpen={showLogoutDialog}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutDialog(false)}
      />

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav
          className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${state.sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <div className="p-4 pt-20 lg:pt-4">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                // Check if user has permission to see this item
                const hasPermission = !item.permission || can(item.permission)
                const hasRequiredRole = !item.role || (authState.user && item.role.includes(authState.user.role))

                if (!hasPermission || !hasRequiredRole) return null

                return (
                  <Button
                    key={item.id}
                    variant={state.activeModule === item.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleModuleChange(item.id)}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                )
              })}
            </div>

            {/* Mobile-only logout section */}
            {/* <div className="lg:hidden pt-6 mt-6 border-t border-gray-200"> */}
            <div className="pt-6 mt-6 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => {
                  dispatch({ type: "SET_SIDEBAR_OPEN", payload: false })
                  setShowLogoutDialog(true)
                }}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </Button>
            </div>


            {/* TODO:remove this part not needed */}
            {/* <div className="pt-6 mt-6 border-t border-gray-200">
              <div className="px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                User Information
              </div>
              <div className="px-2 py-1 text-sm">
                <div className="font-medium">{authState.user?.name}</div>
                <div className="text-xs text-gray-500">{authState.user?.email}</div>
                <div className="mt-1 flex items-center">
                  <Badge variant="outline" className="text-xs capitalize">
                    {authState.user?.role}
                  </Badge>
                </div>
              </div>
            </div> */}
          </div>
        </nav>

        {/* Overlay for mobile */}
        {state.sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => dispatch({ type: "SET_SIDEBAR_OPEN", payload: false })}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 min-h-screen">
          {state.loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            renderActiveModule()
          )}
        </main>
      </div>

      <NotificationToast />
    </div>
  )
}


export default function WMSDashboard() {
  return (
    <ProtectedRoute>
      <WMSDashboardContent />
    </ProtectedRoute>
  )
}
