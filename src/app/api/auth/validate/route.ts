import { NextResponse } from "next/server"

// Mock user database (same as in login route)
const users = [
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
      "view:inventory",
      "edit:inventory",
      "view:orders",
      "edit:orders",
      "view:receiving",
      "edit:receiving",
      "view:dispatch",
      "edit:dispatch",
      "view:reports",
    ],
  },
  {
    id: "usr-003",
    name: "Receiving Staff",
    email: "receiving@example.com",
    password: "receiving123",
    role: "staff",
    permissions: ["view:inventory", "view:receiving", "edit:receiving"],
  },
  {
    id: "usr-004",
    name: "Dispatch Staff",
    email: "dispatch@example.com",
    password: "dispatch123",
    role: "staff",
    permissions: ["view:inventory", "view:orders", "view:dispatch", "edit:dispatch"],
  },
]

export async function GET(request: Request) {
  try {
    // In a real app, you would validate the token properly
    // For this demo, we'll just check if the Authorization header exists
    // and return a mock user
    
    const authHeader = request.headers.get("Authorization")
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // In a real app, you would decode the token and find the user
    // For this demo, we'll just return the admin user
    const { ...userWithoutPassword } = users[0]
    
    return NextResponse.json({
      user: userWithoutPassword,
      message: "Token is valid",
    })
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An error occurred during token validation";
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    )
  }
}
