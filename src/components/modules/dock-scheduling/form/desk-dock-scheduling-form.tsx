"use client";

import React, { useState } from "react";
import { FormDialog } from "@/components/common/form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  DockBookingPriority,
  DockStatus,
  TemperatureControl,
  VehicleType,
} from "@/lib/enum";
import { Dock, DockBooking, TIME_SLOTS, VEHICLE_DURATIONS } from "@/lib/types";
import { Selector } from "@/components/ui/selector";
// Desktop booking form modal
export function DesktopBookingFormModal({
  dock,
  timeSlot,
  selectedDate,
  existingBooking,
  docks,
  onSubmit,
  onCancel,
}: {
  dock?: Dock;
  timeSlot?: string | null;
  selectedDate: string;
  existingBooking?: DockBooking | null;
  docks: Dock[];
  onSubmit: (data: DockBooking) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    dockId: existingBooking?.dockId || dock?.id || docks[0]?.id,
    startTime: existingBooking?.startTime || timeSlot || "09:00",
    vehicleType: existingBooking?.vehicleType || VehicleType.Truck,
    duration: existingBooking?.duration || VEHICLE_DURATIONS.Truck,
    carrier: existingBooking?.carrier || "",
    bookingRef: existingBooking?.bookingRef || "",
    temperatureControl:
      existingBooking?.temperatureControl || TemperatureControl.Ambient,
    status: existingBooking?.status || DockStatus.Scheduled,
    priority: existingBooking?.priority || DockBookingPriority.Medium,
    contactPerson: existingBooking?.contactPerson || "",
    phoneNumber: existingBooking?.phoneNumber || "",
    estimatedPallets: existingBooking?.estimatedPallets || "",
    eta: existingBooking?.eta || "",
    notes: existingBooking?.notes || "",
    activity: existingBooking?.activity || null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dockId) {
      return;
    }
    // Calculate endTime based on startTime and duration
    const [startHour, startMinute] = formData.startTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = startMinutes + Number(formData.duration);
    const endTime = `${Math.floor(endMinutes / 60)
      .toString()
      .padStart(2, "0")}:${(endMinutes % 60).toString().padStart(2, "0")}`;

    onSubmit({
      ...formData,
      duration: Number(formData.duration),
      estimatedPallets: formData.estimatedPallets
        ? Number(formData.estimatedPallets)
        : undefined,
      endTime,
      date: selectedDate,
    });
  };

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
            <Label htmlFor="dockId-2">Dock</Label>
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
              onChange={(value) => setFormData({ ...formData, dockId: value })}
              widthClass="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
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
                setFormData({ ...formData, startTime: value })
              }
              widthClass="w-full"
              />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <Selector
              key={"vehicleType"}
              placeholder="Select vehicle type"
              options={Object.entries(VEHICLE_DURATIONS).map(([type, duration]) => ({
                value: type,
                label: `${type} (${duration} min)`,
              }))}
              value={formData.vehicleType}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  vehicleType: value as VehicleType,
                })
              }
              widthClass="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="15"
              max="480"
              step="15"
              value={formData.duration}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration: Number(e.target.value),
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="carrier">Carrier</Label>
            <Input
              id="carrier"
              value={formData.carrier}
              onChange={(e) =>
                setFormData({ ...formData, carrier: e.target.value })
              }
              placeholder="DHL Express"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bookingRef">Booking Reference</Label>
            <Input
              id="bookingRef"
              value={formData.bookingRef}
              onChange={(e) =>
                setFormData({ ...formData, bookingRef: e.target.value })
              }
              placeholder="DHL-2024-001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperatureControl">Temperature Control</Label>
            <Selector
              key={"temperatureControl"}
              placeholder="Select temperature"
              options={Object.values(TemperatureControl).map((temp) => ({
                value: temp,
                label: temp,
              }))}
              value={formData.temperatureControl}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  temperatureControl: value as TemperatureControl,
                })
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
              value={formData.priority}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  priority: value as DockBookingPriority,
                })
              }
              widthClass="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person</Label>
            <Input
              id="contactPerson"
              value={formData.contactPerson}
              onChange={(e) =>
                setFormData({ ...formData, contactPerson: e.target.value })
              }
              placeholder="John Smith"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              placeholder="+1-555-0123"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedPallets">Estimated Pallets</Label>
            <Input
              id="estimatedPallets"
              type="number"
              min="1"
              value={formData.estimatedPallets}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  estimatedPallets: e.target.value,
                })
              }
              placeholder="15"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eta">ETA (if different)</Label>
            <Input
              id="eta"
              value={formData.eta}
              onChange={(e) =>
                setFormData({ ...formData, eta: e.target.value })
              }
              placeholder= "HH:MM (e.g., 14:30)"
            />
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
            placeholder="Additional notes or special requirements..."
            rows={3}
          />
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
            {existingBooking ? "Update Booking" : "Create Booking"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </FormDialog>
  );
}
