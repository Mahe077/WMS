"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart3, FileText, Calendar, AlertTriangle } from "lucide-react"
import { ActivityItem } from "@/components/common/activity-item";
import { KpiCard } from "@/components/common/kpi-card";
import { ViewSelector } from "@/components/common/view-selector";
import { ProtectedRoute } from "@/components/common/protected-route"
import { Report } from "@/features/reports/types/report.types"
import { ReportsHistoryView } from "@/features/reports/components/reports-history-view"
import { ReportStatus } from "@/lib/enum"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("today")
  const [reportType, setReportType] = useState("inventory")
  const [selectedView, setSelectedView] = useState("dashboard")

  const reportTemplates = [
    {
      id: "inventory-diff",
      name: "Inventory Differential",
      description: "Compare supplier vs WMS inventory",
      frequency: "Daily",
    },
    { id: "po-audit", name: "PO Audit Report", description: "Received vs expected quantities", frequency: "Weekly" },
    { id: "activity-log", name: "Activity Log", description: "User actions and system events", frequency: "On-demand" },
    {
      id: "traceability",
      name: "Lot Traceability",
      description: "Track items from receipt to dispatch",
      frequency: "On-demand",
    },
    {
      id: "performance",
      name: "Performance Metrics",
      description: "KPIs and operational statistics",
      frequency: "Monthly",
    },
  ]

  const recentReports:Report[] = [
    {
      id: "RPT-2024-001",
      name: "Daily Inventory Report",
      type: "Inventory",
      generated: "2024-01-15 08:00",
      status: ReportStatus.Completed,
      size: 2300,
    },
    {
      id: "RPT-2024-002",
      name: "Weekly PO Audit",
      type: "Audit",
      generated: "2024-01-14 18:30",
      status: ReportStatus.Failed,
      size: 1800,
    },
    {
      id: "RPT-2024-003",
      name: "Activity Log - January",
      type: "Activity",
      generated: "2024-01-14 16:45",
      status: ReportStatus.Processing,
      size: 4100,
    },
    {
      id: "RPT-2024-004",
      name: "Lot Traceability - SKU-12345",
      type: "Traceability",
      generated: "2024-01-14 14:20",
      status: ReportStatus.Completed,
      size: 856,
    },
  ]

  const kpiData = [
    { metric: "Order Fulfillment Rate", value: "98.5%", change: "+2.1%", trend: "up" },
    { metric: "Inventory Accuracy", value: "99.2%", change: "+0.8%", trend: "up" },
    { metric: "Average Pick Time", value: "4.2 min", change: "-0.5 min", trend: "down" },
    { metric: "Dock Utilization", value: "87.3%", change: "+5.2%", trend: "up" },
    { metric: "Return Processing Time", value: "2.1 hours", change: "-0.3 hours", trend: "down" },
    { metric: "Stock Turnover", value: "12.4x", change: "+1.2x", trend: "up" },
  ]

  return (
    <ProtectedRoute requiredPermission="reports.view">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Reports & Analytics</h2>
            <p className="text-muted-foreground">Generate reports and monitor key performance indicators</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
            <Button className="w-full sm:w-auto">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* View Selector */}
        <ViewSelector
          options={[
            { label: "Dashboard", value: "dashboard" },
            { label: "Generate Reports", value: "generate" },
            { label: "Report History", value: "history" },
            { label: "Analytics", value: "analytics" },
          ]}
          selectedView={selectedView}
          onSelectView={setSelectedView}
        />

        {selectedView === "dashboard" && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {kpiData.map((kpi, index) => (
                <KpiCard
                  key={index}
                  metric={kpi.metric}
                  value={kpi.value}
                  change={kpi.change}
                  trend={kpi.trend as "up" | "down" | "neutral"}
                />
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Today&#39;s Activity Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Orders Processed</span>
                    <span className="font-medium">89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Items Received</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Shipments Dispatched</span>
                    <span className="font-medium">67</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Returns Processed</span>
                    <span className="font-medium">15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Inventory Adjustments</span>
                    <span className="font-medium">8</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    System Alerts & Issues
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ActivityItem
                    type="error"
                    message="Critical: 2 items"
                    secondaryDetail="Expired products in active inventory"
                  />
                  <ActivityItem
                    type="warning"
                    message="Warning: 15 items"
                    secondaryDetail="Low stock alerts requiring attention"
                  />
                  <ActivityItem
                    type="info"
                    message="Info: 8 items"
                    secondaryDetail="New ASNs received today"
                  />
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {selectedView === "generate" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate New Report</CardTitle>
                <CardDescription>Create custom reports based on your requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inventory">Inventory Report</SelectItem>
                      <SelectItem value="orders">Order Analysis</SelectItem>
                      <SelectItem value="performance">Performance Metrics</SelectItem>
                      <SelectItem value="audit">Audit Trail</SelectItem>
                      <SelectItem value="traceability">Lot Traceability</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {dateRange === "custom" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input type="date" id="start-date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <Input type="date" id="end-date" />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="format">Output Format</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Templates</CardTitle>
                <CardDescription>Pre-configured report templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportTemplates.map((template) => (
                    <div key={template.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-gray-600">{template.description}</div>
                          <div className="text-xs text-gray-500">Frequency: {template.frequency}</div>
                        </div>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedView === "history" && (
          <ReportsHistoryView recentReports={recentReports}/>
        )}

        {selectedView === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Operational Trends</CardTitle>
                <CardDescription>Key metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">Chart visualization would appear here</p>
                    <p className="text-sm text-gray-400">Order volume, inventory levels, performance metrics</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Analysis</CardTitle>
                <CardDescription>Detailed breakdown of operational efficiency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Order Processing Efficiency</span>
                      <span>94%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "94%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Inventory Accuracy</span>
                      <span>99%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "99%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>On-Time Delivery</span>
                      <span>96%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: "96%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Return Processing</span>
                      <span>88%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: "88%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}