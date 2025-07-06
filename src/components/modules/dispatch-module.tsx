"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Truck, Clock, MapPin, FileText, CheckCircle } from "lucide-react";
import { CustomTable, TableColumn } from "../common/custom-table";
import { DockBooking } from "@/lib/types";
import { DockBookingCategory, DockStatus } from "@/lib/enum";
import { useNotifications, usePagination } from "@/contexts/app-context";

export function DispatchModule() {
  const { addNotification } = useNotifications();
  const docks = [
    {
      id: "DOCK-A",
      status: "Occupied",
      carrier: "DHL Express",
      truck: "DHL-001",
      eta: "14:30",
      orders: 5,
    },
    {
      id: "DOCK-B",
      status: "Available",
      carrier: null,
      truck: null,
      eta: null,
      orders: 0,
    },
    {
      id: "DOCK-C",
      status: "Scheduled",
      carrier: "FedEx Ground",
      truck: "FDX-205",
      eta: "15:45",
      orders: 8,
    },
    {
      id: "DOCK-D",
      status: "Loading",
      carrier: "UPS Standard",
      truck: "UPS-789",
      eta: "16:00",
      orders: 12,
    },
  ];

  const scheduledPickups: DockBooking[] = [
    {
      id: "SHIP-2024-001",
      carrier: "DHL Express",
      truck: "DHL-001",
      driver: "John Smith",
      startTime: "14:30",
      endTime: "15:00",
      date: "2024-06-01",
      poNumber: "5",
      estimatedPallets: 8,
      dockId: "DOCK-A",
      activity: DockBookingCategory.Dispatch,
      status: DockStatus.Loading,
      duration: 30,
      bookingRef: "BOOK-001",
    },
    {
      id: "SHIP-2024-002",
      carrier: "FedEx Ground",
      truck: "FDX-205",
      driver: "Sarah Johnson",
      startTime: "15:45",
      endTime: "16:15",
      date: "2024-06-01",
      poNumber: "8",
      estimatedPallets: 12,
      dockId: "DOCK-C",
      activity: DockBookingCategory.Dispatch,
      status: DockStatus.Scheduled,
      duration: 30,
      bookingRef: "BOOK-002",
    },
    {
      id: "SHIP-2024-003",
      carrier: "UPS Standard",
      truck: "UPS-789",
      driver: "Mike Wilson",
      startTime: "16:00",
      endTime: "16:30",
      date: "2024-06-01",
      poNumber: "12",
      estimatedPallets: 18,
      dockId: "DOCK-D",
      activity: DockBookingCategory.Dispatch,
      status: DockStatus.Delayed,
      duration: 30,
      bookingRef: "BOOK-003",
    },
    {
      id: "SHIP-2024-003",
      carrier: "UPS Standard",
      truck: "UPS-789",
      driver: "Mike Wilson",
      startTime: "16:00",
      endTime: "16:30",
      date: "2024-06-01",
      poNumber: "12",
      estimatedPallets: 18,
      dockId: "DOCK-D",
      activity: DockBookingCategory.Dispatch,
      status: DockStatus.Completed,
      duration: 30,
      bookingRef: "BOOK-004",
    },
  ];

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    goToPage,
    getPageItems,
    setPagination,
  } = usePagination("dispatch", scheduledPickups.length, 10);

  const paginateScheduledPickups = getPageItems(scheduledPickups);

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setPagination({ itemsPerPage: newItemsPerPage, currentPage: 1 });
  };

  const getDockStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return <Badge variant="default">Available</Badge>;
      case "Occupied":
        return <Badge variant="secondary">Occupied</Badge>;
      case "Scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      case "Loading":
        return <Badge variant="destructive">Loading</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getShipmentStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge variant="default">Pending</Badge>;
      case "Scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      case "Completed":
        return <Badge variant="success">Completed</Badge>;
      case "Loading":
        return <Badge variant="destructive">Loading</Badge>;
      case "Delayed":
        return <Badge variant="secondary">Delayed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const tableColumns: TableColumn<DockBooking>[] = [
    {
      key: "id",
      label: "Shipment ID",
      priority: "high",
    },
    {
      key: "poNumber",
      label: "PO Number",
      priority: "medium",
    },
    {
      key: "startTime",
      label: "Scheduled Time",
      priority: "medium",
    },
    {
      key: "carrier",
      label: "Carrier",
      priority: "medium",
    },
    {
      key: "truck",
      label: "Vehicle",
      priority: "medium",
    },
    {
      key: "driver",
      label: "Driver",
      priority: "medium",
    },
    {
      key: "estimatedPallets",
      label: "Pallets",
      priority: "low",
    },
    {
      key: "status",
      label: "Status",
      priority: "high",
      render: (value) => getShipmentStatusBadge(String(value)),
    },
  ];

  const renderDispatchTableActions = (row: DockBooking) => (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          console.log("Check-in vehicle for shipment:", row.id);
          addNotification({
            type: "info",
            message: `Check-in vehicle for ${row.id}`,
          });
        }}
      >
        <CheckCircle className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          console.log("Pick item:", row?.id);
          addNotification({
            type: "info",
            message: `View Details for ${row.id}`,
          });
        }}
      >
        <FileText className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Dispatch & Dock Scheduling
          </h2>
          <p className="text-muted-foreground">
            Manage dock assignments and carrier scheduling
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <Clock className="h-4 w-4 mr-2" />
            Schedule Pickup
          </Button>
          <Button className="w-full sm:w-auto">
            <Truck className="h-4 w-4 mr-2" />
            Check-in Vehicle
          </Button>
        </div>
      </div>

      {/* Dock Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {docks.map((dock) => (
          <Card key={dock.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                {dock.id}
                {getDockStatusBadge(dock.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dock.status === "Available" ? (
                <div className="text-center py-4">
                  <MapPin className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Ready for assignment
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm">
                    <div className="font-medium">{dock.carrier}</div>
                    <div className="text-muted-foreground">{dock.truck}</div>
                  </div>
                  {dock.eta && (
                    <div className="text-xs text-muted-foreground">
                      ETA: {dock.eta} • {dock.orders} orders
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scheduled Pickups */}
      <CustomTable<DockBooking>
        columns={tableColumns}
        data={scheduledPickups}
        title="Scheduled Pickups"
        description="Today's carrier pickups and dock assignments"
        onRowAction={(action, row) => {
          if (action === "view") {
            // Handle view action, e.g., open details modal
            console.log("View shipment", row);
          } else if (action === "check-in") {
            // Handle check-in action, e.g., open check-in form
            console.log("Check-in vehicle for shipment", row);
          }
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItemsCount={paginateScheduledPickups.length}
        handleItemsPerPageChange={handleItemsPerPageChange}
        goToPage={goToPage}
        renderTableActions={renderDispatchTableActions}
      />

      {/* Gate Check-in and Loading Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gate Check-in</CardTitle>
            <CardDescription>
              Register arriving vehicles and drivers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Vehicle Registration
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select scheduled vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dhl-001">DHL-001 (John Smith)</SelectItem>
                  <SelectItem value="fdx-205">
                    FDX-205 (Sarah Johnson)
                  </SelectItem>
                  <SelectItem value="ups-789">UPS-789 (Mike Wilson)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assign Dock</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select available dock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dock-b">DOCK-B (Available)</SelectItem>
                  <SelectItem value="dock-c">DOCK-C (Scheduled)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full">
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Check-in
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loading Progress</CardTitle>
            <CardDescription>Current loading operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">DOCK-A • DHL-001</div>
                  <Badge variant="destructive">Loading</Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Orders: 5/5 loaded</div>
                  <div>Pallets: 6/8 loaded</div>
                  <div>Estimated completion: 15 minutes</div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">DOCK-D • UPS-789</div>
                  <Badge variant="destructive">Loading</Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Orders: 8/12 loaded</div>
                  <div>Pallets: 12/18 loaded</div>
                  <div>Estimated completion: 25 minutes</div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "67%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
