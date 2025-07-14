"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Lock, Edit, Box, ChevronsDown } from "lucide-react";
import {
  usePagination,
  useFilters,
  useNotifications,
} from "@/contexts/app-context";
import { InventoryItemStatus } from "@/lib/enum";
import { StatCard } from "@/components/ui/stat-card";
import { FilterBar } from "@/components/ui/filter-bar";
import { useFilteredData } from "@/hooks/use-filters";
import { CustomTable, TableColumn } from "@/components/common/custom-table"
import { ProtectedRoute } from "@/components/common/protected-route";
import { FilterConfig, Stat } from "@/lib/types";

export default function InventoryPage() {
  const { addNotification } = useNotifications();
  const {
    filters,
    searchTerm,
    setFilter,
    setSearchTerm,
    clearFilters,
  } = useFilters("inventory");

  const allInventoryItems = useMemo(
    () => [
      {
        sku: "SKU-12345",
        description: "Premium Coffee Beans",
        lotNumber: "LOT240101",
        qty: 150,
        location: "A-12",
        bbd: "2025-07-31",
        status: InventoryItemStatus.Available,
        holds: [],
      },
      {
        sku: "SKU-12346",
        description: "Organic Tea Leaves",
        lotNumber: "LOT240102",
        qty: 25,
        location: "A-13",
        bbd: "2025-11-15",
        status: InventoryItemStatus.OutOfStock,
        holds: [],
      },
      {
        sku: "SKU-12347",
        description: "Energy Drinks",
        lotNumber: "LOT240103",
        qty: 0,
        location: "B-05",
        bbd: "2025-10-30",
        status: InventoryItemStatus.QCHold,
        holds: [InventoryItemStatus.QCHold],
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
        bbd: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(
          2,
          "0"
        )}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
        status: [ InventoryItemStatus.Available, InventoryItemStatus.OutOfStock, InventoryItemStatus.Blocked][
          Math.floor(Math.random() * 3)
        ],
        holds: Math.random() > 0.8 ? [InventoryItemStatus.QCHold] : [],
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
        value: allInventoryItems.filter(item => item.status === InventoryItemStatus.OutOfStock).length,
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
        value: allInventoryItems.filter(item => {
          if (!item.bbd) return false;
          const bbdDate = new Date(item.bbd);
          const now = new Date();
          const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          return bbdDate >= now && bbdDate <= in30Days;
        }).length,
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

  // Define inventory item type
  type InventoryItem = {
    sku: string;
    description: string;
    lotNumber: string;
    qty: number;
    location: string;
    bbd: string;
    status: string;
    holds: string[];
  };

  // Define filter functionsInventoryItem
const filterFunctions: Record<string, (item: InventoryItem, filterValue: unknown) => boolean> = {
  status: (item, filterValue): boolean => {
    if (typeof filterValue !== "string") return true;
    switch (filterValue) {
      case "available":
        return item.status === InventoryItemStatus.Available;
      case "low":
        return item.status === InventoryItemStatus.OutOfStock;
      case "hold":
        return item.status === InventoryItemStatus.QCHold;
      case "expiring":
        if (!item.bbd) return false;
        const bbdDate = new Date(item.bbd);
        const now = new Date();
        const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        return bbdDate >= now && bbdDate <= in30Days;
      default:
        return true;
    }
  },

  location: (item, filterValue): boolean => {
    if (typeof filterValue !== "string") return true;
    return item.location.toLowerCase().includes(filterValue.toLowerCase());
  },

  bbd: (item, filterValue): boolean => {
    return !!item.bbd && new Date(item.bbd) >= new Date(filterValue as string);
  },
};

  // Use the custom hook for filtering
  const filteredItems = useFilteredData<InventoryItem, unknown>(
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

  const handleFilterChange = (key: string, value: unknown) => {
    // Create a new filter object with the updated value
    const newFilters = { ...filters, [key]: value };
    setFilter(newFilters);
    goToPage(1); // Reset to first page when filtering
  };

  const handleAction = (action: string, item: InventoryItem) => {
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


  // Define table columns for mobile-friendly table
const tableColumns: TableColumn<InventoryItem>[] = [
    {
      key: "sku",
      label: "SKU",
      priority: "high",
    },
    {
      key: "description",
      label: "Description",
      priority: "high",
    },
    {
      key: "qty",
      label: "Quantity",
      priority: "high",
      render: (value) => {
        const qty = typeof value === "number" ? value : Number(value);
        return <span className={qty <= 25 ? "text-orange-600 font-medium" : ""}>{qty}</span>;
      },
    },
    {
      key: "status",
      label: "Status",
      priority: "high",
      render: (value, row: InventoryItem) => getStatusBadge(String(value), row.holds),
    },
    {
      key: "lotNumber",
      label: "LOT",
      priority: "medium",
    },
    {
      key: "location",
      label: "Location",
      priority: "medium",
    },
    {
      key: "bbd",
      label: "BBD",
      priority: "medium",
    },
  ];

  const renderExpandedContent = (item: InventoryItem) => (
    <div className="pt-2 border-t space-y-1">
      <div className="flex justify-between">
        <span className="text-gray-600">LOT:</span>
        <span className="font-medium">{item.lotNumber}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Location:</span>
        <span className="font-medium">{item.location}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">BBD:</span>
        <span className="font-medium">{item.bbd}</span>
      </div>
      {item.holds.length > 0 && (
        <div className="flex justify-between">
          <span className="text-gray-600">Holds:</span>
          <div className="flex gap-1">
            {item.holds.map((hold: string, index: number) => (
              <Badge key={index} variant="destructive" className="text-xs">
                {hold}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )



  return (
    <ProtectedRoute requiredPermission="inventory.view">
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
                handleAction("Stock Adjustment", {
                  sku: "Multiple Items",
                  description: "",
                  lotNumber: "",
                  qty: 0,
                  location: "",
                  bbd: "",
                  status: "",
                  holds: [],
                })
              }
            >
              <Edit className="h-4 w-4 mr-2" />
              Adjust Stock
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() =>
                handleAction("Alert Creation", {
                  sku: "System",
                  description: "",
                  lotNumber: "",
                  qty: 0,
                  location: "",
                  bbd: "",
                  status: "",
                  holds: [],
                })
              }
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
              {/* Mobile-Friendly Inventory Table */}
        <div>
          <CustomTable<InventoryItem>
            columns={tableColumns}
            data={paginatedItems}
            title={`Current Inventory - Showing ${paginatedItems.length} of ${filteredItems.length} items`}
            onRowAction={handleAction}
            expandable={true}
            renderExpandedContent={renderExpandedContent}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItemsCount={filteredItems.length}
            handleItemsPerPageChange={handleItemsPerPageChange}
            goToPage={goToPage}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}