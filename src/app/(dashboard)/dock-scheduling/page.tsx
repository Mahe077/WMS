"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { StatusBadge } from "@/components/common/status-badge";
import { useNotifications } from "@/contexts/app-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { DockBookingCategory, DockBookingPriority, DockStatus, DockType, TemperatureControl, VehicleType } from "@/lib/enum"
import { ProtectedRoute } from "@/components/common/protected-route"
import { Dock, DockBooking } from "@/features/dock-scheduling/types/dock.types"
import DockSchedulingDesk from "@/features/dock-scheduling/components/dock-scheduling-desk"
import { DockSchedulingMobile } from "@/features/dock-scheduling/components/dock-scheduling-mobile"

export default function DockSchedulingPage() {
  const { addNotification } = useNotifications()
  const isMobile = useIsMobile()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedDock, setSelectedDock] = useState<string>("all")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [editingBooking, setEditingBooking] = useState<DockBooking | null>(null)
  const [filterCarrier, setFilterCarrier] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [draggedBooking, setDraggedBooking] = useState<DockBooking | null>(null)
  const [selectedDockType, setSelectedDockType] = useState<string>(DockType.Rear)

  // Mock dock data
  const docks: Dock[] = [
    {
      id: "DOCK-01",
      name: "Dock 1",
      type: DockType.Rear,
      temperatureZones: ["ambient", "chilled"],
      maxVehicleSize: VehicleType.Trailer,
      status: DockStatus.Active,
      equipment: ["forklift", "dock-leveler", "overhead-door"],
    },
    {
      id: "DOCK-02",
      name: "Dock 2",
      type: DockType.Rear,
      temperatureZones: ["frozen", "chilled"],
      maxVehicleSize: VehicleType.Container,
      status: DockStatus.Active,
      equipment: ["forklift", "dock-leveler", "temperature-control"],
    },
    {
      id: "DOCK-03",
      name: "Dock 3",
      type: DockType.Rear,
      temperatureZones: ["ambient"],
      maxVehicleSize: VehicleType.Truck,
      status: DockStatus.Active,
      equipment: ["forklift", "dock-leveler"],
    },
    {
      id: "DOCK-05",
      name: "Dock 5",
      type: DockType.Rear,
      temperatureZones: ["ambient", "chilled", "frozen"],
      maxVehicleSize: VehicleType.Trailer,
      status:DockStatus.Maintenance,
      equipment: ["forklift", "dock-leveler", "temperature-control", "overhead-door"],
    },
    {
      id: "DOCK-06",
      name: "Dock 6",
      type: DockType.Side,
      temperatureZones: ["ambient", "chilled", "frozen"],
      maxVehicleSize: VehicleType.Trailer,
      status:DockStatus.Maintenance,
      equipment: ["forklift", "dock-leveler", "temperature-control", "overhead-door"],
    },
    {
      id: "DOCK-07",
      name: "Dock 7",
      type: DockType.Side,
      temperatureZones: ["ambient", "chilled", "frozen"],
      maxVehicleSize: VehicleType.Trailer,
      status:DockStatus.Active,
      equipment: ["forklift", "dock-leveler", "temperature-control", "overhead-door"],
    },
    {
      id: "DOCK-08",
      name: "Dock 8",
      type: DockType.Side,
      temperatureZones: ["ambient", "chilled", "frozen"],
      maxVehicleSize: VehicleType.Trailer,
      status:DockStatus.Active,
      equipment: ["forklift", "dock-leveler", "temperature-control", "overhead-door"],
    },
  ]

  // Mock booking data
  const [bookings, setBookings] = useState<DockBooking[]>([
    {
      id: "BK-001",
      dockId: "DOCK-01",
      startTime: "09:00",
      endTime: "10:00",
      date: selectedDate,
      carrier: "DHL Express",
      bookingRef: "DHL-2024-001",
      vehicleType: VehicleType.Truck,
      temperatureControl: TemperatureControl.Ambient,
      status: DockStatus.Scheduled,
      eta: "09:15",
      duration: 60,
      priority: DockBookingPriority.High,
      contactPerson: "John Smith",
      phoneNumber: "+1-555-0123",
      estimatedPallets: 15,
      activity: DockBookingCategory.Dispatch,
    },
    {
      id: "BK-002",
      dockId: "DOCK-02",
      startTime: "14:15",
      endTime: "15:30",
      date: selectedDate,
      carrier: "FedEx Ground",
      bookingRef: "FDX-2024-002",
      vehicleType: VehicleType.Container,
      temperatureControl: TemperatureControl.Chilled,
      status: DockStatus.Arrived,
      duration: 90,
      priority: DockBookingPriority.Medium,
      contactPerson: "Sarah Johnson",
      phoneNumber: "+1-555-0124",
      estimatedPallets: 25,
      activity: DockBookingCategory.Blocked,
    },
    {
      id: "BK-003",
      dockId: "DOCK-03",
      startTime: "16:30",
      endTime: "17:00",
      date: selectedDate,
      carrier: "UPS Standard",
      bookingRef: "UPS-2024-003",
      vehicleType: VehicleType.Truck,
      temperatureControl: TemperatureControl.Ambient,
      status: DockStatus.Loading,
      duration: 45,
      priority: DockBookingPriority.Medium,
      contactPerson: "Mike Wilson",
      phoneNumber: "+1-555-0125",
      estimatedPallets: 12,
      activity: DockBookingCategory.Dispatch,
    },
  ])

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

   // Check for booking conflicts
  const hasConflict = (dockId: string, startTime: string, endTime: string, excludeId?: string) => {
    return filteredBookings.some((booking) => {
      if (booking.id === excludeId) return false
      if (booking.dockId !== dockId) return false

      const bookingStart = timeToMinutes(booking.startTime)
      const bookingEnd = timeToMinutes(booking.endTime)
      const newStart = timeToMinutes(startTime)
      const newEnd = timeToMinutes(endTime)

      return newStart < bookingEnd && newEnd > bookingStart
    })
  }

  // Utility functions
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  const minutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
  }


  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case DockBookingPriority.High:
        return "border-l-red-500 bg-red-50"
      case DockBookingPriority.Medium:
        return "border-l-yellow-500 bg-yellow-50"
      case DockBookingPriority.Low:
        return "border-l-green-500 bg-green-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  const getDockUtilization = (dockId: string) => {
    const dockBookings = filteredBookings.filter((b) => b.dockId === dockId)
    const totalMinutes = dockBookings.reduce((sum, booking) => sum + booking.duration, 0)
    const workingHours = 16 * 60 // 6 AM to 10 PM
    return Math.round((totalMinutes / workingHours) * 100)
  }

  // Handle booking submission
  const handleBookingSubmit = (formData: DockBooking) => {
    const startMinutes = timeToMinutes(formData.startTime)
    const endMinutes = startMinutes + formData.duration
    const endTime = minutesToTime(endMinutes)

    const booking: DockBooking = {
      id: editingBooking?.id || `BK-${Date.now()}`,
      dockId: formData.dockId,
      startTime: formData.startTime,
      endTime,
      date: selectedDate,
      carrier: formData.carrier,
      bookingRef: formData.bookingRef,
      vehicleType: formData.vehicleType,
      temperatureControl: formData.temperatureControl,
      status: formData.status || DockStatus.Scheduled,
      eta: formData.eta,
      duration: formData.duration,
      priority: formData.priority,
      contactPerson: formData.contactPerson,
      phoneNumber: formData.phoneNumber,
      estimatedPallets: formData.estimatedPallets,
      notes: formData.notes,
      activity: formData.activity ?? null,
    }

    if (editingBooking) {
      setBookings((prev) => prev.map((b) => (b.id === editingBooking.id ? booking : b)))
      addNotification({
        type: "success",
        message: `Booking ${booking.bookingRef} updated successfully`,
      })
    } else {
      setBookings((prev) => [...prev, booking])
      addNotification({
        type: "success",
        message: `Booking ${booking.bookingRef} created successfully`,
      })
    }

    setShowBookingForm(false)
    setEditingBooking(null)
    setSelectedTimeSlot(null)
  }

  // Handle booking deletion
  const handleDeleteBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId))
    addNotification({
      type: "success",
      message: "Booking deleted successfully",
    })
  }

    // Handle booking move
  const handleBookingMove = (booking: DockBooking, newDockId: string, newTimeSlot: string) => {
    const startMinutes = timeToMinutes(newTimeSlot)
    const endMinutes = startMinutes + booking.duration
    const endTime = minutesToTime(endMinutes)

    // Check for conflicts in the new location
    if (hasConflict(newDockId, newTimeSlot, endTime, booking.id)) {
      addNotification({
        type: "error",
        message: "Cannot move booking - conflicts with existing schedule",
      })
      return
    }

    // Update the booking
    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, dockId: newDockId, startTime: newTimeSlot, endTime } : b))
    )
    addNotification({
      type: "success",
      message: `Booking ${booking.bookingRef} moved successfully`,
    })
  }

  // Get booking for specific dock and time (for desktop grid)
  const getBookingAtTime = (dockId: string, time: string) => {
    const timeMinutes = timeToMinutes(time)
    return filteredBookings.find((booking) => {
      if (booking.dockId !== dockId) return false
      const startMinutes = timeToMinutes(booking.startTime)
      const endMinutes = timeToMinutes(booking.endTime)
      return timeMinutes >= startMinutes && timeMinutes < endMinutes
    })
  }

  // Handle slot click (desktop only)
  const handleSlotClick = (dockId: string, time: string) => {
    const dock = docks.find((d) => d.id === dockId)
    if (dock?.status !== DockStatus.Active) return

    const existingBooking = getBookingAtTime(dockId, time)
    if (existingBooking) {
      setEditingBooking(existingBooking)
      setShowBookingForm(true)
    } else {
      setSelectedDock(dockId)
      setSelectedTimeSlot(time)
      setEditingBooking(null)
      setShowBookingForm(true)
    }
  }

  return (
    <ProtectedRoute requiredPermission="dock-scheduling.view">
      {isMobile ? (
        <DockSchedulingMobile
          docks={docks}
          bookings={filteredBookings}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedDock={selectedDock}
          setSelectedDock={setSelectedDock}
          filterCarrier={filterCarrier}
          setFilterCarrier={setFilterCarrier}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          showBookingForm={showBookingForm}
          setShowBookingForm={setShowBookingForm}
          editingBooking={editingBooking}
          setEditingBooking={setEditingBooking}
          handleBookingSubmit={handleBookingSubmit}
          handleDeleteBooking={handleDeleteBooking}
          handleSlotClick={handleSlotClick}
          getBookingAtTime={getBookingAtTime}
          getStatusBadge={(status: string) => <StatusBadge status={status} />}
          getPriorityColor={getPriorityColor}
          getDockUtilization={getDockUtilization}
          setSelectedTimeSlot={setSelectedTimeSlot}
          onBookingEdit={(booking) => {
            setEditingBooking(booking)
            setShowBookingForm(true)
          }}
        />
      ) : (
        <DockSchedulingDesk
          docks={docks}
          bookings={filteredBookings}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedDock={selectedDock}
          setSelectedDock={setSelectedDock}
          filterCarrier={filterCarrier}
          setFilterCarrier={setFilterCarrier}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          showBookingForm={showBookingForm}
          setShowBookingForm={setShowBookingForm}
          editingBooking={editingBooking}
          setEditingBooking={setEditingBooking}
          handleBookingSubmit={handleBookingSubmit}
          handleDeleteBooking={handleDeleteBooking}
          handleSlotClick={handleSlotClick}
          getBookingAtTime={getBookingAtTime}
          getStatusBadge={(status: string) => <StatusBadge status={status} />}
          getPriorityColor={getPriorityColor}
          getDockUtilization={getDockUtilization}
          setSelectedTimeSlot={setSelectedTimeSlot}
          selectedTimeSlot={selectedTimeSlot}
          onBookingEdit={(booking) => {
            setEditingBooking(booking)
            setShowBookingForm(true)
          }}
          handleBookingMove={handleBookingMove}
          setDraggedBooking={setDraggedBooking}
          draggedBooking={draggedBooking}
          selectedDockType={selectedDockType}
          setSelectedDockType={setSelectedDockType}
        />
      )}
    </ProtectedRoute>
  )
}