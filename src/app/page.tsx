"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  Truck,
  BarChart3,
  Users,
  AlertTriangle,
  Clock,
  Warehouse,
  FileText,
  RefreshCw,
  Settings,
  Menu,
  X,
  Layers,
  Calendar,
  Package2,
  LogOut,
} from "lucide-react"
// import { ReceivingModule } from "@/components/receiving-module"
// import { InventoryModule } from "@/components/inventory-module"
// import { InventoryPalletView } from "@/components/inventory-pallet-view"
// import { BaySlotBooking } from "@/components/bay-slot-booking"
// import { DockSchedulingModule } from "@/components/dock-scheduling-module"
// import { Warehouse3DView } from "@/components/warehouse-3d-view"
// import { OrderFulfillmentModule } from "@/components/order-fulfillment-module"
// import { DispatchModule } from "@/components/dispatch-module"
// import { ReturnsModule } from "@/components/returns-module"
// import { ReportsModule } from "@/components/reports-module"
// import { UserManagementModule } from "@/components/user-management-module"
import { ProtectedComponent } from "@/components/common/protected-component"
import { ProtectedRoute } from "@/components/common/protected-route"
import { NotificationToast } from "@/components/common/notification-toast"
import { Stat, Alert } from "@/lib/types"
import { AlertType } from "@/lib/enum"
import { useApp, useNotifications } from "@/contexts/app-context"
import { useAuth } from "@/contexts/auth-context"

function WMSDashboardContent() {
  const { state, dispatch } = useApp()
  const { addNotification } = useNotifications()
  const { state: authState, logout, can } = useAuth()

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
    { id: "pallet-view", label: "Pallet View", icon: Package2, permission: "view:inventory" },
    { id: "bay-booking", label: "Bay Booking", icon: Calendar, permission: "view:dispatch" },
    { id: "dock-scheduling", label: "Dock Scheduling", icon: Truck, permission: "view:dispatch" },
    { id: "3d-view", label: "3D Warehouse", icon: Layers, permission: "view:inventory" },
    { id: "orders", label: "Orders", icon: FileText, permission: "view:orders" },
    { id: "dispatch", label: "Dispatch", icon: Truck, permission: "view:dispatch" },
    { id: "returns", label: "Returns", icon: RefreshCw, permission: "view:returns" },
    { id: "reports", label: "Reports", icon: BarChart3, permission: "view:reports" },
    { id: "users", label: "Users", icon: Users, permission: "view:users", role: ["admin", "manager"] },
  ]

  const handleModuleChange = (moduleId: string) => {
    dispatch({ type: "SET_ACTIVE_MODULE", payload: moduleId })
    dispatch({ type: "SET_SIDEBAR_OPEN", payload: false })

    // Add navigation notification
    const navItem = navigationItems.find((item) => item.id === moduleId)
    if (navItem) {
      addNotification({
        type: "info",
        message: `Switched to ${navItem.label} module`,
      })
    }
  }

  const renderActiveModule = () => {
    switch (state.activeModule) {
      // case "receiving":
      //   return (
      //     <ProtectedComponent requiredPermission="view:receiving">
      //       <ReceivingModule />
      //     </ProtectedComponent>
      //   )
      // case "inventory":
      //   return (
      //     <ProtectedComponent requiredPermission="view:inventory">
      //       <InventoryModule />
      //     </ProtectedComponent>
      //   )
      // case "pallet-view":
      //   return (
      //     <ProtectedComponent requiredPermission="view:inventory">
      //       <InventoryPalletView />
      //     </ProtectedComponent>
      //   )
      // case "bay-booking":
      //   return (
      //     <ProtectedComponent requiredPermission="view:dispatch">
      //       <BaySlotBooking />
      //     </ProtectedComponent>
      //   )
      // case "dock-scheduling":
      //   return (
      //     <ProtectedComponent requiredPermission="view:dispatch">
      //       <DockSchedulingModule />
      //     </ProtectedComponent>
      //   )
      // case "3d-view":
      //   return (
      //     <ProtectedComponent requiredPermission="view:inventory">
      //       <Warehouse3DView />
      //     </ProtectedComponent>
      //   )
      // case "orders":
      //   return (
      //     <ProtectedComponent requiredPermission="view:orders">
      //       <OrderFulfillmentModule />
      //     </ProtectedComponent>
      //   )
      // case "dispatch":
      //   return (
      //     <ProtectedComponent requiredPermission="view:dispatch">
      //       <DispatchModule />
      //     </ProtectedComponent>
      //   )
      // case "returns":
      //   return (
      //     <ProtectedComponent requiredPermission="view:returns">
      //       <ReturnsModule />
      //     </ProtectedComponent>
      //   )
      // case "reports":
      //   return (
      //     <ProtectedComponent requiredPermission="view:reports">
      //       <ReportsModule />
      //     </ProtectedComponent>
      //   )
      // case "users":
      //   return (
      //     <ProtectedComponent requiredPermission="view:users" requiredRole={["admin", "manager"]}>
      //       <UserManagementModule />
      //     </ProtectedComponent>
      //   )
      default:
        return <DashboardContent stats={stats} alerts={alerts} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
            >
              {state.sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center space-x-2">
              <Warehouse className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">3PL WMS</h1>
            </div>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              v2.1.0
            </Badge>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-4">
            <ProtectedComponent requiredRole={["admin", "manager"]}>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </ProtectedComponent>

            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs lg:text-sm font-medium">
                  {authState.user?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("") || "JD"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium hidden sm:inline">{authState.user?.name || "John Doe"}</span>
                <span className="text-xs text-gray-500 hidden sm:inline capitalize">{authState.user?.role}</span>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={() => logout()}>
              <LogOut className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </header>

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

            {/* TODO:remove this part not needed */}
            <div className="pt-6 mt-6 border-t border-gray-200">
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
            </div>
          </div>
        </nav>

        {/* Overlay for mobile */}
        {state.sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
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

function DashboardContent({ stats, alerts }: { stats: Stat[]; alerts: Alert[] }) {
  const { addNotification } = useNotifications()
  const { can } = useAuth()

  const handleQuickAction = (action: string) => {
    addNotification({
      type: "success",
      message: `${action} initiated successfully`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of warehouse operations</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}>{stat.change}</span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    alert.type === "error" ? "bg-red-500" : alert.type === "warning" ? "bg-orange-500" : "bg-blue-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium break-words">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProtectedComponent requiredPermission="view:receiving">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => handleQuickAction("New Receipt Processing")}
              >
                <Package className="h-4 w-4 mr-2" />
                Process New Receipt
              </Button>
            </ProtectedComponent>

            <ProtectedComponent requiredPermission="view:orders">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => handleQuickAction("Pick List Creation")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Create Pick List
              </Button>
            </ProtectedComponent>

            <ProtectedComponent requiredPermission="view:dispatch">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => handleQuickAction("Dispatch Scheduling")}
              >
                <Truck className="h-4 w-4 mr-2" />
                Schedule Dispatch
              </Button>
            </ProtectedComponent>

            <ProtectedComponent requiredPermission="view:reports">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => handleQuickAction("Report Generation")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </ProtectedComponent>
          </CardContent>
        </Card>
      </div>
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
