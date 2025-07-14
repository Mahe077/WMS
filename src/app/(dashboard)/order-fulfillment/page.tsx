"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Package, AlertCircle} from "lucide-react"
import { ProtectedRoute } from "@/components/common/protected-route"
import { OrderStatus, PickListItemStages } from "@/lib/enum"
import { ActiveOrderView } from "@/features/order-fulfillment/components/active-order-view"
import { PickListView } from "@/features/order-fulfillment/components/pick-list-view"
import { Order, PickListItem } from "@/features/order-fulfillment/types/order.types"

export default function OrderFulfillmentPage() {
  const [selectedView, setSelectedView] = useState("orders")
  // Demo warehouse list
  const warehouses = [
    { id: "WH-001", name: "Sydney DC" },
    { id: "WH-002", name: "Melbourne DC" },
    { id: "WH-003", name: "Brisbane DC" },
  ]
  const [selectedWarehouse, setSelectedWarehouse] = useState(warehouses[0].id)

  const orders: Order[] = [
    {
      id: "ORD-2024-001",
      orderNumber: "ORD-2024-001",
      orderDate: "2024-01-15",
      customerId: "Retail Chain A",
      priority: "High",
      status: OrderStatus.Picking,
      items: 15,
      createdAt: "2024-01-15 09:30",
      dueDate: "2024-01-16 14:00",
      carrier: "DHL Express",
    },
    {
      id: "ORD-2024-002",
      orderNumber: "ORD-2024-002",
      orderDate: "2024-01-15",
      customerId: "Supermarket B",
      priority: "Medium",
      status: OrderStatus.Pending,
      items: 8,
      createdAt: "2024-01-15 10:15",
      dueDate: "2024-01-17 10:00",
      carrier: "FedEx Ground",
    },
    {
      id: "ORD-2024-003",
      orderNumber: "ORD-2024-003",
      orderDate: "2024-01-15",
      customerId: "Restaurant Chain C",
      priority: "Low",
      status: OrderStatus.Packed,
      items: 22,
      createdAt: "2024-01-15 11:00",
      dueDate: "2024-01-18 16:00",
      carrier: "UPS Standard",
    },
  ]

  const pickList: PickListItem[] = [
    {
      sku: "SKU-12345",
      description: "Premium Coffee Beans",
      lot: "LOT240101",
      qtyOrdered: 50,
      qtyPicked: 50,
      location: "A-12",
      status: PickListItemStages.Completed,
    },
    {
      sku: "SKU-12346",
      description: "Organic Tea Leaves",
      lot: "LOT240102",
      qtyOrdered: 25,
      qtyPicked: 20,
      location: "A-13",
      status: PickListItemStages.Partial,
    },
    {
      sku: "SKU-12347",
      description: "Energy Drinks",
      lot: "LOT240103",
      qtyOrdered: 100,
      qtyPicked: 0,
      location: "B-05",
      status: PickListItemStages.Pending,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>
      case "Picking":
        return <Badge variant="default">Picking</Badge>
      case "Packed":
        return <Badge variant="outline">Packed</Badge>
      case "Shipped":
        return <Badge variant="default">Shipped</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive">High</Badge>
      case "Medium":
        return <Badge variant="secondary">Medium</Badge>
      case "Low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <ProtectedRoute requiredPermission="order-fulfillment.view">
      <div className="space-y-6">
        {/* Warehouse Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Order Fulfillment</h2>
            <p className="text-muted-foreground">Manage order processing, picking, and packing</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select warehouse" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map((wh) => (
                  <SelectItem key={wh.id} value={wh.id}>{wh.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full sm:w-auto">
              <FileText className="h-4 w-4 mr-2" />
              Generate Pick List
            </Button>
            <Button className="w-full sm:w-auto">
              <Package className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </div>
        </div>

        {/* View Selector */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedView === "orders" ? "default" : "outline"}
            onClick={() => setSelectedView("orders")}
            size="sm"
          >
            Active Orders
          </Button>
          <Button
            variant={selectedView === "picking" ? "default" : "outline"}
            onClick={() => setSelectedView("picking")}
            size="sm"
          >
            Pick Lists
          </Button>
          <Button
            variant={selectedView === "packing" ? "default" : "outline"}
            onClick={() => setSelectedView("packing")}
            size="sm"
          >
            Packing
          </Button>
        </div>

        {selectedView === "orders" && (
          <ActiveOrderView selectedWarehouse={selectedWarehouse} warehouses={warehouses} orders={orders} getStatusBadge={getStatusBadge} getPriorityBadge={getPriorityBadge}  />
        )}

        {selectedView === "picking" && (
          <PickListView
            pickListData={pickList}
            selectedWarehouse={selectedWarehouse}
            warehouses={warehouses}
            getStatusBadge={getStatusBadge}
            getPriorityBadge={getPriorityBadge}
          />
        )}

        {selectedView === "packing" && (
          <Card>
            <CardHeader>
              <CardTitle>Packing Station</CardTitle>
              <CardDescription>Pack picked items and generate shipping labels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Order Details</h4>
                  <div className="p-4 border rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>Order ID: ORD-2024-003</div>
                      <div>Customer: Restaurant Chain C</div>
                      <div>Items: 22</div>
                      <div>Weight: 45.2 kg</div>
                      <div>Carrier: UPS Standard</div>
                      <div>Service: Ground</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pallet Configuration</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pallet type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chep">CHEP (1200x800mm)</SelectItem>
                        <SelectItem value="loscam">Loscam (1165x1165mm)</SelectItem>
                        <SelectItem value="custom">Custom Size</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button className="flex-1">
                      <Package className="h-4 w-4 mr-2" />
                      Complete Packing
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Print Label
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Re-Palletizing Check</h4>
                  <div className="p-4 border rounded-lg bg-orange-50">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">Height Limit Exceeded</span>
                    </div>
                    <div className="text-sm text-orange-700 space-y-1">
                      <div>Current height: 1.7m (Max: 1.5m)</div>
                      <div>Current weight: 890kg (Max: 1000kg)</div>
                      <div>Suggestion: Split into 2 pallets</div>
                    </div>
                    <Button size="sm" className="mt-2" variant="outline">
                      Auto Re-Stack
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Shipping Address</label>
                    <div className="p-3 border rounded text-sm">
                      Restaurant Chain C<br />
                      123 Business District
                      <br />
                      Sydney NSW 2000
                      <br />
                      Australia
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}