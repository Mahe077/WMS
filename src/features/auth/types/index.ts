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

export type Permission = {
  id: string
  name: string
  description: string
}

export type Role = {
  id: string
  name: string
  description: string
  permissions: Permission[]
}

export type UserProfile = {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  permissions: string[]
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
}

export type UserPreferences = {
  theme: 'light' | 'dark' | 'system'
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  dashboardLayout: unknown; // Consider a more specific type
}

export type AuditLog = {
  id: string
  userId: string
  action: string
  timestamp: Date
  details: unknown; // Consider a more specific type
}

export type SessionInfo = {
  sessionId: string
  userId: string
  loginTime: Date
  lastActivity: Date
  ipAddress: string
  userAgent: string
}