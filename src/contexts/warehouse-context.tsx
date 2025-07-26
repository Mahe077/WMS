"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { useNotifications } from "@/contexts/app-context"
import { useAuth } from "@/features/auth/hooks/useAuth"

export interface WarehouseItem {
  id: string
  name: string
  location: string
  code: string
  status: "active" | "inactive" | "maintenance"
  capacity: number
  currentLoad: number
  staff: number
}

const warehouses: WarehouseItem[] = [
  {
    id: "WH001",
    name: "Main Distribution Center",
    location: "Atlanta, GA",
    code: "ATL-DC",
    status: "active",
    capacity: 50000,
    currentLoad: 32500,
    staff: 45,
  },
  {
    id: "WH002",
    name: "West Coast Hub",
    location: "Los Angeles, CA",
    code: "LAX-HUB",
    status: "active",
    capacity: 35000,
    currentLoad: 28900,
    staff: 32,
  },
  {
    id: "WH003",
    name: "Northeast Facility",
    location: "Newark, NJ",
    code: "EWR-FAC",
    status: "active",
    capacity: 42000,
    currentLoad: 18750,
    staff: 38,
  },
  {
    id: "WH004",
    name: "Chicago Processing",
    location: "Chicago, IL",
    code: "CHI-PROC",
    status: "maintenance",
    capacity: 28000,
    currentLoad: 0,
    staff: 15,
  },
  {
    id: "WH005",
    name: "Texas Regional",
    location: "Dallas, TX",
    code: "DFW-REG",
    status: "active",
    capacity: 38000,
    currentLoad: 22100,
    staff: 29,
  },
]

const ALL_WAREHOUSES_ITEM: WarehouseItem = {
  id: "ALL",
  name: "All Warehouses",
  location: "Global",
  code: "ALL",
  status: "active",
  capacity: warehouses.reduce((total, wh) => total + wh.capacity, 0),
  currentLoad: warehouses.reduce((total, wh) => total + wh.currentLoad, 0),
  staff: warehouses.reduce((total, wh) => total + wh.staff, 0),
};

interface WarehouseContextType {
  selectedWarehouse: WarehouseItem;
  warehouses: WarehouseItem[];
  handleWarehouseSelect: (warehouse: WarehouseItem) => void;
  canViewAllWarehouses: boolean;
}

const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

export const WarehouseProvider = ({ children }: { children: ReactNode }) => {
  const { addNotification } = useNotifications();
  const { can } = useAuth();
  const canViewAllWarehouses = can('warehouse.view_all');

  const availableWarehouses = React.useMemo(
    () => canViewAllWarehouses
      ? [ALL_WAREHOUSES_ITEM, ...warehouses]
      : warehouses,
    [canViewAllWarehouses]
  );

  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseItem>(
    canViewAllWarehouses ? ALL_WAREHOUSES_ITEM : availableWarehouses[0]
  );

  useEffect(() => {
    // If user loses 'view_all' permission and 'All Warehouses' is selected, default to first available warehouse
    if (!canViewAllWarehouses && selectedWarehouse.id === ALL_WAREHOUSES_ITEM.id) {
      setSelectedWarehouse(availableWarehouses[0]);
    }
    // If user gains 'view_all' permission and 'All Warehouses' is not selected, but it's the default, select it.
    // Or if the currently selected warehouse is no longer available (e.g., filtered out by permissions)
    if (canViewAllWarehouses && !availableWarehouses.some(wh => wh.id === selectedWarehouse.id)) {
      setSelectedWarehouse(ALL_WAREHOUSES_ITEM);
    }
  }, [canViewAllWarehouses, selectedWarehouse, availableWarehouses]);

  const handleWarehouseSelect = (warehouse: WarehouseItem) => {
    if (warehouse.status === "maintenance" && warehouse.id !== ALL_WAREHOUSES_ITEM.id) {
      addNotification({
        type: "warning",
        message: `${warehouse.name} is currently under maintenance and cannot be selected.`,
      });
      return;
    }

    setSelectedWarehouse(warehouse);
    addNotification({
      type: "success",
      message: `Switched to ${warehouse.name} (${warehouse.code})`,
    });
  };

  return (
    <WarehouseContext.Provider value={{ selectedWarehouse, warehouses: availableWarehouses, handleWarehouseSelect, canViewAllWarehouses }}>
      {children}
    </WarehouseContext.Provider>
  );
};

export const useWarehouse = () => {
  const context = useContext(WarehouseContext)
  if (context === undefined) {
    throw new Error("useWarehouse must be used within a WarehouseProvider")
  }
  return context
}
