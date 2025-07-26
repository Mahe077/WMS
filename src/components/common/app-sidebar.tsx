"use client"

import type React from "react"

import {
  BarChart3,
  Calendar,
  FileText,
  Layers,
  LogOut,
  Package,
  Package2,
  RefreshCw,
  Truck,
  Users,
  Warehouse,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/features/auth/hooks/useAuth"
import Image from "next/image"

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  permission?: string
  role?: string[]
}

interface NavigationGroup {
  label: string
  items: NavigationItem[]
}

interface AppSidebarProps {
  onModuleChange: (moduleId: string) => void
  onLogout: () => void
  activeModule: string
}

export function AppSidebar({ onModuleChange, onLogout, activeModule }: AppSidebarProps) {
  const { state: authState, can } = useAuth()

  const navigationGroups: NavigationGroup[] = [
    {
      label: "Overview",
      items: [
        { id: "dashboard", label: "Dashboard", icon: BarChart3 },
        { id: "reports", label: "Reports & Analytics", icon: BarChart3, permission: "view:reports" },
      ],
    },
    {
      label: "Warehouse Operations",
      items: [
        { id: "receiving", label: "Receiving & ASN", icon: Package, permission: "view:receiving" },
        { id: "inventory", label: "Inventory Management", icon: Warehouse, permission: "view:inventory" },
        { id: "pallet-view", label: "Pallet View", icon: Package2, permission: "view:inventory" },
        { id: "3d-view", label: "3D Warehouse", icon: Layers, permission: "view:inventory" },
      ],
    },
    {
      label: "Order Operations",
      items: [
        { id: "orders", label: "Order Fulfillment", icon: FileText, permission: "view:orders" },
        { id: "returns", label: "Returns Processing", icon: RefreshCw, permission: "view:returns" },
      ],
    },
    {
      label: "Logistics & Dispatch",
      items: [
        { id: "bay-booking", label: "Bay Booking", icon: Calendar, permission: "view:dispatch" },
        { id: "dock-scheduling", label: "Dock Scheduling", icon: Truck, permission: "view:dispatch" },
        { id: "dispatch", label: "Dispatch Management", icon: Truck, permission: "view:dispatch" },
      ],
    },
    {
      label: "Administration",
      items: [
        { id: "users", label: "User Management", icon: Users, permission: "view:users", role: ["admin", "manager"] },
      ],
    },
  ]

  const hasItemPermission = (item: NavigationItem) => {
    const hasPermission = !item.permission || can(item.permission)
    const hasRequiredRole = !item.role || (authState.user && item.role.includes(authState.user.role))
    return hasPermission && hasRequiredRole
  }

  const hasGroupPermission = (group: NavigationGroup) => {
    return group.items.some(hasItemPermission)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex h-10 items-center justify-center rounded-lg px-2">
                <Image src="/wla.png" alt="Logo" width={80} height={40} className="h-6 w-auto" priority />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">3PL WMS</span>
                <span className="truncate text-xs">Warehouse Management</span>
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                v2.1.0
              </Badge>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navigationGroups.map((group) => {
          if (!hasGroupPermission(group)) return null

          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    if (!hasItemPermission(item)) return null

                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={activeModule === item.id}
                          onClick={() => onModuleChange(item.id)}
                          tooltip={item.label}
                          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                <Users className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{authState.user?.name}</span>
                <span className="truncate text-xs text-muted-foreground">{authState.user?.email}</span>
              </div>
              <Badge variant="outline" className="text-xs capitalize">
                {authState.user?.role}
              </Badge>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onLogout}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              tooltip="Logout"
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
