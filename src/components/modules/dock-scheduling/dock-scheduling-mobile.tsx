"use client"

import type React from "react"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Clock, ChevronLeft, ChevronRight, Thermometer, Package, Calendar, Truck, MoreVertical } from "lucide-react"
import { Dock, DockBooking } from "@/lib/types"
import { DockBookingPriority, DockStatus } from "@/lib/enum"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { MobileDockSchedulingForm } from "./form/mobile-dock-scheduling-form"

interface DockSchedulingMobileProps {
  docks: Dock[]
  bookings: DockBooking[]
  getDockUtilization: (dockId: string) => number;
  handleBookingSubmit: (booking: DockBooking) => void
  handleDeleteBooking: (bookingId: string) => void
  handleSlotClick: (dockId: string, timeSlot: string) => void
  onBookingEdit: (booking: DockBooking) => void
  getStatusBadge: (status: string) => React.ReactNode
  getPriorityColor: (priority: DockBookingPriority) => string
  selectedDate?: string // ISO date string
  setSelectedDate?: (date: string) => void // Function to set selected date
  selectedDock?: string // Dock ID or "all"
  setSelectedDock?: (dockId: string) => void // Function to set selected dock
  showBookingForm?: boolean // Whether to show the booking form
  setShowBookingForm?: (show: boolean) => void // Function to show/hide booking form
  editingBooking?: DockBooking | null // Booking being edited, if any
  setEditingBooking?: (booking: DockBooking | null) => void // Function to set editing booking
  filterCarrier?: string // Carrier filter, "all" or specific carrier name
  setFilterCarrier?: (carrier: string) => void // Function to set carrier filter
  filterStatus?: string // Status filter, "all" or specific status
  setFilterStatus?: (status: string) => void // Function to set status filter
  getBookingAtTime: (dockId: string, time: string) => DockBooking | undefined;
  setSelectedTimeSlot: (timeSlot: string) => void; // Function to set selected time slot
}

export function DockSchedulingMobile({
  docks,
  bookings,
  // getDockUtilization,
  handleBookingSubmit,
  handleDeleteBooking,
  // handleSlotClick, // Function to handle slot click
  // onBookingEdit,
  getStatusBadge,
  getPriorityColor,
  selectedDate = new Date().toISOString().split("T")[0], // Default to today
  setSelectedDate = () => {}, // Function to set selected date
  selectedDock = "all",
  setSelectedDock = () => {}, // Function to set selected dock
  showBookingForm = false,
  setShowBookingForm = () => {}, // Function to show/hide booking form
  editingBooking = null,
  setEditingBooking = () => {}, // Function to set editing booking
  filterCarrier = "all",
  setFilterCarrier = () => {}, // Function to set carrier filter
  filterStatus = "all",
  setFilterStatus = () => {}, // Function to set status filter
  // getBookingAtTime, // Function to get booking at specific time
  // setSelecteTimeSlot = () => {}, // Function to set selected time slot
}: DockSchedulingMobileProps) {
  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesDate = booking.date === selectedDate
      const matchesDock = selectedDock === "all" || booking.dockId === selectedDock
      const matchesCarrier =
        filterCarrier === "all" || (booking.carrier && booking.carrier.toLowerCase().includes(filterCarrier.toLowerCase()))
      const matchesStatus = filterStatus === "all" || booking.status === filterStatus
      return matchesDate && matchesDock && matchesCarrier && matchesStatus
    })
  }, [bookings, selectedDate, selectedDock, filterCarrier, filterStatus])

  const getDockUtilization = (dockId: string) => {
    const dockBookings = filteredBookings.filter((b) => b.dockId === dockId)
    const totalMinutes = dockBookings.reduce((sum, booking) => sum + booking.duration, 0)
    const workingHours = 16 * 60 // 6 AM to 10 PM
    return Math.round((totalMinutes / workingHours) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Dock Scheduling</h2>
          <p className="text-muted-foreground">Smart scheduling for receiving and dispatch operations</p>
        </div>
        <Button
          className="w-full sm:w-auto"
          onClick={() => {
            setEditingBooking(null)
            setShowBookingForm(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
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
                  const date = new Date(selectedDate)
                  date.setDate(date.getDate() - 1)
                  setSelectedDate(date.toISOString().split("T")[0])
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
                  const date = new Date(selectedDate)
                  date.setDate(date.getDate() + 1)
                  setSelectedDate(date.toISOString().split("T")[0])
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dock Utilization Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {docks.map((dock) => (
          <Card key={dock.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                {dock.name}
                <Badge variant={dock.status === DockStatus.Active ? "default" : "secondary"}>{dock.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Utilization:</span>
                  <span className="font-medium">{getDockUtilization(dock.id)}%</span>
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

      {/* Bookings List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">
          Bookings for {new Date(selectedDate).toLocaleDateString()} ({filteredBookings.length})
        </h3>

        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No bookings found for the selected criteria</p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => {
            const dock = docks.find((d) => d.id === booking.dockId)

            return (
              <Card key={booking.id} className={`border-l-4 ${getPriorityColor(booking.priority ?? DockBookingPriority.Low)} py-0`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-base truncate">{booking.carrier}</h4>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{booking.bookingRef}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {booking.startTime} - {booking.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          {dock?.name}
                        </span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingBooking(booking)
                            setShowBookingForm(true)
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() =>  booking.id && handleDeleteBooking(booking.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Vehicle:</span>
                      <div className="font-medium capitalize">{booking.vehicleType}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <div className="font-medium">{booking.duration} min</div>
                    </div>
                    {booking.temperatureControl !== null && (
                      <div>
                        <span className="text-gray-600">Temperature:</span>
                        <div className="font-medium flex items-center gap-1">
                          <Thermometer className="h-3 w-3" />
                          <span className="capitalize">{booking.temperatureControl}</span>
                        </div>
                      </div>
                    )}
                    {booking.estimatedPallets && (
                      <div>
                        <span className="text-gray-600">Pallets:</span>
                        <div className="font-medium flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          <span>{booking.estimatedPallets} pallets</span>
                        </div>
                      </div>
                    )}
                    {booking.contactPerson && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Contact:</span>
                        <div className="font-medium">{booking.contactPerson}</div>
                        {booking.phoneNumber && <div className="text-xs text-gray-500">{booking.phoneNumber}</div>}
                      </div>
                    )}
                    {booking.notes && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Notes:</span>
                        <div className="text-sm">{booking.notes}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <MobileDockSchedulingForm
          existingBooking={editingBooking}
          docks={docks}
          selectedDate={selectedDate}
          onSubmit={handleBookingSubmit}
          onCancel={() => {
            setShowBookingForm(false)
            setEditingBooking(null)
          }}
        />
      )}
    </div>
  )
}
