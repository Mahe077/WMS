import { DockBookingCategory, DockBookingPriority, DockStatus, DockType, TemperatureControl, VehicleType } from "@/lib/enum"

export type DockBookingSlot = {
  bayId: string
  timeSlot: string
  date: string
  activity: DockBookingCategory | null
  customer?: string
  poNumber?: string
  shipmentId?: string
  duration: number
  notes?: string
}

export type DockBooking = {
  id?: string
  dockId: string
  startTime: string
  endTime: string
  timeSlot?: string
  date: string
  activity: DockBookingCategory | null
  customer?: string
  poNumber?: string
  shipmentId?: string
  duration: number
  notes?: string
  carrier?: string //it is the shipping company?
  truck?: string //truck number or identifier
  driver?: string //driver name or identifier
  bookingRef: string
  vehicleType?: VehicleType | null
  temperatureControl?: TemperatureControl | null //if the docks can be different types, otherwise null
  status: DockStatus //if the docks can be different types, otherwise null
  eta?: string //estimated time of arrival
  priority?: DockBookingPriority//priority of the
  estimatedPallets: number //estimated number of pallets for the booking
  contactPerson?: string //contact person for the booking
  phoneNumber?: string //phone number for the contact person
}

export type Dock = {
  id: string
  name: string
  type?: DockType | null //if the docks can be different types, otherwise null
  status: DockStatus
  maxVehicleSize?: VehicleType | null
  temperatureZones?: string[]
  equipment?: string[]
}

// This type is used for the form data when creating or updating a dock booking
export type DockBookingFormData = {
  activity: DockBookingCategory | null
  customer: string
  poNumber: string
  shipmentId: string
  duration: string
  notes: string
}
