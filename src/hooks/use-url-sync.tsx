"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useApp } from "@/contexts/app-context"

// Module to URL mapping
const MODULE_ROUTES: Record<string, string> = {
  dashboard: "/",
  receiving: "/?module=receiving",
  inventory: "/?module=inventory",
  "pallet-view": "/?module=pallet-view",
  "bay-booking": "/?module=bay-booking",
  "dock-scheduling": "/?module=dock-scheduling",
  "3d-view": "/?module=3d-view",
  orders: "/?module=orders",
  dispatch: "/?module=dispatch",
  returns: "/?module=returns",
  reports: "/?module=reports",
  users: "/?module=users",
}

// URL to module mapping
// const URL_MODULES: Record<string, string> = Object.fromEntries(
//   Object.entries(MODULE_ROUTES).map(([module, url]) => [url, module]),
// )

export function useUrlSync() {
  const { state, dispatch } = useApp()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Sync URL to state on mount and URL changes
  useEffect(() => {
    const moduleParam = searchParams.get("module")
    const targetModule = moduleParam || "dashboard"

    // Only update state if it differs from URL
    if (state.activeModule !== targetModule) {
      dispatch({ type: "SET_ACTIVE_MODULE", payload: targetModule })
    }
  }, [searchParams, dispatch, state.activeModule])

  // Sync state to URL when activeModule changes
  useEffect(() => {
    const currentUrl = window.location.pathname + window.location.search
    const expectedUrl = MODULE_ROUTES[state.activeModule] || "/"

    // Only update URL if it differs from state
    if (currentUrl !== expectedUrl) {
      // Use replace to avoid adding to browser history for every state change
      router.replace(expectedUrl, { scroll: false })
    }
  }, [state.activeModule, router])

  return {
    currentModule: state.activeModule,
    navigateToModule: (moduleId: string) => {
      dispatch({ type: "SET_ACTIVE_MODULE", payload: moduleId })
    },
  }
}
