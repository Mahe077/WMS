import { users } from "@/lib/sample-data/users"
import { NextResponse } from "next/server"

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
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user

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
