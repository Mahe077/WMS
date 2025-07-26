"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Package, MapPin, Users, AlertTriangle, X } from "lucide-react"
import { useNotifications } from "@/contexts/app-context"
import { useMobile } from "@/hooks/use-mobile"

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

interface WarehouseSelectorProps {
  className?: string
}

export function WarehouseSelector({ className = "" }: WarehouseSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseItem>(warehouses[0])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { addNotification } = useNotifications()
  const isMobile = useMobile();
  const isDesktop = !isMobile;


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDesktop && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isDesktop])

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

  const renderWarehouseItem = (warehouse: WarehouseItem, isSelected: boolean) => {
    const capacityPercentage = getCapacityPercentage(warehouse.currentLoad, warehouse.capacity)
    const isDisabled = warehouse.status === "maintenance"

    return (
      <button
        key={warehouse.id}
        className={`
          w-full px-4 py-3 text-left transition-colors
          ${isDesktop ? "hover:bg-gray-50" : "p-4 rounded-2xl border"}
          ${isSelected && isDesktop ? "bg-blue-50 border-r-2 border-blue-500" : ""}
          ${isDisabled ? "opacity-60 cursor-not-allowed" : isDesktop ? "cursor-pointer" : "bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50 active:scale-[0.98]"}
        `}
        onClick={() => handleWarehouseSelect(warehouse)}
        disabled={isDisabled}
      >
        <div className="flex items-start space-x-3">
          <div className="relative flex-shrink-0">
            <div className={`
              ${isDesktop ? "w-8 h-8" : "w-10 h-10"}
              bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center
              ${isDesktop ? "" : "shadow-md"}
            `}>
              <Package className={`${isDesktop ? "h-4 w-4" : "h-5 w-5"} text-white`} />
            </div>
            <div
              className={`absolute
                ${isDesktop ? "-bottom-0.5 -right-0.5 w-2.5 h-2.5" : "-bottom-1 -right-1 w-3 h-3"}
                rounded-full border border-white ${
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
                <span className={`font-semibold text-gray-900 truncate ${isDesktop ? "text-sm" : "text-base"}`}>{warehouse.name}</span>
                <Badge variant="outline" className="text-xs">
                  {warehouse.code}
                </Badge>
              </div>
              {isDesktop && (
                <Badge variant="outline" className={`text-xs capitalize ${getStatusColor(warehouse.status)}`}>
                  {warehouse.status}
                </Badge>
              )}
            </div>

            <div className={`flex items-center space-x-1 text-gray-500 mb-2 ${isDesktop ? "text-xs" : "text-sm"}`}>
              <MapPin className={`${isDesktop ? "h-3 w-3" : "h-3.5 w-3.5"}`} />
              <span>{warehouse.location}</span>
            </div>

            {warehouse.status !== "maintenance" ? (
              <div className={`grid gap-3 ${isDesktop ? "grid-cols-2 text-xs" : "grid-cols-1 text-sm"}`}>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-500">Capacity:</span>
                  <span className={`font-medium ${getCapacityColor(capacityPercentage)}`}>
                    {capacityPercentage}%
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className={`${isDesktop ? "h-3 w-3" : "h-3.5 w-3.5"} text-gray-400`} />
                  <span className="font-medium text-gray-900">{warehouse.staff}</span>
                </div>
              </div>
            ) : (
              <div className={`flex items-center space-x-2 text-orange-600 ${isDesktop ? "text-xs" : "text-sm font-medium"}`}>
                <AlertTriangle className={`${isDesktop ? "h-3 w-3" : "h-3.5 w-3.5"}`} />
                <span>Under maintenance - Unavailable</span>
              </div>
            )}
          </div>
        </div>
      </button>
    )
  }

  if (warehouses.length <= 1){
    return (
      <></>
    )
  }

  if (isDesktop) {
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
              {warehouses.map((warehouse) => renderWarehouseItem(warehouse, selectedWarehouse.id === warehouse.id))}
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

  return (
    <>
      {/* Mobile Trigger Button - Compact Header Display */}
      <Button
        variant="ghost"
        className={`flex items-center space-x-2 px-2 py-1.5 hover:bg-gray-100 rounded-lg transition-colors h-auto ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <div className="relative">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <Package className="h-3.5 w-3.5 text-white" />
          </div>
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${
              selectedWarehouse.status === "active"
                ? "bg-green-400"
                : selectedWarehouse.status === "maintenance"
                  ? "bg-orange-400"
                  : "bg-gray-400"
            }`}
          ></div>
        </div>
        <div className="flex flex-col items-start min-w-0">
          <span className="text-xs font-semibold text-gray-900 truncate max-w-[80px]">{selectedWarehouse.code}</span>
          <span className="text-xs text-gray-500 truncate max-w-[80px]">
            {selectedWarehouse.location.split(",")[0]}
          </span>
        </div>
        <ChevronDown className="h-3 w-3 text-gray-400 flex-shrink-0" />
      </Button>

      {/* Mobile Bottom Sheet Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 m-0 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Bottom Sheet */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Select Warehouse</h2>
                <p className="text-sm text-gray-500">Choose your active location</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Current Selection Banner */}
            <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
              <div className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-2">Current Selection</div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      selectedWarehouse.status === "active"
                        ? "bg-green-400"
                        : selectedWarehouse.status === "maintenance"
                          ? "bg-orange-400"
                          : "bg-gray-400"
                    }`}
                  ></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-bold text-gray-900 truncate">{selectedWarehouse.name}</h3>
                    <Badge variant="outline" className="text-xs font-medium">
                      {selectedWarehouse.code}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{selectedWarehouse.location}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-500">Capacity:</span>
                      <span
                        className={`font-semibold ${getCapacityColor(
                          getCapacityPercentage(selectedWarehouse.currentLoad, selectedWarehouse.capacity),
                        )}`}
                      >
                        {getCapacityPercentage(selectedWarehouse.currentLoad, selectedWarehouse.capacity)}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-gray-400" />
                      <span className="font-semibold text-gray-900">{selectedWarehouse.staff}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Warehouse List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Available Locations
              </div>
              <div className="space-y-3">
                {warehouses
                  .filter((warehouse) => warehouse.id !== selectedWarehouse.id)
                  .map((warehouse) => renderWarehouseItem(warehouse, selectedWarehouse.id === warehouse.id))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-t-2xl">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-3">
                  Active: <span className="font-semibold text-gray-700">{selectedWarehouse.name}</span>
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-white hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Continue with {selectedWarehouse.code}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}