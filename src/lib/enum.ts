// Define the enum for Permission Types
// This enum can be used to manage user permissions in the application
// Each permission type corresponds to a specific action that can be performed on a resource
// For example, 'View' allows users to view resources, 'Create' allows them to create new resources, and so on
// This can be used in conjunction with user roles to control access to different features or data in the WMS application
export enum  PermissionType {
  View = '1',
  Create = '2',
  Update = '3',
  Delete = '4',
}

// Define the enum fot the features available in the WMS
// This enum can be used to manage feature flags or permissions in the application
export enum Features {
  Dashboard = 'Dashboard',
  Receiving = 'Receiving',
  Dispatch = 'Dispatch',
  Inventory = 'Inventory',
  Orders = 'Orders',
  Shipments = 'Shipments',
  Returns = 'Returns',
  DockManagement = 'DockManagement',
  Reporting = 'Reporting',
  UserManagement = 'UserManagement',
  Settings = 'Settings',
  Integrations = 'Integrations',
  Analytics = 'Analytics',
  QualityControl = 'QualityControl',
  WarehouseLayout = 'WarehouseLayout',
  TaskManagement = 'TaskManagement',
  Notifications = 'Notifications',
  MobileApp = 'MobileApp',
  AuditLogs = 'AuditLogs',
  CustomFields = 'CustomFields',
  BarcodeScanning = 'BarcodeScanning',
}

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
  Timeout = 'Timeout', // common in WMS integrations or async tasks
  ValidationError = 'ValidationError', // specific client input validation error
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
// export enum DockBookingActivity {
//   Receiving = 'Receiving',
//   Dispatch = 'Dispatch',
//   Blocked = 'Blocked',
// }

// Define the enum for different bay types
export enum DockType {
  Rear = 'Rear',
  Side = 'Side',
}

// Define the enum for different bay statuses
export enum DockStatus {
  Active = 'Active',
  Maintenance = 'Maintenance',
  Blocked = 'Blocked',
  Scheduled = 'Scheduled',
  Arrived = 'Arrived',
  Loading = 'Loading',
  Completed = 'Completed',
  NoShow = 'No Show',
  Delayed = 'Delayed',
  Cancelled = 'Cancelled',
  InUse = 'In Use',
}

// Define the enum for different booking types
// export enum DockBookingType {
//   Receiving = 'Receiving',
//   Dispatch = 'Dispatch',
// }

// Define the enum for different booking slot statuses
export enum DockBookingSlotStatus {
  Available = 'Available',
  Booked = 'Booked',
  Blocked = 'Blocked',
  Reserved = 'Reserved', // if you support holding slot before final booking
  Expired = 'Expired', // if time window passed without arriva
}

// Define the enum for different booking slot types
export enum DockBookingCategory {
  Receiving = 'Receiving',
  Dispatch = 'Dispatch',
  Blocked = 'Blocked',
}

export enum DockBookingPriority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

// Define vehicle types
export enum VehicleType {
  Truck = 'Truck',
  Van = 'Van',
  Trailer = 'Trailer',
  Container = 'Container',
  Railcar = 'Eailcar',
  AirFreight = 'Air Freight',
}

// Define the enum for bay status
export enum BayStatus {
  Active = 'Active',
  Maintenance = 'Maintenance',
  Blocked = 'Blocked',
}

// Define the enum for bay types
export enum BayType {
  Active = 'Active',
  Reserve = 'Reserve',
  Staging = 'Staging',
  Overflow = 'Overflow',
  Blocked = 'Blocked',
  Maintenance = 'Maintenance',
}

// Define the enum for inventory item statuses
export enum InventoryItemStatus {
    Available = 'Available',
    OutOfStock = 'Out Of Stock',
    Discontinued = 'Discontinued',
    Archived = 'Archived',
    Blocked = 'Blocked',
    QCHold = 'QC Hold',
    Damaged = 'Damaged',
    Returned = 'Returned', // for customer return process
    Reserved = 'Reserved', // reserved for orders
    OnHold = 'On Hold', // general hold state
}

//Define the enum for temperature control types
export enum TemperatureControl {
    Ambient = 'Ambient',
    Chilled = 'Chilled',
    Frozen = 'Frozen',
}

export enum ActionStatus {
    Pending = 'Pending',
    InProgress = 'In progress',
    Completed = 'Completed',
    Failed = 'Failed',
    Cancelled = 'Cancelled',
    OnHold = 'On Hold', // may be useful too
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
    Returned = 'Returned', // for reverse logistics
    PartiallyShipped = 'Partially shipped',
    AwaitingQC = 'Awaiting QC', // pre-shipment check
}

export enum PalletType {
  Standard = 'standard',
  Euro = 'euro',
  Custom = 'custom',
}

export enum StorageLocationType {
  Bin = 'bin',
  Shelf = 'shelf',
  Floor = 'floor',
  PalletRack = 'pallet_rack',
  ColdRoom = 'cold_room',
}

export enum QCStatus {
  Passed = 'passed',
  Failed = 'failed',
  Pending = 'pending',
  RetestRequired = 'retest_required',
}

export enum UnitOfMeasure {
  Each = 'each',
  Case = 'case',
  Pallet = 'pallet',
  Kg = 'kg',
  Litre = 'litre',
}

export enum ReportStatus {
  Completed = "Completed",
  Processing = "Processing",
  Failed = "Failed"
}