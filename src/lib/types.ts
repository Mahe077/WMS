import {
  DockBookingActivity,
  DockType,
  DockStatus,
  AlertType,
  VehicleType,
  InventoryItemStatus,
  TemperatureControl,
  DockBookingPriority,
  PickListItemStages,
  OrderStatus
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
  id?: string
  dockId: string
  startTime: string
  endTime: string
  timeSlot?: string
  date: string
  activity?: DockBookingActivity | null
  customer?: string
  poNumber?: string
  shipmentId?: string
  duration: number
  notes?: string
  carrier?: string
  bookingRef: string
  vehicleType?: VehicleType | null
  temperatureControl?: TemperatureControl | null //if the docks can be different types, otherwise null
  status: DockStatus //if the docks can be different types, otherwise null
  eta?: string //estimated time of arrival
  priority?: DockBookingPriority//priority of the
  estimatedPallets?: number //estimated number of pallets for the booking
  contactPerson?: string //contact person for the booking
  phoneNumber?: string //phone number for the contact person
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
  changeDescription?: string //optional, used for cases like "N/A" or when no change is applicable
  description?: string
  icon: React.ElementType
  color: string
  valueColor?: string //optional, used to override the default value color
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

// For search and filter functionality
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text';
  options?: FilterOption[];
  placeholder?: string;
  width?: string;
  multiple?: boolean;
}

export interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters: Record<string, unknown>;
  onFilterChange: (key: string, value: unknown) => void;
  onClearFilters: () => void;
  filterConfigs: FilterConfig[];
  showClearButton?: boolean;
  className?: string;
}

// remove later
export const VEHICLE_DURATIONS = {
  van: 30,
  truck: 60,
  container: 90,
  trailer: 120,
}

export const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => {
  const hour = i + 6 // Start from 6 AM
  return `${hour.toString().padStart(2, "0")}:00`
})


// order fulfillment types
export type Order = {
  id: string
  customerId?: string
  orderNumber: string
  orderDate: string
  status: OrderStatus
  priority: string
  items: number
  dueDate: string
  carrier: string
  trackingNumber?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
  customFields?: Record<string, unknown>
}

export type OrderItem = {
  id: string
  orderId: string
  productId: string
  quantity: number
  status: string
  location?: string // storage location in the warehouse
  lotNumber?: string // for traceability
  serialNumber?: string // if applicable
}

export type OrderFormData = {
  customer: string
  orderNumber: string
  orderDate: string
  status: string
  priority: string
  items: OrderItem[]
  dueDate: string
  carrier: string
  trackingNumber?: string
  notes?: string
}

export type PickListItem = {
  sku: string
  description: string
  lot: string
  qtyOrdered: number
  qtyPicked: number
  location: string
  status: PickListItemStages
}
export type PickList = {
  id: string
  orderId: string
  items: PickListItem[]
  totalItems: number
  totalPicked: number
  status: PickListItemStages
  createdAt: string
  updatedAt?: string
  notes?: string
}

export type Customer = {
  id: string
  name: string
  email: string
  phone?: string
  locations : CustomerLocation[]
  billingAddress?: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  notes?: string
  customFields?: Record<string, unknown>
  orderHistory?: Order[] // optional, for customer order history
  orderConfig?: {
    defaultCarrier?: string
    defaultPriority?: string
    defaultPaymentTerms?: string
    fulfillmentType?: string // e.g., "fifo", "fefo", "lifo"
    defaultPackagingType?: string // e.g., "standard", "custom"
    defaultWarehouse?: string // e.g., "main", "secondary"
    defaultInventoryLocation?: string // e.g., "warehouse1", "warehouse2"
    defaultInventoryStatus?: InventoryItemStatus // e.g., "available", "reserved", "damaged"
    defaultShippingMethod?: string // e.g., "standard", "express"
    defaultPackaging?: string // e.g., "box", "pallet"
  }
}

export type CustomerLocation = {
  id: string
  customerId: string
  address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  contactPerson?: string
  phoneNumber?: string
  email?: string
  notes?: string
}