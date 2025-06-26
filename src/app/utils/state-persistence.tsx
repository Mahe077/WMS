"use client"

// State persistence utilities
export interface PersistedState {
  activeModule: string
  pagination: Record<string, unknown>
  filters: Record<string, unknown>
  searchTerms: Record<string, string>
  timestamp: number
}

const STATE_KEY = "wms_app_state"
const STATE_VERSION = "1.0"
const MAX_AGE = 24 * 60 * 60 * 1000 // 24 hours

export function saveAppState(state: Partial<PersistedState>): void {
  if (typeof window === "undefined") return

  try {
    const stateToSave: PersistedState = {
      activeModule: state.activeModule || "dashboard",
      pagination: state.pagination || {},
      filters: state.filters || {},
      searchTerms: state.searchTerms || {},
      timestamp: Date.now(),
    }

    const serializedState = JSON.stringify({
      version: STATE_VERSION,
      data: stateToSave,
    })

    localStorage.setItem(STATE_KEY, serializedState)
  } catch (error) {
    console.warn("Failed to save app state:", error)
  }
}

export function loadAppState(): Partial<PersistedState> | null {
  if (typeof window === "undefined") return null

  try {
    const savedState = localStorage.getItem(STATE_KEY)
    if (!savedState) return null

    const parsed = JSON.parse(savedState)

    // Check version compatibility
    if (parsed.version !== STATE_VERSION) {
      console.warn("App state version mismatch, clearing saved state")
      localStorage.removeItem(STATE_KEY)
      return null
    }

    // Check if state is too old
    const age = Date.now() - (parsed.data.timestamp || 0)
    if (age > MAX_AGE) {
      console.warn("App state too old, clearing saved state")
      localStorage.removeItem(STATE_KEY)
      return null
    }

    return parsed.data
  } catch (error) {
    console.warn("Failed to load app state:", error)
    localStorage.removeItem(STATE_KEY)
    return null
  }
}

export function clearAppState(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STATE_KEY)
}

// Hook for debugging state persistence
export function useStatePersistenceDebug() {
  const debugState = () => {
    const state = loadAppState()
    console.log("Current persisted state:", state)
  }

  const clearState = () => {
    clearAppState()
    console.log("Cleared persisted state")
  }

  return { debugState, clearState }
}
