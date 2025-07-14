"use client"

import { createContext, useReducer, useEffect, useState, useCallback, type ReactNode } from "react"
import { validateTokenApi } from "@/features/auth/api";
import { can as canCheck, hasRole as hasRoleCheck } from "@/lib/auth/permissions";
import { User } from "@/features/auth/types";

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
  | { type: "PASSWORD_RESET_SUCCESS" }
  | { type: "PASSWORD_RESET_FAILURE"; payload: { error: string } }
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
    case "PASSWORD_RESET_SUCCESS":
      return {
        ...state,
        isLoading: false,
        error: null,
      }
    case "PASSWORD_RESET_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
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
  dispatch: React.Dispatch<AuthAction>
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
  const [initialized, setInitialized] = useState(false)

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      dispatch({ type: "AUTH_START" });
      const token = safeStorage.getItem("wms_token")
      if (token) {
        try {
          // In a real app, validate the token with your backend
          const response = await validateTokenApi(token);

          const { user, token: newToken } = response
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user, token: newToken },
          })
        } catch {
          safeStorage.removeItem("wms_token")

          dispatch({
            type: "AUTH_FAILURE",
            payload: { error: "Invalid or expired token" },
          })
        }
      } else {
        // No token found, so authentication fails immediately
        dispatch({
          type: "AUTH_FAILURE",
          payload: { error: "No authentication token found" },
        });
      }
      setInitialized(true);
    }

    checkAuth()
  }, [])

  // Permission check function
  const can = useCallback((permission: string) => canCheck(state.user, permission), [state.user]);

  // Role check function
  const hasRole = useCallback((role: string | string[]) => hasRoleCheck(state.user, role), [state.user]);

  // Refresh token function (stub implementation)
  const refreshToken = useCallback(async () => {
    // In a real app, call your API to refresh the token and update state
    // For now, just dispatch REFRESH_TOKEN with the current token
    if (state.token) {
      dispatch({ type: "REFRESH_TOKEN", payload: { token: state.token } })
    }
  }, [state.token, dispatch])

  // Clear error function
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  // Update activity function
  const updateActivity = () => {
    dispatch({ type: "UPDATE_ACTIVITY" })
  }

  // Effect for session timeout and token refresh
  useEffect(() => {
    let activityTimer: NodeJS.Timeout | undefined;
    let tokenRefreshInterval: NodeJS.Timeout | undefined;

    const resetActivityTimer = () => {
      if (activityTimer) clearTimeout(activityTimer);
      activityTimer = setTimeout(() => {
        if (state.isAuthenticated) {
          dispatch({ type: "LOGOUT", payload: { reason: "Session timed out due to inactivity." } });
          safeStorage.removeItem("wms_token");
        }
      }, AUTH_CONFIG.SESSION_TIMEOUT);
    };

    if (state.isAuthenticated) {
      // Initialize and reset activity timer on activity
      resetActivityTimer();
      window.addEventListener("mousemove", resetActivityTimer);
      window.addEventListener("keydown", resetActivityTimer);
      window.addEventListener("click", resetActivityTimer);

      // Set up token refresh interval
      tokenRefreshInterval = setInterval(() => {
        refreshToken();
      }, AUTH_CONFIG.TOKEN_REFRESH_INTERVAL);
    }

    return () => {
      if (activityTimer) clearTimeout(activityTimer);
      if (tokenRefreshInterval) clearInterval(tokenRefreshInterval);
      window.removeEventListener("mousemove", resetActivityTimer);
      window.removeEventListener("keydown", resetActivityTimer);
      window.removeEventListener("click", resetActivityTimer);
    };
  }, [state.isAuthenticated, state.lastActivity, refreshToken]); // Re-run when authentication status or last activity changes

    // Don't render children until we've checked for an existing token
  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
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

export { AuthContext, AUTH_CONFIG }
