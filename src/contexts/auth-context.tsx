"use client"

import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useNotifications } from "@/contexts/app-context"
import { loginApi, validateTokenApi } from "@/lib/api/auth";
import { can as canCheck, hasRole as hasRoleCheck } from "@/lib/auth/permissions";

// Types
export interface User {
  id: string
  name: string
  email: string
  role: string
  permissions: string[]
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  error: string | null
  lastActivity?: number | null
}

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "AUTH_FAILURE"; payload: { error: string } }
  | { type: "LOGOUT"; payload?: { reason?: string } }
  | { type: "REFRESH_TOKEN"; payload: { token: string } }
  | { type: "UPDATE_ACTIVITY" }
  | { type: "CLEAR_ERROR" }

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  token: null,
  error: null,
  lastActivity: null,
}

// Configuration
const AUTH_CONFIG = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  TOKEN_REFRESH_INTERVAL: 15 * 60 * 1000, // 15 minutes
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const

// Safe localStorage wrapper
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value)
    } catch {
      // Silently fail
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch {
      // Silently fail
    }
  },
}

// Reducer function
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true, error: null }
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
        lastActivity: Date.now(),
      }
    case "AUTH_FAILURE":
      return { 
        ...state, 
        isLoading: false, 
        isAuthenticated: false, 
        user: null, 
        token: null,
        error: action.payload.error 
      }
    case "LOGOUT":
      return { 
        ...initialState,
        error: action.payload?.reason ? `Logged out: ${action.payload.reason}` : null 
      }
    case "REFRESH_TOKEN":
      return { ...state, token: action.payload.token, lastActivity: Date.now() }
    case "UPDATE_ACTIVITY":
      return { ...state, lastActivity: Date.now() }
    case "CLEAR_ERROR":
      return { ...state, error: null }
    default:
      return state
  }
}

// Create context
export interface AuthContextType {
  state: AuthState
  login: (email: string, password: string) => Promise<void>
  logout: (reason?: string) => void
  refreshToken: () => Promise<void>
  can: (permission: string) => boolean
  hasRole: (role: string | string[]) => boolean
  clearError: () => void
  updateActivity: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const router = useRouter()
  const { addNotification } = useNotifications()
  const [initialized, setInitialized] = useState(false)

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = safeStorage.getItem("wms_token")
      if (token) {
        try {
          // In a real app, validate the token with your backend
          const response = await validateTokenApi(token);

          if (response.ok) {
            const data = await response.json()
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: { user: data.user, token },
            })
          } else {
            safeStorage.removeItem("wms_token")
          }
        } catch {
          safeStorage.removeItem("wms_token")

          dispatch({
            type: "AUTH_FAILURE",
            payload: { error: "Invalid or expired token" },
          })
        }
      }
      setInitialized(true)
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    dispatch({ type: "AUTH_START" })

    try {
      const response = await loginApi(email, password);

      const data = await response
      const { user, token } = data

      // Store token in localStorage
      safeStorage.setItem("wms_token", token)

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, token },
      })

      addNotification({
        type: "success",
        message: `Welcome back, ${user.name}!`,
      })

      router.push("/")
    } catch (error) {
      dispatch({ 
        type: "AUTH_FAILURE", 
        payload: { error: error instanceof Error ? error.message : "Login failed. Please try again." } 
      })
      addNotification({
        type: "error",
        message: error instanceof Error ? error.message : "Login failed. Please try again.",
      })
    }
  }

  // Logout function
  const logout = () => {
    safeStorage.removeItem("wms_token")
    dispatch({ type: "LOGOUT" })
    addNotification({
      type: "info",
      message: "You have been logged out.",
    })
    router.push("/login")
  }

  // Permission check function
  const can = (permission: string) => canCheck(state.user, permission);

  // Role check function
  const hasRole = (role: string | string[]) => hasRoleCheck(state.user, role);

  // Don't render children until we've checked for an existing token
  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Refresh token function (stub implementation)
  const refreshToken = async () => {
    // In a real app, call your API to refresh the token and update state
    // For now, just dispatch REFRESH_TOKEN with the current token
    if (state.token) {
      dispatch({ type: "REFRESH_TOKEN", payload: { token: state.token } })
    }
  }

  // Clear error function
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  // Update activity function
  const updateActivity = () => {
    dispatch({ type: "UPDATE_ACTIVITY" })
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        refreshToken,
        can,
        hasRole,
        clearError,
        updateActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { AuthContext, AUTH_CONFIG }
