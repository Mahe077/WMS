export const users = [
  {
    id: "usr-001",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    permissions: ["all"],
  },
  {
    id: "usr-002",
    name: "Warehouse Manager",
    email: "manager@example.com",
    password: "manager123",
    role: "manager",
    permissions: [
      "inventory.view",
      "inventory.edit",
      "order-fulfillment.view",
      "order-fulfillment.edit",
      "receiving.view",
      "receiving.edit",
      "dispatch.view",
      "dispatch.edit",
      "reports.view",
    ],
    assignedWarehouseIds: ["WH001", "WH002"], // Example warehouse assignments
  },
  {
    id: "usr-003",
    name: "Receiving Staff",
    email: "receiving@example.com",
    password: "receiving123",
    role: "staff",
    permissions: ["inventory.view", "receiving.view", "receiving.edit"],
    assignedWarehouseIds: ["WH001"], // Example warehouse assignments
  },
  {
    id: "usr-004",
    name: "Dispatch Staff",
    email: "dispatch@example.com",
    password: "dispatch123",
    role: "staff",
    permissions: ["inventory.view", "order-fulfillment.view", "dispatch.view", "dispatch.edit"],
    assignedWarehouseIds: ["WH005"], // Example warehouse assignments
  },
]