import { DockBookingPriority, OrderStatus, PickListItemStages } from '../enum';

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
  status: OrderStatus
  priority: DockBookingPriority
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
