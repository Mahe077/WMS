import { InventoryItemStatus } from "../enum"

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


export type InventoryItemFormData = {
  sku: string
}

// For single stock item view
export type InventoryItemWithMaster = {
  master: MasterItem
  stock: InventoryStock
}
