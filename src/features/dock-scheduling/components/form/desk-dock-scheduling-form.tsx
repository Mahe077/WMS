"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TIME_SLOTS, VEHICLE_DURATIONS } from "@/lib/types"
import { Dock, DockBooking } from "../../types/dock.types"
import { DockBookingCategory, DockBookingPriority, DockStatus, TemperatureControl, VehicleType } from "@/lib/enum"
import React, { useEffect, useState } from "react"
import { useNotifications } from "@/contexts/app-context"
import { FormDialog } from "@/components/common/form-dialog"
import { CheckCircle } from "lucide-react"
import { Selector } from "@/components/ui/selector"

interface DesktopBookingFormModalProps {
  existingBooking?: DockBooking | null
  docks: Dock[]
  selectedDate: string
  onSubmit: (booking: DockBooking) => void
  onCancel: () => void
  dock?: Dock
  timeSlot?: string
}

export function DesktopBookingFormModal({
  existingBooking,
  docks,
  selectedDate,
  onSubmit,
  onCancel,
  dock,
  timeSlot,
}: DesktopBookingFormModalProps) {
  const { addNotification } = useNotifications()
  const [formData, setFormData] = useState<DockBooking>(
    existingBooking || {
      id: "",
      dockId: dock?.id || "",
      startTime: timeSlot || "",
      endTime: "", // Will be calculated
      date: selectedDate,
      carrier: "",
      bookingRef: "",
      vehicleType: VehicleType.Truck,
      temperatureControl: TemperatureControl.Ambient,
      status: DockStatus.Scheduled,
      eta: "",
      duration: 30,
      priority: DockBookingPriority.Medium,
      contactPerson: "",
      phoneNumber: "",
      estimatedPallets: 0,
      activity: DockBookingCategory.Receiving,
      notes: "",
      truck: "",
      driver: "",
      shipmentId: "",
      poNumber: "",
    }
  )

  useEffect(() => {
    if (existingBooking) {
      setFormData(existingBooking)
    } else {
      setFormData((prev) => ({
        ...prev,
        dockId: dock?.id || "",
        startTime: timeSlot || "",
        date: selectedDate,
      }))
    }
  }, [existingBooking, dock, timeSlot, selectedDate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: keyof DockBooking, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.dockId || !formData.startTime || !formData.carrier || !formData.bookingRef) {
      addNotification({
        type: "error",
        message: "Please fill in all required fields (Dock, Time, Carrier, Booking Ref).",
      })
      return
    }

    // Basic time validation
    const startMinutes = timeToMinutes(formData.startTime)
    const endMinutes = startMinutes + formData.duration
    if (endMinutes > timeToMinutes("23:59")) {
      addNotification({
        type: "error",
        message: "Booking extends beyond working hours (23:59).",
      })
      return
    }

    onSubmit(formData)
  }

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  const selectedDock = docks.find((d) => d.id === formData.dockId);

  return (
    <FormDialog
      open={true}
      onClose={onCancel}
      title={existingBooking ? "Edit Booking" : "New Dock Booking"}
      description={selectedDock && `${selectedDock.name} • ${formData.startTime}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dockId" >
              Dock
            </Label>
            <Selector
              key="dockId"
              placeholder="Select a dock"
              options={docks
                .filter((d) => d.status === DockStatus.Active)
                .map((d) => ({
                  value: d.id,
                  label: `${d.name} (${d.type})`,
                }))}
              value={formData.dockId}
              onChange={(value) => handleSelectChange("dockId", value)}
              widthClass="w-full"
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="date" >
              Date
            </Label>
            <Input id="date" type="date" value={formData.date} onChange={handleChange} className="col-span-3" readOnly />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startTime" >
              Time Slot
            </Label>
            <Selector
              key={"startTime"}
              placeholder="Select time slot"
              options={TIME_SLOTS.map((time) => ({
                key: time,
                value: time,
                label: time,
              }))}
              value={formData.startTime}
              onChange={(value) =>
                handleSelectChange('startTime', value )
              }
              widthClass="w-full"
              />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" >
              Duration (min)
            </Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              className="col-span-3"
              min="15"
              step="15"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="carrier" >
              Carrier
            </Label>
            <Input id="carrier" value={formData.carrier} onChange={handleChange} className="col-span-3" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity" >
              Activity
            </Label>
            <Selector
              key={"activity"}
              placeholder="Select activity type"
              options={Object.values(DockBookingCategory).map((category) => ({
                value: category,
                label: category,
              }))}
              value={formData.activity || ""}
              onChange={(value) => handleSelectChange("activity", value)}
              widthClass="w-full"
            />
          </div>

          {formData.activity === DockBookingCategory.Receiving && (
            <React.Fragment>
            <div className="space-y-2">
              <Label htmlFor="poNumber" >
                PO Number
              </Label>
              <Input id="poNumber" value={formData.poNumber} onChange={handleChange} className="col-span-3" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipmentID" >
                Shipment ID
              </Label>
              <Input id="shipmentID" value={formData.shipmentId} onChange={handleChange} className="col-span-3" />
            </div>
            </React.Fragment>
          )}

          <div className="space-y-2">
            <Label htmlFor="vehicleType" >
              Vehicle Type
            </Label>
            <Selector
              key={"vehicleType"}
              placeholder="Select vehicle type"
              options={Object.entries(VEHICLE_DURATIONS).map(([type, duration]) => ({
                value: type,
                label: `${type} (${duration} min)`,
              }))}
              value={formData.vehicleType as VehicleType}
              onChange={(value) =>
                handleSelectChange("vehicleType", value)
              }
              widthClass="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperatureControl" >
              Temp Control
            </Label>
            <Selector
              key={"temperatureControl"}
              placeholder="Select temperature"
              options={Object.values(TemperatureControl).map((temp) => ({
                value: temp,
                label: temp,
              }))}
              value={formData.temperatureControl as TemperatureControl}
              onChange={(value) =>
                handleSelectChange("temperatureControl", value)
              }
              widthClass="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" >
              Priority
            </Label>
            <Selector
              key={"priority"}
              placeholder="Select priority"
              options={Object.values(DockBookingPriority).map((priority) => ({
                value: priority,
                label: priority,
              }))}
              value={formData.priority as DockBookingPriority}
              onChange={(value) =>
                handleSelectChange("priority", value)
              }
              widthClass="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedPallets" >
              Est. Pallets
            </Label>
            <Input
              id="estimatedPallets"
              type="number"
              value={formData.estimatedPallets}
              onChange={handleChange}
              className="col-span-3"
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="truckNumber" >
              Truck Number
            </Label>
            <Input id="truckNumber" value={formData.truck} onChange={handleChange} className="col-span-3" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="driver" >
              Driver Name
            </Label>
            <Input id="driver" value={formData.driver} onChange={handleChange} className="col-span-3" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPerson" >
              Contact Person
            </Label>
            <Input id="contactPerson" value={formData.contactPerson} onChange={handleChange} className="col-span-3" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" >
              Phone Number
            </Label>
            <Input id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="col-span-3" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes" >
            Notes
          </Label>
          <Textarea id="notes" value={formData.notes} onChange={handleChange} className="col-span-3" />
        </div>


        {/* Dock Compatibility Check */}
        {selectedDock && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Dock Compatibility</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Type: {selectedDock.type}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Max Vehicle: {selectedDock.maxVehicleSize}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>
                  Temperature: {" "}
                  {(selectedDock?.temperatureZones ?? []).join(", ")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>
                  Equipment: {selectedDock?.equipment?.length ?? 0} items
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            {existingBooking ? "Save Changes" : "Create Booking"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </FormDialog>
  )
}