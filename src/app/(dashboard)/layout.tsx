"use client"

import { DashboardLayoutClient } from "../../features/dashboard/components/dashboard-layout-client"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayoutClient>
      {children}
    </DashboardLayoutClient>
  )
}
