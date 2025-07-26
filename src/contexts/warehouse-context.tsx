"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { useNotifications } from "@/contexts/app-context"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { warehouses } from "@/lib/sample-data/warehouses"

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
  const { can, state: authState } = useAuth();
  const canViewAllWarehouses = can('warehouse.view_all');

  const userAssignedWarehouseIds = React.useMemo(
    () => authState.user?.assignedWarehouseIds || [],
    [authState.user?.assignedWarehouseIds]
  );

  const filteredWarehouses = React.useMemo(() => {
    if (canViewAllWarehouses) {
      return [ALL_WAREHOUSES_ITEM, ...warehouses];
    } else if (userAssignedWarehouseIds.length > 0) {
      return warehouses.filter(wh => userAssignedWarehouseIds.includes(wh.id));
    } else {
      return [warehouses[0]]; // Default to the first warehouse if no specific assignments
    }
  }, [canViewAllWarehouses, userAssignedWarehouseIds]);

  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseItem>(() => {
    if (canViewAllWarehouses) {
      return ALL_WAREHOUSES_ITEM;
    } else if (userAssignedWarehouseIds.length > 0) {
      const firstAssigned = warehouses.find(wh => userAssignedWarehouseIds.includes(wh.id));
      return firstAssigned || warehouses[0]; // Fallback to first if assigned not found
    } else {
      return warehouses[0];
    }
  });

  useEffect(() => {
    // If selected warehouse is no longer in the filtered list, reset it
    if (!filteredWarehouses.some(wh => wh.id === selectedWarehouse.id)) {
      setSelectedWarehouse(filteredWarehouses[0]);
    }
  }, [filteredWarehouses, selectedWarehouse]);

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
    <WarehouseContext.Provider value={{ selectedWarehouse, warehouses: filteredWarehouses, handleWarehouseSelect, canViewAllWarehouses }}>
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
