export type User = {
  id: string
  name: string
  email: string
  role: string  // e.g., "admin", "user", "manager"
  status: string // e.g., "active", "inactive"
  permissions: string[] // optional, for role-based access control
  lastLogin?: string // optional, for tracking user activity
  createdAt?: string // optional, for tracking user creation date
  updatedAt?: string // optional, for tracking user updates
  customFields?: Record<string, unknown> // optional, for any additional user-specific data
}


export type Auth = {
  user: User
  token: string
}

export type LoginResponse = {
  user: User
  token: string
}

export type ForgotPasswordResponse = {
  message: string
}

export type ResetPasswordResponse = {
  message: string
}

export type ValidateTokenResponse = {
  user: User
  token: string
}

export type LogoutResponse = {
  message: string
}
