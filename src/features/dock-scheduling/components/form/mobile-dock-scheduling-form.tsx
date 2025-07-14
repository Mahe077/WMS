"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TIME_SLOTS } from "@/lib/types"
import { Dock, DockBooking } from "../../types/dock.types"
import { DockBookingCategory, DockBookingPriority, DockStatus, TemperatureControl, VehicleType } from "@/lib/enum"
import React, { useEffect, useState } from "react"
import { useNotifications } from "@/contexts/app-context"
import { Selector } from "@/components/ui/selector"
import { FormDialog } from "@/components/common/form-dialog"
import { VEHICLE_DURATIONS } from "@/lib/archive-types"

interface MobileDockSchedulingFormProps {
  existingBooking?: DockBooking | null
  docks: Dock[]
  selectedDate: string
  onSubmit: (booking: DockBooking) => void
  onCancel: () => void
}

export function MobileDockSchedulingForm({ existingBooking, docks, selectedDate, onSubmit, onCancel }: MobileDockSchedulingFormProps) {
  const { addNotification } = useNotifications()
  const [formData, setFormData] = useState<DockBooking>(
    existingBooking || {
      id: "",
      dockId: "",
      startTime: "",
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
        date: selectedDate,
      }))
    }
  }, [existingBooking, selectedDate])

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

  return (
    <FormDialog
      open={true}
      onClose={onCancel}
      title={existingBooking ? "Edit Booking" : "New Dock Booking"}
      description={new Date(selectedDate).toLocaleDateString()}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dockId">Dock</Label>
              <Selector
                key="dockId"
                placeholder="Select dock"
                options={docks
                  .filter((d) => d.status === DockStatus.Active)
                  .map((d) => ({
                    value: d.id,
                    label: `${d.name} (${d.type})`,
                  }))}
                value={formData.dockId}
                onChange={(value) =>
                  handleSelectChange("dockId", value)
                }
                widthClass="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={formData.date} onChange={handleChange} readOnly className="text-sm" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Time Slot</Label>
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
                  handleSelectChange("startTime", value)
                }
                widthClass="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                min="15"
                step="15"
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier</Label>
              <Input id="carrier" value={formData.carrier} onChange={handleChange} className="text-sm" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity">Activity</Label>
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
                  <Input id="poNumber" value={formData.poNumber} onChange={handleChange} className="text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipmentID" >
                    Shipment ID
                  </Label>
                  <Input id="shipmentID" value={formData.shipmentId} onChange={handleChange} className="text-sm" />
                </div>
              </React.Fragment>
            )}

            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
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
              <Label htmlFor="temperatureControl">Temp Control</Label>
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
              <Label htmlFor="priority">Priority</Label>
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
              <Label htmlFor="estimatedPallets">Est. Pallets</Label>
              <Input id="estimatedPallets" type="number" value={formData.estimatedPallets} onChange={handleChange} min="0" className="text-sm" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="truckNumber" >
                Truck Number
              </Label>
              <Input id="truckNumber" value={formData.truck} onChange={handleChange} className="text-sm" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="driver" >
                Driver Name
              </Label>
              <Input id="driver" value={formData.driver} onChange={handleChange} className="text-sm" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input id="contactPerson" value={formData.contactPerson} onChange={handleChange} className="text-sm" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="text-sm" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Additional notes..."
              rows={3}
              className="text-sm"
            />
          </div>
        </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {existingBooking ? "Update Booking" : "Create Booking"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
      </form>
    </FormDialog>
  )
}