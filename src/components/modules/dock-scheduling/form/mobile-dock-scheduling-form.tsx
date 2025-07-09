import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dock, DockBooking, TIME_SLOTS, VEHICLE_DURATIONS } from "@/lib/types";
import {
  DockBookingPriority,
  DockStatus,
  TemperatureControl,
  VehicleType,
} from "@/lib/enum";
import { Textarea } from "../../../ui/textarea";
import { Selector } from "@/components/ui/selector";
import { FormDialog } from "@/components/common/form-dialog";

export function MobileDockSchedulingForm({
  existingBooking,
  docks,
  selectedDate,
  onSubmit,
  onCancel,
}: {
  existingBooking?: DockBooking | null;
  docks: Dock[];
  selectedDate: string;
  onSubmit: (data: DockBooking) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    dockId: existingBooking?.dockId || "",
    startTime: existingBooking?.startTime || "09:00",
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
    const startMinutes =
      Number(formData.startTime.split(":")[0]) * 60 +
      Number(formData.startTime.split(":")[1]);
    const endMinutes = startMinutes + Number(formData.duration);
    const endTime = `${Math.floor(endMinutes / 60)
      .toString()
      .padStart(2, "0")}:${(endMinutes % 60).toString().padStart(2, "0")}`;

    onSubmit({
      ...formData,
      id: existingBooking?.id,
      duration: Number(formData.duration),
      estimatedPallets: formData.estimatedPallets
        ? Number(formData.estimatedPallets)
        : undefined,
      endTime,
      date: selectedDate,
    });
  };

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
                  setFormData({ ...formData, dockId: value })
                }
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
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="duration">Duration (min)</Label>
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
                className="text-sm"
              />
            </div>
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
              className="text-sm"
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
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperatureControl">Temperature</Label>
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
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                placeholder="+1-555-0123"
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedPallets">Pallets</Label>
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
                className="text-sm"
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
  );
}
