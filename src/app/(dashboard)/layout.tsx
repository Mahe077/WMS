"use client"

import { Suspense, useCallback, useMemo, useState } from "react"

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, permission: "dashboard.view", href: "/dashboard" },
  { id: "master-data", label: "Master Data", icon: Database, permission: "master-data.view", href: "/master-data" },
  { id: "receiving", label: "Receiving", icon: Container, permission: "receiving.view", href: "/receiving" },
  { id: "putaway", label: "Put Away", icon: Forklift, permission: "putaway.view", href: "/putaway" },
  { id: "inventory", label: "Inventory", icon: Warehouse, permission: "inventory.view", href: "/inventory" },
  { id: "movements", label: "Movements", icon: Package, permission: "movements.view", href: "/movements" },
  { id: "palletization", label: "Palletization", icon: Blocks, permission: "palletization.view", href: "/palletization" },
  { id: "dock-scheduling", label: "Dock Scheduling", icon: CalendarCheck, permission: "dock-scheduling.view", href: "/dock-scheduling" },
  { id: "orders", label: "Orders", icon: FileText, permission: "order-fulfillment.view", href: "/order-fulfillment" },
  { id: "dispatch", label: "Dispatch", icon: Truck, permission: "dispatch.view", href: "/dispatch" },
  { id: "returns", label: "Returns", icon: RefreshCw, permission: "returns.view", href: "/returns" },
  { id: "reports", label: "Reports", icon: FileText, permission: "reports.view", href: "/reports" },
  { id: "users", label: "Users", icon: Users, permission: "user-management.view", role: ["admin", "manager"], href: "/user-management" },
  { id: "loading-demo", label: "Loading Demo", icon: Clock, permission: null, href: "/loading-demo" }, // For demo purposes
]
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

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
  Menu,
  X,
  LogOut,
  Forklift,
  Database,
  Blocks,
  Container,
  CalendarCheck,
  Settings,
} from "lucide-react"

import { NotificationToast } from "@/components/common/notification-toast"
import { useApp } from "@/contexts/app-context"

import { UserProfileButton } from "@/components/common/user-profile-button"
import { NotificationButton } from "@/components/common/notification-button"
import { SettingsPanel } from "@/components/common/settings-panel"
import { NotificationPanel } from "@/components/common/notification-panel"
import { LogoutConfirmDialog } from "@/components/common/logout-confirm-dialog"
import { ProtectedRoute } from "@/components/common/protected-route"

