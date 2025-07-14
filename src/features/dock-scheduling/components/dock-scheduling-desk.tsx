"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Thermometer,
  Package,
  X,
} from "lucide-react";
import { DockBooking, Dock } from "../types/dock.types";
import { DesktopBookingFormModal } from "./form/desk-dock-scheduling-form";
import { DockBookingPriority, DockStatus, DockType, TemperatureControl } from "@/lib/enum";
import { TIME_SLOTS } from "@/lib/types";

interface DockSchedulingProps {
  docks: Dock[];
  bookings: DockBooking[];
  getDockUtilization: (dockId: string) => number;
  handleBookingSubmit: (booking: DockBooking) => void;
  handleDeleteBooking: (bookingId: string) => void;
  handleSlotClick: (dockId: string, timeSlot: string) => void;
  onBookingEdit: (booking: DockBooking) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  getPriorityColor: (priority: DockBookingPriority) => string;
  selectedDate?: string; // ISO date string
  setSelectedDate?: (date: string) => void; // Function to set selected date
  selectedDock?: string; // Dock ID or "all"
  setSelectedDock?: (dockId: string) => void; // Function to set selected dock
  showBookingForm?: boolean; // Whether to show the booking form
  setShowBookingForm?: (show: boolean) => void; // Function to show/hide booking form
  editingBooking?: DockBooking | null; // Booking being edited, if any
  setEditingBooking?: (booking: DockBooking | null) => void; // Function to set editing booking
  filterCarrier?: string; // Carrier filter, "all" or specific carrier name
  setFilterCarrier?: (carrier: string) => void; // Function to set carrier filter
  filterStatus?: string; // Status filter, "all" or specific status
  setFilterStatus?: (status: string) => void; // Function to set status filter
  getBookingAtTime: (dockId: string, time: string) => DockBooking | undefined;
  setSelectedTimeSlot: (timeSlot: string) => void; // Function to set selected time slot
  selectedTimeSlot?: string | null; // Currently selected time slot, if any
  handleBookingMove: (
    booking: DockBooking,
    dockId: string,
    timeSlot: string
  ) => void; // Function to handle booking move
  setDraggedBooking?: (booking: DockBooking | null) => void; // Function to set dragged booking
  draggedBooking?: DockBooking | null; // Currently dragged booking, if any
  selectedDockType?: string; // Dock type filter, "all" or specific type
  setSelectedDockType?: (dockType: string) => void; // Function to set selected dock type
}

