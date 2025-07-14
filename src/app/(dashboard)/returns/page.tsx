"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RefreshCw, Package, AlertTriangle, CheckCircle, Scan } from "lucide-react"
import { CustomTable, TableColumn } from "@/components/common/custom-table"
import { usePagination } from "@/contexts/app-context"
import { ProtectedRoute } from "@/components/common/protected-route";
import { Return } from "@/features/returns/types/return.types"
import { QuickActionButton } from "@/components/common/quick-action-button"

export default function ReturnsPage() {
  const [scanMode, setScanMode] = useState(false)
  const [scannedItem, setScannedItem] = useState("")

  const pendingReturns:Return [] = [
    {
      id: "RET-2024-001",
      originalOrder: "ORD-2024-045",
      customer: "Retail Chain A",
      sku: "SKU-12345",
      description: "Premium Coffee Beans",
      qty: 25,
      reason: "Overstock",
      status: "Pending",
      receivedDate: "2024-01-15",
    },
    {
      id: "RET-2024-002",
      originalOrder: "ORD-2024-032",
      customer: "Supermarket B",
      sku: "SKU-12346",
      description: "Organic Tea Leaves",
      qty: 10,
      reason: "Damage",
      status: "Quarantine",
      receivedDate: "2024-01-14",
    },
    {
      id: "RET-2024-003",
      originalOrder: "ORD-2024-028",
      customer: "Restaurant Chain C",
      sku: "SKU-12347",
      description: "Energy Drinks",
      qty: 50,
      reason: "Wrong SKU",
      status: "Processed",
      receivedDate: "2024-01-13",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>
      case "Quarantine":
        return <Badge variant="destructive">Quarantine</Badge>
      case "Processed":
        return <Badge variant="default">Processed</Badge>
      case "Restocked":
        return <Badge variant="outline">Restocked</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getReasonBadge = (reason: string) => {
    switch (reason) {
      case "Damage":
        return <Badge variant="destructive">Damage</Badge>
      case "Overstock":
        return <Badge variant="secondary">Overstock</Badge>
      case "Wrong SKU":
        return <Badge variant="outline">Wrong SKU</Badge>
      case "Expired":
        return <Badge variant="destructive">Expired</Badge>
      default:
        return <Badge variant="outline">{reason}</Badge>
    }
  }

  const tableColumns: TableColumn<Return> [] = [
    { key: "id", label: "Return ID", priority: "high" },
    { key: "originalOrder", label: "Original Order", priority: "high" },
    { key: "customer", label: "Customer", priority: "high" },
    { key: "sku", label: "SKU", priority: "high" },
    { key: "description", label: "Description", priority: "high" },
    { key: "qty", label: "Quantity", priority: "medium" },
    {
      key: "reason",
      label: "Reason",
      priority: "medium",
      render: (value) => getReasonBadge(String(value)),
    },
    {
      key: "status",
      label: "Status",
      priority: "medium",
      render: (value) => getStatusBadge(String(value)),
    },
    { key: "receivedDate", label: "Received", priority: "low" },
  ]

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    goToPage,
    getPageItems,
    setPagination,
  } = usePagination("returns", pendingReturns.length, 10);

  const paginateReturns = getPageItems(pendingReturns);

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setPagination({ itemsPerPage: newItemsPerPage, currentPage: 1 });
  };

  const renderReturnTableActions = (row: Return) => (
    <div className="flex gap-1">
      <Button variant="outline" size="sm" onClick={() => console.log(`Processing ${row.id}`)}>
        Process
      </Button>
      <Button variant="outline" size="sm" onClick={() => console.log(`Viewing ${row.id}`)}>
        View
      </Button>
    </div>
  );

  return (
    <ProtectedRoute requiredPermission="returns.view">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Returns Processing</h2>
            <p className="text-muted-foreground">Handle returned items and inventory adjustments</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setScanMode(!scanMode)} className="w-full sm:w-auto">
              <Scan className="h-4 w-4 mr-2" />
              {scanMode ? "Exit Scan Mode" : "Scan Returns"}
            </Button>
            <Button className="w-full sm:w-auto">
              <RefreshCw className="h-4 w-4 mr-2" />
              Process Return
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Awaiting processing</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Quarantine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">8</div>
              <p className="text-xs text-muted-foreground">Damaged or suspect items</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Restocked Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">15</div>
              <p className="text-xs text-muted-foreground">Returned to inventory</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Disposed Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">12</div>
              <p className="text-xs text-muted-foreground">Items written off</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Returns Processing Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Process Return
              </CardTitle>
              <CardDescription>Scan and process returned items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="return-scan">Scan Return Label</Label>
                <div className="flex space-x-2">
                  <Input
                    id="return-scan"
                    placeholder="Scan return barcode or enter manually"
                    value={scannedItem}
                    onChange={(e) => setScannedItem(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" className="flex-shrink-0">
                    <Scan className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {scannedItem && (
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-medium mb-2">Return Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>Return ID: RET-2024-004</div>
                    <div>Original Order: ORD-2024-067</div>
                    <div>SKU: SKU-12348</div>
                    <div>Description: Protein Bars</div>
                    <div>Quantity: 30 units</div>
                    <div>Customer: Fitness Store D</div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="reason">Return Reason</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select return reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overstock">Overstock</SelectItem>
                    <SelectItem value="damage">Damage</SelectItem>
                    <SelectItem value="wrong-sku">Wrong SKU</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="customer-return">Customer Return</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Item Condition</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Assess item condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Good - Restock</SelectItem>
                    <SelectItem value="damaged">Damaged - Quarantine</SelectItem>
                    <SelectItem value="expired">Expired - Dispose</SelectItem>
                    <SelectItem value="opened">Opened - Evaluate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Processing Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any relevant notes about the return condition or processing..."
                  rows={3}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Process Return
                </Button>
                <Button variant="outline" className="flex-1">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Hold for Review
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Return Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Return Processing Guidelines</CardTitle>
              <CardDescription>Standard procedures for different return types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Overstock Returns</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Items in original packaging, within 24 hours: Auto-restock to inventory
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-orange-800">Damaged Items</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Move to quarantine zone Q-01. Require manager approval for disposal
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <RefreshCw className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Wrong SKU</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Verify against original order. If undamaged, return to correct location
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-800">Expired Products</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Check BBD date. If expired, mark for disposal. Update inventory records
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <QuickActionButton
                    label="Bulk Process Returns"
                    icon={Package}
                    onClick={() => console.log("Bulk Process Returns")}
                  />
                  <QuickActionButton
                    label="Review Quarantine Items"
                    icon={AlertTriangle}
                    onClick={() => console.log("Review Quarantine Items")}
                  />
                  <QuickActionButton
                    label="Generate Disposal Report"
                    icon={RefreshCw}
                    onClick={() => console.log("Generate Disposal Report")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Returns Table */}
        <CustomTable<Return>
          columns={tableColumns}
          data={pendingReturns}
          title={"Recent Returns"}
          description={"All returned items requiring processing"}
          expandable={false}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          goToPage={goToPage}
          totalItemsCount={paginateReturns.length}
          handleItemsPerPageChange={handleItemsPerPageChange}
          renderTableActions={ renderReturnTableActions }
        />
      </div>
    </ProtectedRoute>
  )
}