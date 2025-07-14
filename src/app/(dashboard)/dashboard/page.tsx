"use client";

import { ProtectedRoute } from "@/components/common/protected-route";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/contexts/app-context";
import {
  ProtectedComponent,
} from "@/components/common/protected-component";
import {
  Package,
  Warehouse,
  Truck,
  RefreshCw,
  BarChart3,
  FileText,
  Clock,
  AlertTriangle,
} from "lucide-react";
// import { AlertType } from "@/lib/enum"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useBarcodeScanner } from "@/features/receiving/hooks/use-barcode-scanner";
import { useMobile } from "@/hooks/use-mobile";
import { AlertType } from "@/lib/enum";
// import { Alert } from "@/lib/types"

const stats = [
  {
    title: "Active Orders",
    value: 247,
    change: "+12%",
    icon: Package,
    color: "text-blue-600",
  },
  {
    title: "Inventory Items",
    value: 15432,
    change: "+3%",
    icon: Warehouse,
    color: "text-green-600",
  },
  {
    title: "Pending Shipments",
    value: 89,
    change: "-5%",
    icon: Truck,
    color: "text-orange-600",
  },
  {
    title: "Returns Processing",
    value: 23,
    change: "+8%",
    icon: RefreshCw,
    color: "text-purple-600",
  },
];

const alerts = [
  {
    type: AlertType.Warning,
    message: "Low stock alert: SKU-12345 (Qty: 15)",
    time: "2 hours ago",
  },
  {
    type: AlertType.Info,
    message: "New ASN received: ASN-2024-001",
    time: "4 hours ago",
  },
  {
    type: AlertType.Error,
    message: "QC Hold: Damaged goods in Bay A-12",
    time: "6 hours ago",
  },
];

const data = [
  { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Aug", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Oct", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Dec", total: Math.floor(Math.random() * 5000) + 1000 },
];

const DashboardPage = () => {
  const { addNotification } = useNotifications();

  const isMobile = useMobile();

  const handleQuickAction = (action: string) => {
    addNotification({
      type: "success",
      message: `${action} initiated successfully`,
    });
  };

  const [scannerState, scannerActions] = useBarcodeScanner({
    onSuccess: handleScanSuccess,
    onError: handleScanError,
  });

  const { isOpen, isScanning } = scannerState;
  const { startScanning } = scannerActions;

  useEffect(() => {
    if (isOpen && !isScanning) {
      startScanning();
    }
  }, [isOpen, isScanning, startScanning]);

  function handleScanSuccess(scannedCode: string): void {
    scannerActions.closeScanner();
    addNotification({
      type: "success",
      message: `Scanned LPN/SSCC: ${scannedCode}`,
    });
  }

  function handleScanError(errorMessage: string): void {
    scannerActions.closeScanner();
    addNotification({
      type: "error",
      message: `Scan failed: ${errorMessage}`,
    });
  }

  return (
    <ProtectedRoute requiredPermission="dashboard.view">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Dashboard
            </h2>
            <p className="text-muted-foreground">
              Overview of warehouse operations
            </p>
          </div>
        </div>

        {/* Stats Grid - Mobile 2x2, Desktop 1x4 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* Alerts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Sales Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  total: {
                    label: "Sales",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
                  <BarChart data={data}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                      fontSize={isMobile ? 10 : 12}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tickFormatter={(value) => `${Number(value) / 1000}k`}
                      fontSize={isMobile ? 10 : 12}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Bar
                      dataKey="total"
                      fill="#8884d8"
                      radius={4}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      alert.type === "error"
                        ? "bg-red-500"
                        : alert.type === "warning"
                        ? "bg-orange-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium break-words">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ProtectedComponent requiredPermission="view:receiving">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleQuickAction("New Receipt Processing")}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Process New Receipt
                </Button>
              </ProtectedComponent>

              <ProtectedComponent requiredPermission="view:orders">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleQuickAction("Pick List Creation")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create Pick List
                </Button>
              </ProtectedComponent>

              <ProtectedComponent requiredPermission="view:dispatch">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleQuickAction("Dispatch Scheduling")}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Schedule Dispatch
                </Button>
              </ProtectedComponent>

              <ProtectedComponent requiredPermission="view:reports">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleQuickAction("Report Generation")}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </ProtectedComponent>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
