import { NextResponse } from "next/server"

// Mock user database
const users = [
  {
    id: "usr-001",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123", // In a real app, this would be hashed
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

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Find user by email
    const user = users.find((u) => u.email === email)

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Create a user object without the password
    const { ...userWithoutPassword } = user

    // Generate a mock token (in a real app, use JWT or similar)
    const token = user.id

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      message: "Login successful",
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
