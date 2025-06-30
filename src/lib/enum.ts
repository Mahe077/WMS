//lets deine the enum for the different types of errors we can have
export enum ErrorType {
  NotFound = 'NotFound',
  Unauthorized = 'Unauthorized',
  BadRequest = 'BadRequest',
  InternalServerError = 'InternalServerError',
  Forbidden = 'Forbidden',
  Conflict = 'Conflict',
  UnprocessableEntity = 'UnprocessableEntity',
  ServiceUnavailable = 'ServiceUnavailable',
}

export const All = "All" as const

// Define the enum for different alert types
export enum AlertType {
    Info = 'info',
    Success = 'success',
    Warning = 'warning',
    Error = 'error',
}

// Define the enum for different booking activities
export enum DockBookingActivity {
  Receiving = 'receiving',
  Dispatch = 'dispatch',
  Blocked = 'blocked',
}

// Define the enum for different bay types
export enum DockType {
  Receiving = 'receiving',
  Dispatch = 'dispatch',
}

// Define the enum for different bay statuses
export enum DockStatus {
  Active = 'active',
  Maintenance = 'maintenance',
  Blocked = 'blocked',
  Scheduled = 'scheduled',
  Arrived = 'arrived',
  Loading = 'loading',
  Completed = 'completed',
  NoShow = 'no-show',
  Delayed = 'delayed',
  Cancelled = 'cancelled',
}

// Define the enum for different booking types
export enum DockBookingType {
  Receiving = 'receiving',
  Dispatch = 'dispatch',
}

// Define the enum for different booking slot statuses
export enum DockBookingSlotStatus {
  Available = 'available',
  Booked = 'booked',
  Blocked = 'blocked',
}

// Define the enum for different booking slot types
export enum DockBookingSlotType {
  Receiving = 'receiving',
  Dispatch = 'dispatch',
  Blocked = 'blocked',
}

export enum DockBookingPriority {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
}

// Define vehicle types
export enum VehicleType {
  Truck = 'truck',
  Van = 'van',
  Trailer = 'trailer',
  Container = 'container',
}

// Define the enum for bay status
export enum BayStatus {
  Active = 'active',
  Maintenance = 'maintenance',
  Blocked = 'blocked',
}

// Define the enum for bay types
export enum BayType {
  Active = 'active',
  Reserve = 'reserve',
}

// Define the enum for inventory item statuses
export enum InventoryItemStatus {
    Available = 'available',
    OutOfStock = 'out_of_stock',
    Discontinued = 'discontinued',
    Archived = 'archived',
    Blocked = 'blocked',
    QCHold = 'qc_hold',
}

//Define the enum for temperature control types
export enum TemperatureControl {
    Ambient = 'ambient',
    Chilled = 'chilled',
    Frozen = 'frozen',
}

export enum ActionStatus {
    Pending = 'Pending',
    InProgress = 'In progress',
    Completed = 'Completed',
    Failed = 'Failed',
    Cancelled = 'Cancelled',
}

export enum PickListItemStages {
    Partial = 'Partial',
    Completed = 'Completed',
    Pending = 'Pending',
}

export enum OrderStatus {
    Pending = 'Pending',
    Picking = 'Picking',
    Packed = 'Packed',
    Shipping = 'In progress',
    Completed = 'Completed',
    Cancelled = 'Cancelled',
    OnHold = 'On hold',
}