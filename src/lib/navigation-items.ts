import {
  Package,
  Truck,
  BarChart3,
  Users,
  Clock,
  Warehouse,
  FileText,
  RefreshCw,
  Forklift,
  Database,
  Blocks,
  Container,
  CalendarCheck,
} from "lucide-react"

export const navigationItems = [
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
