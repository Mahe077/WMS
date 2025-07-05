"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
    duration: existingBooking?.duration || VEHICLE_DURATIONS.truck,
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 space-y-0">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>
            {existingBooking ? "Edit Booking" : "New Dock Booking"}
          </CardTitle>
          <CardDescription>
            {selectedDock && `${selectedDock.name} • ${formData.startTime}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dockId">Dock</Label>
                <Select
                  value={formData.dockId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, dockId: value })
                  }
                  required
                  name="dockId"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select dock" />
                  </SelectTrigger>
                  <SelectContent>
                    {docks
                      .filter((d) => d.status === "active")
                      .map((dock) => (
                        <SelectItem key={dock.id} value={dock.id}>
                          {dock.name} ({dock.type})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Select
                  value={formData.startTime}
                  onValueChange={(value) =>
                    setFormData({ ...formData, startTime: value })
                  }
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
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select
                  value={formData.vehicleType}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      vehicleType: value as VehicleType,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="van">Van (30 min)</SelectItem>
                    <SelectItem value="truck">Truck (60 min)</SelectItem>
                    <SelectItem value="container">
                      Container (90 min)
                    </SelectItem>
                    <SelectItem value="trailer">Trailer (120 min)</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select
                  value={formData.temperatureControl}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      temperatureControl: value as TemperatureControl,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="ambient">Ambient</SelectItem>
                    <SelectItem value="chilled">Chilled</SelectItem>
                    <SelectItem value="frozen">Frozen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      priority: value as DockBookingPriority,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
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
                      Temperature:{" "}
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
        </CardContent>
      </Card>
    </div>
  );
}
