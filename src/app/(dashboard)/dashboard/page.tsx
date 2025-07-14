"use client";

import { ProtectedRoute } from "@/components/common/protected-route";
import { StatCard } from "@/components/ui/stat-card";
import { ProtectedComponent } from "@/components/common/protected-component";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

import { useNotifications } from "@/contexts/app-context";
import { QuickActionButton } from "@/components/common/quick-action-button";
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
import { ActivityItem } from "@/components/common/activity-item";
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
                <ActivityItem
                  key={index}
                  message={alert.message}
                  time={alert.time}
                  type={alert.type}
                />
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
                <QuickActionButton
                  label="Process New Receipt"
                  icon={Package}
                  onClick={() => handleQuickAction("New Receipt Processing")}
                  permission="view:receiving"
                />
              </ProtectedComponent>

              <ProtectedComponent requiredPermission="view:orders">
                <QuickActionButton
                  label="Create Pick List"
                  icon={FileText}
                  onClick={() => handleQuickAction("Pick List Creation")}
                  permission="view:orders"
                />
              </ProtectedComponent>

              <ProtectedComponent requiredPermission="view:dispatch">
                <QuickActionButton
                  label="Schedule Dispatch"
                  icon={Truck}
                  onClick={() => handleQuickAction("Dispatch Scheduling")}
                  permission="view:dispatch"
                />
              </ProtectedComponent>

              <ProtectedComponent requiredPermission="view:reports">
                <QuickActionButton
                  label="Generate Report"
                  icon={BarChart3}
                  onClick={() => handleQuickAction("Report Generation")}
                  permission="view:reports"
                />
              </ProtectedComponent>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
