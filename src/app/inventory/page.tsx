"use client"

import { useEffect } from "react"
import { useApp } from "@/contexts/app-context"
import { ProtectedRoute } from "@/components/common/protected-route"
import { InventoryModule } from "@/components/modules/inventory-module"
import { ProtectedComponent } from "@/components/common/protected-component"

export default function InventoryPage() {
  const { dispatch } = useApp()

  useEffect(() => {
    dispatch({ type: "SET_ACTIVE_MODULE", payload: "inventory" })
  }, [dispatch])

  return (
    <ProtectedRoute>
      <ProtectedComponent requiredPermission="view:inventory">
        <div className="min-h-screen bg-gray-50">
          <InventoryModule />
        </div>
      </ProtectedComponent>
    </ProtectedRoute>
  )
}
