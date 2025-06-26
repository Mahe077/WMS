"use client"

import { useEffect } from "react"
import { useApp } from "@/contexts/app-context"
import { ProtectedRoute } from "@/components/common/protected-route"
// import { OrderFulfillmentModule } from "@/components/order-fulfillment-module"
import { ProtectedComponent } from "@/components/common/protected-component"

export default function OrdersPage() {
  const { dispatch } = useApp()

  useEffect(() => {
    dispatch({ type: "SET_ACTIVE_MODULE", payload: "orders" })
  }, [dispatch])

  return (
    <ProtectedRoute>
      <ProtectedComponent requiredPermission="view:orders">
        <div className="min-h-screen bg-gray-50">
          {/* <OrderFulfillmentModule /> */}
        </div>
      </ProtectedComponent>
    </ProtectedRoute>
  )
}
