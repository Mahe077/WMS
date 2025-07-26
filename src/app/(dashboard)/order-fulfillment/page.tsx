"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ViewSelector } from "@/components/common/view-selector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Package, AlertCircle } from "lucide-react"
import { ProtectedRoute } from "@/components/common/protected-route"
import { OrderStatus, PickListItemStages } from "@/lib/enum"
import { ActiveOrderView } from "@/features/order-fulfillment/components/active-order-view"
import { PickListView } from "@/features/order-fulfillment/components/pick-list-view"
import { Order, PickListItem } from "@/features/order-fulfillment/types/order.types"
import { PageHeader } from "@/components/common/page-header";

export default function OrderFulfillmentPage() {
  const [selectedView, setSelectedView] = useState("orders")

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

  return (
    <ProtectedRoute requiredPermission="order-fulfillment.view">
      <div className="space-y-6">
        <PageHeader
          title="Order Fulfillment"
          description="Manage order processing, picking, and packing"
        >
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <Button variant="outline" className="w-full sm:w-auto">
              <FileText className="h-4 w-4 mr-2" />
              Generate Pick List
            </Button>
            <Button className="w-full sm:w-auto">
              <Package className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </div>
        </PageHeader>

        {/* View Selector */}
        <ViewSelector
          options={[
            { label: "Active Orders", value: "orders" },
            { label: "Pick Lists", value: "picking" },
            { label: "Packing", value: "packing" },
          ]}
          selectedView={selectedView}
          onSelectView={setSelectedView}
        />

        {selectedView === "orders" && (
          <ActiveOrderView orders={orders} />
        )}

        {selectedView === "picking" && (
          <PickListView
            pickListData={pickList}
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