import { AlertTriangle, BarChart3, Clock, FileText, Package, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { StatCard } from "../ui/stat-card";
import { Button } from "../ui/button";
import { ProtectedComponent } from "../common/protected-component";
import { useNotifications } from "@/contexts/app-context";
import { Alert, Stat } from "@/lib/types";

export function DashboardModule({ stats, alerts }: { stats: Stat[]; alerts: Alert[] }) {
  const { addNotification } = useNotifications()
  // const { can } = useAuth()

  const handleQuickAction = (action: string) => {
    addNotification({
      type: "success",
      message: `${action} initiated successfully`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of warehouse operations</p>
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
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    alert.type === "error" ? "bg-red-500" : alert.type === "warning" ? "bg-orange-500" : "bg-blue-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium break-words">{alert.message}</p>
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
  )
}