import { VehicleType } from "../enum"

export const VEHICLE_DURATIONS: Record<VehicleType, number> = {
  [VehicleType.Van]: 30,
  [VehicleType.Truck]: 45,
  [VehicleType.Container]: 90,
  [VehicleType.Trailer]: 120,
  [VehicleType.Railcar]: 180,
  [VehicleType.AirFreight]: 60,
}

export const TIME_SLOTS = Array.from({ length: 32 }, (_, i) => {
  const totalMinutes = i * 45
  const hour = Math.floor(totalMinutes / 60)
  const minute = totalMinutes % 60
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
})

export const PER_PAGE_OPTIONS = [10, 20, 50, 100];