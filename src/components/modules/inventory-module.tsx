"use client";

import { useMemo } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, Lock, Edit, Eye, Box, ChevronsDown } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import {
  usePagination,
  useFilters,
  useNotifications,
} from "@/contexts/app-context";
import { InventoryItemStatus } from "@/lib/enum";
import { StatCard } from "../ui/stat-card";
import { Stat } from "@/lib/types";
import { FilterBar } from "@/components/ui/filter-bar";
import { FilterConfig } from "@/lib/types";
import { useFilteredData } from "@/hooks/use-filters";

export function InventoryModule() {
  const { addNotification } = useNotifications();
  const { filters, searchTerm, setFilter, setSearchTerm, clearFilters } =
    useFilters("inventory");

  // Mock data - in real app this would come from API
  const allInventoryItems = useMemo(
    () => [
      {
        sku: "SKU-12345",
        description: "Premium Coffee Beans",
        lotNumber: "LOT240101",
        qty: 150,
        location: "A-12",
        bbd: "2024-12-31",
        status: "Available",
        holds: [],
      },
      {
        sku: "SKU-12346",
        description: "Organic Tea Leaves",
        lotNumber: "LOT240102",
        qty: 25,
        location: "A-13",
        bbd: "2024-11-15",
        status: "Low Stock",
        holds: [],
      },
      {
        sku: "SKU-12347",
        description: "Energy Drinks",
        lotNumber: "LOT240103",
        qty: 0,
        location: "B-05",
        bbd: "2024-10-30",
        status: "QC Hold",
        holds: ["QC_HOLD"],
      },
      // Add more mock data for pagination demo
      ...Array.from({ length: 47 }, (_, i) => ({
        sku: `SKU-${12348 + i}`,
        description: `Product ${i + 1}`,
        lotNumber: `LOT24${String(i + 1).padStart(4, "0")}`,
        qty: Math.floor(Math.random() * 500),
        location: `${String.fromCharCode(65 + (i % 5))}-${String(
          i + 1
        ).padStart(2, "0")}`,
        bbd: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(
          2,
          "0"
        )}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
        status: ["Available", "Low Stock", "Expiring Soon"][
          Math.floor(Math.random() * 3)
        ],
        holds: Math.random() > 0.8 ? ["QC_HOLD"] : [],
      })),
    ],
    []
  );

  const stats: Stat[] = [
    {
        title: "Total SKUs",
        value: allInventoryItems.length,
        change: '',
        changeDescription: "Active inventory items",
        icon: Box,
        color: "text-blue-600",
        valueColor: "text-blue-600",
    },
    {
        title: "Low Stock Items",
        value: allInventoryItems.filter(item => item.status === "Low Stock").length,
        change: '',
        changeDescription: "Below minimum threshold",
        icon: ChevronsDown,
        color: "text-orange-600",
        valueColor: "text-orange-600",
    },
    {
        title: "Items on Hold",
        value: allInventoryItems.filter(item => item.holds.length > 0).length,
        change: '',
        changeDescription: "QC, damage, or legal holds",
        icon: Lock,
        color: "text-purple-600",
        valueColor: "text-purple-600",
    },
    {
        title: "Expiring Soon",
        value: allInventoryItems.filter(item => item.status === "Expiring Soon").length,
        change: '',
        changeDescription: "Within 30 days",
        icon: AlertTriangle,
        color: "text-red-600",
        valueColor: "text-red-600",
    },
  ];

  // Filter configuration
  const filterConfigs: FilterConfig[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Filter by status',
      options: [
        { value: 'available', label: 'Available' },
        { value: 'low', label: 'Low Stock' },
        { value: 'hold', label: 'On Hold' },
        { value: 'expiring', label: 'Expiring Soon' },
      ],
      width: 'sm:w-48'
    },
    {
      key: 'location',
      label: 'Location',
      type: 'text',
      placeholder: 'Filter by location...',
      width: 'sm:w-40'
    },
    {
      key: 'bbd',
      label: 'BBD Before',
      type: 'date',
      placeholder: 'Best before date',
      width: 'sm:w-44'
    }
  ];

  // Define filter functions
  const filterFunctions = {
    status: (item: any, filterValue: string) => {
      switch (filterValue) {
        case 'available':
          return item.status === InventoryItemStatus.Available;
        case 'low':
          return item.status === InventoryItemStatus.OutOfStock;
        case 'hold':
          return item.status === InventoryItemStatus.QCHold;
        case 'expiring':
          return item.bbd && 
                 new Date(item.bbd) < 
                 new Date(new Date().setDate(new Date().getDate() + 30));
        default:
          return true;
      }
    },
    location: (item: any, filterValue: string) => {
      return item.location.toLowerCase().includes(filterValue.toLowerCase());
    },
    bbd: (item: any, filterValue: string) => {
      return item.bbd && new Date(item.bbd) <= new Date(filterValue);
    }
  };

  // Use the custom hook for filtering
  const filteredItems = useFilteredData(
    allInventoryItems,
    searchTerm,
    filters,
    ['sku', 'description', 'lotNumber'],
    filterFunctions
  );

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    goToPage,
    getPageItems,
    setPagination,
  } = usePagination("inventory", filteredItems.length, 10);

  const paginatedItems = getPageItems(filteredItems);

  const handleFilterChange = (key: string, value: any) => {
    setFilter({ ...filters, [key]: value });
    goToPage(1); // Reset to first page when filtering
  };

  const handleAction = (action: string, item: any) => {
    addNotification({
      type: "success",
      message: `${action} action performed on ${item.sku}`,
    });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setPagination({ itemsPerPage: newItemsPerPage, currentPage: 1 });
  };

  const getStatusBadge = (status: string, holds: string[]) => {
    if (holds.length > 0) {
      return <Badge variant="destructive">On Hold</Badge>;
    }
    switch (status) {
      case "Available":
        return <Badge variant="default">Available</Badge>;
      case "Low Stock":
        return <Badge variant="secondary">Low Stock</Badge>;
      case "Expiring Soon":
        return <Badge variant="destructive">Expiring Soon</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Inventory Management
          </h2>
          <p className="text-muted-foreground">
            Monitor stock levels, locations, and item status
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() =>
              handleAction("Stock Adjustment", { sku: "Multiple Items" })
            }
          >
            <Edit className="h-4 w-4 mr-2" />
            Adjust Stock
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={() => handleAction("Alert Creation", { sku: "System" })}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
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
            changeDescription={stat.changeDescription}
            icon={stat.icon}
            color={stat.color}
            valueColor={stat.valueColor}
          />
        ))}
      </div>

      {/* Reusable Filter Component */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by SKU, description, or LOT number..."
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        filterConfigs={filterConfigs}
      />

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
          <CardDescription>
            Real-time inventory levels and status - Showing{" "}
            {paginatedItems.length} of {filteredItems.length} items
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">SKU</TableHead>
                  <TableHead className="min-w-[150px]">Description</TableHead>
                  <TableHead className="min-w-[100px]">LOT</TableHead>
                  <TableHead className="min-w-[80px]">Quantity</TableHead>
                  <TableHead className="min-w-[80px]">Location</TableHead>
                  <TableHead className="min-w-[100px]">BBD</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.map((item) => (
                  <TableRow key={`${item.sku}-${item.lotNumber}`}>
                    <TableCell className="font-medium">{item.sku}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.lotNumber}</TableCell>
                    <TableCell>
                      <span
                        className={
                          item.qty <= 25 ? "text-orange-600 font-medium" : ""
                        }
                      >
                        {item.qty}
                      </span>
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.bbd}</TableCell>
                    <TableCell>
                      {getStatusBadge(item.status, item.holds)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAction("View", item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAction("Edit", item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {item.holds.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction("Manage Hold", item)}
                          >
                            <Lock className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredItems.length}
            onPageChange={goToPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
