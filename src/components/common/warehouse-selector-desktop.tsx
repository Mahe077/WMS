"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Package, MapPin, Users, AlertTriangle } from "lucide-react"
import { useNotifications } from "@/contexts/app-context"

interface WarehouseItem {
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

interface WarehouseSelectorDesktopProps {
  className?: string
}

export function WarehouseSelectorDesktop({ className = "" }: WarehouseSelectorDesktopProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseItem>(warehouses[0])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { addNotification } = useNotifications()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleWarehouseSelect = (warehouse: WarehouseItem) => {
    if (warehouse.status === "maintenance") {
      addNotification({
        type: "warning",
        message: `${warehouse.name} is currently under maintenance and cannot be selected.`,
      })
      return
    }

    setSelectedWarehouse(warehouse)
    setIsOpen(false)
    addNotification({
      type: "success",
      message: `Switched to ${warehouse.name} (${warehouse.code})`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "maintenance":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCapacityPercentage = (currentLoad: number, capacity: number) => {
    return Math.round((currentLoad / capacity) * 100)
  }

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 75) return "text-orange-600"
    if (percentage >= 50) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Warehouse Selector Button */}
      <Button
        variant="ghost"
        className={`flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors h-auto ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                selectedWarehouse.status === "active"
                  ? "bg-green-400"
                  : selectedWarehouse.status === "maintenance"
                    ? "bg-orange-400"
                    : "bg-gray-400"
              }`}
            ></div>
          </div>

          <div className="flex flex-col items-start min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-900 truncate">{selectedWarehouse.name}</span>
              <Badge variant="outline" className="text-xs font-medium">
                {selectedWarehouse.code}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{selectedWarehouse.location}</span>
            </div>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="px-4 py-2 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Select Warehouse</h3>
            <p className="text-xs text-gray-500">Choose your active warehouse location</p>
          </div>

          {/* Warehouse List */}
          <div className="py-2">
            {warehouses.map((warehouse) => {
              const capacityPercentage = getCapacityPercentage(warehouse.currentLoad, warehouse.capacity)
              const isSelected = selectedWarehouse.id === warehouse.id
              const isDisabled = warehouse.status === "maintenance"

              return (
                <button
                  key={warehouse.id}
                  className={`
                    w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors
                    ${isSelected ? "bg-blue-50 border-r-2 border-blue-500" : ""}
                    ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
                  `}
                  onClick={() => handleWarehouseSelect(warehouse)}
                  disabled={isDisabled}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Package className="h-4 w-4 text-white" />
                      </div>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${
                          warehouse.status === "active"
                            ? "bg-green-400"
                            : warehouse.status === "maintenance"
                              ? "bg-orange-400"
                              : "bg-gray-400"
                        }`}
                      ></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 truncate">{warehouse.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {warehouse.code}
                          </Badge>
                        </div>
                        <Badge variant="outline" className={`text-xs capitalize ${getStatusColor(warehouse.status)}`}>
                          {warehouse.status}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-1 text-xs text-gray-500 mb-2">
                        <MapPin className="h-3 w-3" />
                        <span>{warehouse.location}</span>
                      </div>

                      {warehouse.status !== "maintenance" && (
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="flex items-center space-x-1">
                            <Package className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">Capacity:</span>
                            <span className={`font-medium ${getCapacityColor(capacityPercentage)}`}>
                              {capacityPercentage}%
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">Staff:</span>
                            <span className="font-medium text-gray-900">{warehouse.staff}</span>
                          </div>
                        </div>
                      )}

                      {warehouse.status === "maintenance" && (
                        <div className="flex items-center space-x-2 text-xs text-orange-600 font-medium">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Under maintenance - Unavailable</span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
            <div className="text-xs text-gray-500">
              Currently managing: <span className="font-medium text-gray-700">{selectedWarehouse.name}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