export default function DockSchedulingDesk({
  docks,
//   bookings,
  handleBookingSubmit,
  handleSlotClick,
  getDockUtilization,
  getBookingAtTime,
  getStatusBadge,
  selectedDate = new Date().toISOString().split("T")[0], // Default to today
  setSelectedDate = () => {}, // Function to set selected date
  selectedDock,
  setSelectedDock = () => {}, // Function to set selected dock
  showBookingForm = false, // Default to not showing booking form
  setShowBookingForm = () => {}, // Function to show/hide booking form
  editingBooking = null, // No booking being edited by default
  setEditingBooking = () => {}, // Function to set editing booking
  filterCarrier = "all", // Default to "all" carriers
  setFilterCarrier = () => {}, // Function to set carrier filter
  filterStatus = "all", // Default to "all" status
  setFilterStatus = () => {}, // Function to set status filter
  setSelectedTimeSlot = () => {}, // Function to set selected time slot
  selectedTimeSlot,
  getPriorityColor,
  handleDeleteBooking,
  // onBookingEdit = () => {}, // Function to handle booking edit
  handleBookingMove,
  setDraggedBooking = () => {}, // Function to set dragged booking
  draggedBooking = null,
  selectedDockType,
  setSelectedDockType = () => {},
}: DockSchedulingProps) {
  const filteredDocks = docks.filter(d => d.type === selectedDockType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Dock Scheduling
          </h2>
          <p className="text-muted-foreground">
            Smart scheduling for receiving and dispatch operations
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              setSelectedDock("all");
              setSelectedTimeSlot("");
              setEditingBooking(null);
              setShowBookingForm(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Date and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Date Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const date = new Date(selectedDate);
                  date.setDate(date.getDate() - 1);
                  setSelectedDate(date.toISOString().split("T")[0]);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const date = new Date(selectedDate);
                  date.setDate(date.getDate() + 1);
                  setSelectedDate(date.toISOString().split("T")[0]);
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Select value={selectedDock} onValueChange={setSelectedDock}>
                <SelectTrigger>
                  <SelectValue placeholder="All Docks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Docks</SelectItem>
                  {docks.map((dock) => (
                    <SelectItem key={dock.id} value={dock.id}>
                      {dock.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterCarrier} onValueChange={setFilterCarrier}>
                <SelectTrigger>
                  <SelectValue placeholder="All Carriers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Carriers</SelectItem>
                  <SelectItem value="dhl">DHL</SelectItem>
                  <SelectItem value="fedex">FedEx</SelectItem>
                  <SelectItem value="ups">UPS</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="arrived">Arrived</SelectItem>
                  <SelectItem value="loading">Loading</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedDockType} onValueChange={setSelectedDockType}>
                <SelectTrigger>
                  <SelectValue placeholder="Dock Type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(DockType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dock Utilization Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredDocks.map((dock) => (
          <Card key={dock.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                {dock.name}
                <Badge
                  variant={dock.status === DockStatus.Active ? "default" : "secondary"}
                >
                  {dock.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Utilization:</span>
                  <span className="font-medium">
                    {getDockUtilization(dock.id)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${getDockUtilization(dock.id)}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {dock.type} • Max: {dock.maxVehicleSize}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Grid */}
      <Card>
        <CardHeader>
          <CardTitle>
            Schedule - {new Date(selectedDate).toLocaleDateString()}
          </CardTitle>
          <CardDescription>
            Click on time slots to create bookings or edit existing ones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                <div className="font-medium text-center py-2">Time</div>
                {filteredDocks.map((dock) => (
                  <div key={dock.id} className="font-medium text-center py-2">
                    <div className="flex flex-col items-center">
                      <span>{dock.name}</span>
                      <div className="flex gap-1 mt-1">
                        {dock.temperatureZones?.includes(
                          TemperatureControl.Frozen
                        ) && <Thermometer className="h-3 w-3 text-blue-600" />}
                        {dock.temperatureZones?.includes(
                          TemperatureControl.Chilled
                        ) && <Thermometer className="h-3 w-3 text-green-600" />}
                        <Badge variant="outline" className="text-xs">
                          {dock.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {TIME_SLOTS.map((timeSlot) => (
                  <div key={timeSlot} className="grid grid-cols-5 gap-2">
                    <div className="flex items-center justify-center font-medium text-sm bg-gray-50 rounded p-2 min-h-[60px]">
                      {timeSlot}
                    </div>
                    {filteredDocks.map((dock) => {
                      const booking = getBookingAtTime(dock.id, timeSlot);
                      const isFirstSlot =
                        booking && booking.startTime === timeSlot;

                      return (
                        <div
                          key={`${dock.id}-${timeSlot}`}
                          className={`min-h-[60px] rounded border-2 cursor-pointer transition-colors ${
                            dock.status !== DockStatus.Active
                              ? "bg-gray-200 border-gray-300 cursor-not-allowed"
                              : booking
                              ? isFirstSlot
                                ? `${getPriorityColor(
                                    booking?.priority || DockBookingPriority.Low
                                  )} border-gray-300 hover:border-blue-400`
                                : "bg-transparent border-transparent"
                              : "bg-white border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                          }`}
                          onClick={() => handleSlotClick(dock.id, timeSlot)}
                          draggable={!!booking && isFirstSlot}
                          onDragStart={(e) => {
                            if (booking && isFirstSlot) {
                              setDraggedBooking(booking);
                              e.dataTransfer.effectAllowed = "move";
                            }
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            // Optionally highlight drop target
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (
                              draggedBooking &&
                              dock.status === DockStatus.Active &&
                              !getBookingAtTime(dock.id, timeSlot)
                            ) {
                              handleBookingMove(
                                draggedBooking,
                                dock.id,
                                timeSlot
                              );
                            }
                            setDraggedBooking(null);
                          }}
                        >
                          {booking && isFirstSlot && (
                            <div className="p-2 h-full">
                              <div className="flex items-center justify-between mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {booking.vehicleType}
                                </Badge>
                                <div className="flex gap-1">
                                  {getStatusBadge(booking?.status)}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (booking.id) {
                                        handleDeleteBooking(booking.id);
                                      }
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="text-xs space-y-1">
                                <div className="font-medium truncate">
                                  {booking.carrier}
                                </div>
                                <div className="text-gray-600 truncate">
                                  {booking.bookingRef}
                                </div>
                                <div className="flex items-center gap-1 text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  <span>{booking.duration}min</span>
                                  {booking.temperatureControl !== null && (
                                    <>
                                      <Thermometer className="h-3 w-3 ml-1" />
                                      <span className="capitalize">
                                        {booking.temperatureControl}
                                      </span>
                                    </>
                                  )}
                                </div>
                                {booking.estimatedPallets && (
                                  <div className="flex items-center gap-1 text-gray-500">
                                    <Package className="h-3 w-3" />
                                    <span>
                                      {booking.estimatedPallets} pallets
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          {!booking && dock.status === DockStatus.Active && (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              <Plus className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <DesktopBookingFormModal
          existingBooking={editingBooking}
          docks={docks}
          selectedDate={selectedDate}
          onSubmit={handleBookingSubmit}
          onCancel={() => {
            setShowBookingForm(false);
            setEditingBooking(null);
          }}
          dock={selectedDock ? docks.find(d => d.id === selectedDock) : undefined}
          timeSlot={selectedTimeSlot || TIME_SLOTS[0]} // Default to first time slot if none selected
        />
      )}
    </div>
  );
}