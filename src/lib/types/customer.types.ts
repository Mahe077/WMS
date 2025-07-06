import { InventoryItemStatus } from '../enum';
import { Order } from '../archive-types';

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
    defaultInventoryStatus?: InventoryItemStatus// e.g., "available", "reserved", "damaged"
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