import { useAuth } from "@/features/auth/hooks/useAuth"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/common/app-sidebar"
import { ProtectedComponent } from "@/components/common/protected-component"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useApp()
  const { state: authState, logout, can } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false)
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleModuleChange = useCallback((href: string) => {
    router.push(href)
    dispatch({ type: "SET_SIDEBAR_OPEN", payload: false })
  }, [router, dispatch])

  const handleLogout = useCallback(() => {
    logout()
    setShowLogoutDialog(false)
  }, [logout])

  // const toggleSettingsPanel = useCallback(() => {
  //   setSettingsPanelOpen(prev => !prev)
  // }, [])

  const toggleNotificationPanel = useCallback(() => {
    setNotificationPanelOpen(prev => !prev)
  }, [])

  const closeSettingsPanel = useCallback(() => {
    setSettingsPanelOpen(false)
  }, [])

  const closeNotificationPanel = useCallback(() => {
    setNotificationPanelOpen(false)
  }, [])

  // const openLogoutDialog = useCallback(() => {
  //   setShowLogoutDialog(true)
  // }, [])

  const closeLogoutDialog = useCallback(() => {
    setShowLogoutDialog(false)
  }, [])

  const memoizedNavigationItems = useMemo(() => {
    return navigationItems.map((item) => {
      const hasPermission = !item.permission || can(item.permission)
      const hasRequiredRole = !item.role || (authState.user && item.role.includes(authState.user.role))

      if (!hasPermission || !hasRequiredRole) return null

      return (
        <Button
          key={item.id}
          variant={pathname.startsWith(item.href) ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleModuleChange(item.href)}
        >
          <item.icon className="h-4 w-4 mr-3" />
          {item.label}
        </Button>
      )
    })
  }, [pathname, can, authState.user, handleModuleChange])

    const getModuleTitle = () => {
    const moduleMap: Record<string, string> = {
      dashboard: "Dashboard",
      receiving: "Receiving & ASN Processing",
      inventory: "Inventory Management",
      "order-fulfillment": "Order Fulfillment",
      dispatch: "Dispatch Management",
      returns: "Returns Processing",
      reports: "Reports & Analytics",
      "user-management": "User Management",
      "pallet-view": "Pallet View",
      "bay-booking": "Bay Booking",
      "3d-view": "3D Warehouse View",
      "dock-scheduling": "Dock Scheduling",
    }
    return moduleMap[state.activeModule] || "Dashboard"
  }
  
  return (
    // <ProtectedRoute>
    //   {/* <div className="min-h-screen bg-gray-50">
    //     {/* Header */}
    //     <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 sticky top-0 z-40 shadow-sm">
    //       <div className="flex items-center justify-between">
    //         {/* Left Section - Logo and Mobile Menu */}
    //         <div className="flex items-center space-x-4">
    //           {/* Mobile Menu Toggle */}
    //           <Button
    //             variant="ghost"
    //             size="sm"
    //             className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
    //             onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
    //           >
    //             {state.sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    //           </Button>

    //           {/* Logo Section */}
    //           <div className="flex items-center space-x-3">
    //             <div className="relative">
    //               <Image src="/wla.png" alt="Logo" width={40} height={40} className="h-8 w-8 lg:h-8 lg:w-22" priority />
    //             </div>
    //             <div className="flex flex-col">
    //               <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">Waratah Logistics</h1>
    //               <span className="text-xs text-gray-500 hidden sm:block">Manage you Inventory</span>
    //             </div>
    //             <Badge variant="secondary" className="hidden md:inline-flex bg-blue-50 text-blue-700 border-blue-200">
    //               v2.1.0
    //             </Badge>
    //           </div>
    //         </div>

    //         {/* Right Section - Actions and User */}
    //         <div className="flex items-center space-x-2 lg:space-x-3">
    //           {/* Notifications */}
    //           <NotificationButton onToggle={toggleNotificationPanel} unreadCount={10} />

    //           {/* User Profile */}
    //           <UserProfileButton/>
    //         </div>
    //       </div>
    //     </header>

    //     {/* Settings Side Panel */}
    //     <SettingsPanel isOpen={settingsPanelOpen} onClose={closeSettingsPanel} />

    //     {/* Notification Panel */}
    //     <NotificationPanel isOpen={notificationPanelOpen} onClose={closeNotificationPanel} />

    //     {/* Logout Confirmation Dialog */}
    //     <LogoutConfirmDialog
    //       isOpen={showLogoutDialog}
    //       onConfirm={handleLogout}
    //       onCancel={closeLogoutDialog}
    //     />

    //     <div className="flex">
    //       {/* Sidebar Navigation */}
    //       <nav
    //         className={`
    //         fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
    //         ${state.sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    //       `}
    //       >
    //         <div className="p-4 pt-20 lg:pt-4">
    //           <div className="space-y-1">
    //             {memoizedNavigationItems}
    //           </div>

    //           {/* Mobile-only logout section */}
    //           <div className="pt-6 mt-6 border-t border-gray-200">
    //             <Button
    //               variant="ghost"
    //               className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
    //               onClick={() => {
    //                 dispatch({ type: "SET_SIDEBAR_OPEN", payload: false })
    //                 setShowLogoutDialog(true)
    //               }}
    //             >
    //               <LogOut className="h-4 w-4 mr-3" />
    //               Logout
    //             </Button>
    //           </div>
    //         </div>
    //       </nav>

    //       {/* Overlay for mobile */}
    //       {state.sidebarOpen && (
    //         <div
    //           className="fixed inset-0 bg-black/50 z-20 lg:hidden"
    //           onClick={() => dispatch({ type: "SET_SIDEBAR_OPEN", payload: false })}
    //         />
    //       )}

    //       {/* Main Content */}
    //       <main className="flex-1 p-4 lg:p-6 min-h-screen">
    //         <Suspense fallback={
    //           <div className="flex items-center justify-center h-64">
    //             <LoadingSpinner variant="default" size="sm" />
    //           </div>
    //         }>
    //           {children}
    //         </Suspense>
    //       </main>
    //     </div>

    //     <NotificationToast />
    //   </div> */}
    // </ProtectedRoute>
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar
          onModuleChange={handleModuleChange}
          onLogout={() => setShowLogoutDialog(true)}
          activeModule={state.activeModule}
        />
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">3PL WMS</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getModuleTitle()}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
              {/* <div className="flex items-center space-x-3">
              <div className="relative">
                <Image src="/wla.png" alt="Logo" width={40} height={40} className="h-8 w-8 lg:h-8 lg:w-22" priority />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-gray-900 leading-tight">3PL WMS</h1>
                <span className="text-xs text-gray-500 hidden sm:block">Warehouse Management</span>
              </div>
            </div> */}
            </div>
            <div className="ml-auto flex items-center space-x-2 px-4">
              {/* Notifications */}
              <NotificationButton onToggle={toggleNotificationPanel} unreadCount={10} />

              {/* Settings Panel Toggle */}
              <ProtectedComponent requiredRole={["admin", "manager"]}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setSettingsPanelOpen(true)}
                >
                  <Settings className="h-4 w-4 text-gray-600" />
                </Button>
              </ProtectedComponent>

              {/* User Profile */}
              {/* <UserProfileButton /> */}
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

          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-gray-50">
            {state.loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Suspense fallback={<LoadingSpinner variant="default" size="sm" />}>
                {children}
              </Suspense>
            )}
          </div>

          <NotificationToast />
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}