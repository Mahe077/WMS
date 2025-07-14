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
  },
  {
    id: "usr-003",
    name: "Receiving Staff",
    email: "receiving@example.com",
    password: "receiving123",
    role: "staff",
    permissions: ["inventory.view", "receiving.view", "receiving.edit"],
  },
  {
    id: "usr-004",
    name: "Dispatch Staff",
    email: "dispatch@example.com",
    password: "dispatch123",
    role: "staff",
    permissions: ["inventory.view", "order-fulfillment.view", "dispatch.view", "dispatch.edit"],
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
    // For this demo, we'll extract the user ID from the mock token
    const token = authHeader.split("-")[1];
    const userId = token;

    console.log("Validating token for user ID:", userId, " with token: ", token);

    const user = users.find((u) => u.role === userId);
    console.log("Validating token for user:", userId, user);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid token or user not found" },
        { status: 401 }
      );
    }

    const { ...userWithoutPassword } = user;
    
    return NextResponse.json({
      user: userWithoutPassword,
      token: `mock-${user.role}-token`, // Mock token
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
