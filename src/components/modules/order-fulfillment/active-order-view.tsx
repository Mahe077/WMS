import { CustomTable, TableColumn } from "@/components/common/custom-table";
import { StatCard } from "@/components/ui/stat-card";
import { useNotifications, usePagination } from "@/contexts/app-context";
import { Order, Stat } from "@/lib/types";
import { CircleCheckBig, FileText, RefreshCcw, Truck } from "lucide-react";
import React from "react";

const stats: Stat[] = [
  {
    title: "Pending Orders",
    value: 47,
    changeDescription: "Awaiting processing",
    icon: FileText,
    change: "", // Add an appropriate value for change
    color: "text-blue-600", // Add an appropriate value for color (e.g., "default", "green", "red")
  },
  {
    title: "In Progress",
    value: 23,
    changeDescription: "Currently picking",
    icon: RefreshCcw,
    change: "", // Add an appropriate value for change
    color: "text-orange-600", // Add an appropriate value for color (e.g., "default", "green", "red")
  },
  {
    title: "Ready to Ship",
    value: 15,
    changeDescription: "Packed and labeled",
    icon: Truck,
    change: "", // Add an appropriate value for change
    color: "text-purple-600", // Add an appropriate value for color (e.g., "default", "green", "red")
  },
  {
    title: "Shipped Today",
    value: 89,
    changeDescription: "Completed orders",
    icon: CircleCheckBig,
    change: "", // Add an appropriate value for change
    color: "text-green-600", // Add an appropriate value for color (e.g., "default", "green", "red")
  },
];

interface ActiveOrderViewProps {
  selectedWarehouse: string;
  warehouses: { id: string; name: string }[];
  orders: Order[];
  getStatusBadge: (status: string) => React.ReactNode;
  getPriorityBadge: (priority: string) => React.ReactNode;
}

export function ActiveOrderView({
  selectedWarehouse,
  warehouses,
  orders,
  getStatusBadge,
  getPriorityBadge,
}: ActiveOrderViewProps) {
  const { addNotification } = useNotifications();
  const tableColumns: TableColumn<Order>[] = [
    { key: "id", label: "Order ID", priority: "high" },
    { key: "customerId", label: "Customer", priority: "high" },
    { key: "priority", label: "Priority", priority: "high", render: (value) => getPriorityBadge(String(value)) },
    { key: "status", label: "Status", priority: "high", render: (value) => getStatusBadge(String(value)) },
    { key: "items", label: "Items", priority: "high" },
    { key: "dueDate", label: "Due Date", priority: "medium" },
    { key: "carrier", label: "Carrier", priority: "medium" },
  ];

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    goToPage,
    getPageItems,
    setPagination,
  } = usePagination("orders-active", orders.length, 10);

  const paginatedOrders = getPageItems(orders);

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setPagination({ itemsPerPage: newItemsPerPage, currentPage: 1 });
  };

  return (
    <React.Fragment>
      {/* Show selected warehouse */}
      <div className="mb-2 text-sm text-muted-foreground">
        Warehouse: {warehouses.find((w) => w.id === selectedWarehouse)?.name}
      </div>
      {/* Order Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            changeDescription={stat.changeDescription}
            icon={stat.icon}
            change={stat.change}
            color={stat.color}
          />
        ))}
      </div>

      {/* Orders Table */}
      <CustomTable
        columns={tableColumns}
        data={paginatedOrders}
        title={"Active Orders"}
        description={"Orders currently in the fulfillment process"}
        onRowAction={(action, row) => {
          if (action === "view") {
            // Handle view action
            console.log("View order", row);
            // e.g., navigate to order details page
          } else if (action === "pick") {
            // Handle pick action
            console.log("Pick order", row);
            // e.g., trigger pick workflow
          } else {
            // Handle other actions
            console.log("Other action", action, row);
          }
          addNotification({
      type: "success",
      message: `${action} action performed on ${row.id}`,
    });
        }}
        expandable={false}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItemsCount={paginatedOrders.length}
        handleItemsPerPageChange={handleItemsPerPageChange}
        goToPage={goToPage}
      />
    </React.Fragment>
  );
}
