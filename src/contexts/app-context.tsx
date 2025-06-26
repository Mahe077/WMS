"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

// Types
interface User {
  id: string
  name: string
  email: string
  role: string
  permissions: string[]
}

interface PaginationState {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

interface AppState {
  user: User | null
  activeModule: string
  sidebarOpen: boolean
  loading: boolean
  notifications: Notification[]
  pagination: Record<string, PaginationState>
  filters: Record<string, unknown>
  searchTerms: Record<string, string>
}

interface Notification {
  id: string
  type: "success" | "error" | "warning" | "info"
  message: string
  timestamp: Date
}

type AppAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_ACTIVE_MODULE"; payload: string }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SIDEBAR_OPEN"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "ADD_NOTIFICATION"; payload: Omit<Notification, "id" | "timestamp"> }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "SET_PAGINATION"; payload: { module: string; pagination: PaginationState } }
  | { type: "SET_FILTER"; payload: { module: string; filter: unknown } }
  | { type: "SET_SEARCH_TERM"; payload: { module: string; term: string } }
  | { type: "CLEAR_FILTERS"; payload: string }

const initialState: AppState = {
  user: {
    id: "USR-001",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Admin",
    permissions: ["all"],
  },
  activeModule: "dashboard",
  sidebarOpen: false,
  loading: false,
  notifications: [],
  pagination: {},
  filters: {},
  searchTerms: {},
}


const getInitialState = (): AppState => {
  // Check if we're in the browser environment
  if (typeof window !== "undefined") {
    try {
      const savedState = localStorage.getItem("wms_app_state")
      if (savedState) {
        const parsed = JSON.parse(savedState)
        return {
          ...initialState,
          activeModule: parsed.activeModule || "dashboard",
          sidebarOpen: false, // Always start with sidebar closed on refresh
          pagination: parsed.pagination || {},
          filters: parsed.filters || {},
          searchTerms: parsed.searchTerms || {},
        }
      }
    } catch (error) {
      console.warn("Failed to load saved app state:", error)
    }
  }
  return initialState
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload }
    case "SET_ACTIVE_MODULE":
      return { ...state, activeModule: action.payload }
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen }
    case "SET_SIDEBAR_OPEN":
      return { ...state, sidebarOpen: action.payload }
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "ADD_NOTIFICATION":
      const newNotification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
      }
      return {
        ...state,
        notifications: [...state.notifications, newNotification],
      }
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      }
    case "SET_PAGINATION":
      return {
        ...state,
        pagination: {
          ...state.pagination,
          [action.payload.module]: action.payload.pagination,
        },
      }
    case "SET_FILTER":
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.module]: action.payload.filter,
        },
      }
    case "SET_SEARCH_TERM":
      return {
        ...state,
        searchTerms: {
          ...state.searchTerms,
          [action.payload.module]: action.payload.term,
        },
      }
    case "CLEAR_FILTERS":
      const newFilters = { ...state.filters }
      const newSearchTerms = { ...state.searchTerms }
      delete newFilters[action.payload]
      delete newSearchTerms[action.payload]
      return {
        ...state,
        filters: newFilters,
        searchTerms: newSearchTerms,
      }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, getInitialState())

  // Persist state changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stateToSave = {
          activeModule: state.activeModule,
          pagination: state.pagination,
          filters: state.filters,
          searchTerms: state.searchTerms,
        }
        localStorage.setItem("wms_app_state", JSON.stringify(stateToSave))
      } catch (error) {
        console.warn("Failed to save app state:", error)
      }
    }
  }, [state.activeModule, state.pagination, state.filters, state.searchTerms])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

// Custom hooks for specific functionality
export function useNotifications() {
  const { state, dispatch } = useApp()

  const addNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    dispatch({ type: "ADD_NOTIFICATION", payload: notification })

    // Auto-remove after 5 seconds
    setTimeout(() => {
      dispatch({ type: "REMOVE_NOTIFICATION", payload: Date.now().toString() })
    }, 5000)
  }

  const removeNotification = (id: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id })
  }

  return {
    notifications: state.notifications,
    addNotification,
    removeNotification,
  }
}

export function usePagination(module: string, totalItems: number, itemsPerPage = 10) {
  const { state, dispatch } = useApp()

  const pagination = state.pagination[module] || {
    currentPage: 1,
    itemsPerPage,
    totalItems,
    totalPages: Math.ceil(totalItems / itemsPerPage),
  }

  const setPagination = (newPagination: Partial<PaginationState>) => {
    const updatedPagination = {
      ...pagination,
      ...newPagination,
      totalPages: Math.ceil((newPagination.totalItems || totalItems) / (newPagination.itemsPerPage || itemsPerPage)),
    }
    dispatch({
      type: "SET_PAGINATION",
      payload: { module, pagination: updatedPagination },
    })
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination({ currentPage: page })
    }
  }

  const nextPage = () => goToPage(pagination.currentPage + 1)
  const prevPage = () => goToPage(pagination.currentPage - 1)

  const getPageItems = <T,>(items: T[]): T[] => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage
    const endIndex = startIndex + pagination.itemsPerPage
    return items.slice(startIndex, endIndex)
  }

  return {
    ...pagination,
    setPagination,
    goToPage,
    nextPage,
    prevPage,
    getPageItems,
    hasNextPage: pagination.currentPage < pagination.totalPages,
    hasPrevPage: pagination.currentPage > 1,
  }
}

export function useFilters(module: string) {
  const { state, dispatch } = useApp()

  const filters = state.filters[module] || {}
  const searchTerm = state.searchTerms[module] || ""

  const setFilter = (filter: unknown) => {
    dispatch({ type: "SET_FILTER", payload: { module, filter } })
  }

  const setSearchTerm = (term: string) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: { module, term } })
  }

  const clearFilters = () => {
    dispatch({ type: "CLEAR_FILTERS", payload: module })
  }

  return {
    filters,
    searchTerm,
    setFilter,
    setSearchTerm,
    clearFilters,
  }
}
