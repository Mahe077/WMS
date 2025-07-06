import React, { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dock, DockBooking, TIME_SLOTS, VEHICLE_DURATIONS } from "@/lib/types"
import { DockBookingPriority, DockStatus, TemperatureControl, VehicleType } from "@/lib/enum"
import { Textarea } from "../../../ui/textarea"


export function MobileDockSchedulingForm({
  existingBooking,
  docks,
  selectedDate,
  onSubmit,
  onCancel,
}: {
  existingBooking?: DockBooking | null
  docks: Dock[]
  selectedDate: string
  onSubmit: (data: DockBooking) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    dockId: existingBooking?.dockId || "",
    startTime: existingBooking?.startTime || "09:00",
    vehicleType: existingBooking?.vehicleType || VehicleType.Truck,
    duration: existingBooking?.duration || VEHICLE_DURATIONS.Truck,
    carrier: existingBooking?.carrier || "",
    bookingRef: existingBooking?.bookingRef || "",
    temperatureControl: existingBooking?.temperatureControl || TemperatureControl.Ambient,
    status: existingBooking?.status || DockStatus.Scheduled,
    priority: existingBooking?.priority || DockBookingPriority.Medium,
    contactPerson: existingBooking?.contactPerson || "",
    phoneNumber: existingBooking?.phoneNumber || "",
    estimatedPallets: existingBooking?.estimatedPallets || "",
    eta: existingBooking?.eta || "",
    notes: existingBooking?.notes || "",
    activity: existingBooking?.activity || null,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const startMinutes = Number(formData.startTime.split(":")[0]) * 60 + Number(formData.startTime.split(":")[1])
    const endMinutes = startMinutes + Number(formData.duration)
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, "0")}:${(endMinutes % 60).toString().padStart(2, "0")}`

    onSubmit({
      ...formData,
      id: existingBooking?.id,
      duration: Number(formData.duration),
      estimatedPallets: formData.estimatedPallets ? Number(formData.estimatedPallets) : undefined,
      endTime,
      date: selectedDate,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4 space-y-0">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{existingBooking ? "Edit Booking" : "New Dock Booking"}</CardTitle>
          <CardDescription>{new Date(selectedDate).toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dockId">Dock</Label>
                <Select value={formData.dockId} onValueChange={(value) => setFormData({ ...formData, dockId: value })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dock" />
                  </SelectTrigger>
                  <SelectContent>
                    {docks
                      .filter((d) => d.status === DockStatus.Active)
                      .map((dock) => (
                        <SelectItem key={dock.id} value={dock.id}>
                          {dock.name} ({dock.type})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Select
                    value={formData.startTime}
                    onValueChange={(value) => setFormData({ ...formData, startTime: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    max="480"
                    step="15"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select
                  value={formData.vehicleType}
                  onValueChange={(value) => setFormData({ ...formData, vehicleType: value as VehicleType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(VEHICLE_DURATIONS).map(([type, duration]) => (
                      <SelectItem key={type} value={type}>
                        {type} ({duration} min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="carrier">Carrier</Label>
                <Input
                  id="carrier"
                  value={formData.carrier}
                  onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                  placeholder="DHL Express"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bookingRef">Booking Reference</Label>
                <Input
                  id="bookingRef"
                  value={formData.bookingRef}
                  onChange={(e) => setFormData({ ...formData, bookingRef: e.target.value })}
                  placeholder="DHL-2024-001"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperatureControl">Temperature</Label>
                  <Select
                    value={formData.temperatureControl}
                    onValueChange={(value) => setFormData({ ...formData, temperatureControl: value as TemperatureControl})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(TemperatureControl).map((temp) => (
                        <SelectItem key={temp} value={temp}>
                          {temp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value as DockBookingPriority })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(DockBookingPriority).map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="John Smith"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+1-555-0123"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedPallets">Pallets</Label>
                  <Input
                    id="estimatedPallets"
                    type="number"
                    min="1"
                    value={formData.estimatedPallets}
                    onChange={(e) => setFormData({ ...formData, estimatedPallets: e.target.value })}
                    placeholder="15"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {existingBooking ? "Update Booking" : "Create Booking"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}