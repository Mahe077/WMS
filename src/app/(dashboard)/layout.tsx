"use client"

import { DashboardLayoutClient } from "./_components/DashboardLayoutClient"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayoutClient>
      {children}
    </DashboardLayoutClient>
  )
}
