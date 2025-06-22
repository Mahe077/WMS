import {
  DockBookingActivity,
  DockType,
  DockStatus,
  AlertType,
  VehicleType,
  InventoryItemStatus
} from "./enum"

//null means all the given types are allowed
export type DockBookingSlot = {
  bayId: string
  timeSlot: string
  date: string
  activity: DockBookingActivity | null
  customer?: string
  poNumber?: string
  shipmentId?: string
  duration: number
  notes?: string
}

export type DockBooking = {
  id: string
  bayId: string
  startTime: string
  endTime: string
  timeSlot: string
  date: string
  activity?: DockBookingActivity | null
  customer?: string
  poNumber?: string
  shipmentId?: string
  duration: number
  notes?: string
  carrier?: string
}

// This type is used for the form data when creating or updating a dock booking
export type DockBookingFormData = {
  activity: string
  customer: string
  poNumber: string
  shipmentId: string
  duration: string
  notes: string,
  type?: DockBookingActivity | null
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

export type Stat = {
  title: string
  value: number
  change: string
  description?: string
  icon: React.ElementType
  color: string
}

export type Alert = {
  type: AlertType
  message: string
  duration?: string //TODO: make this a number or date type
  time?: string
}

// Master Data - Static product information
export type MasterItem = {
  id: string
  sku: string
  name: string
  description?: string
  category?: string
  uom: string
  unitPrice?: number
  imageUrl?: string
  barcode?: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  supplierId?: number
  tags?: string[]
  customAttributes?: Record<string, unknown>
}

// Inventory Data - Dynamic stock and location information
export type InventoryStock = {
  id: string
  masterItemId: string // Reference to MasterItem
  lotNumber?: string
  batchNumber?: string
  serialNumber?: string
  bbd: Date
  totalQty: number
  qtyOnHand: {
    available: number
    reserved: number
    damaged: number
    inTransit: number
  }
  // Pallet and location management
  activeBay: {
    location: string
    palletId?: string
    qtyOnPallet: number
    maxPalletCapacity?: number
  }
  reserve: {
    location: string
    pallets: Array<{
      palletId: string
      qtyOnPallet: number
      location?: string // specific reserve location if different
    }>
    totalQtyInReserve: number
  }
  location: string // primary/default location
  status?: InventoryItemStatus
  lastUpdated: string
  notes?: string
  warranty?: {
    startDate: string
    endDate: string
  }
  locationDetails?: {
    aisle: string
    shelf: string
    bin: string
  }
  customFields?: Record<string, unknown>
}

// Combined view for when you need both master and inventory data
export type InventoryItemView = MasterItem & {
  inventory: InventoryStock[]
}

// For single stock item view
export type InventoryItemWithMaster = {
  master: MasterItem
  stock: InventoryStock
}

export type InventoryItemFormData = {
  sku: string
}