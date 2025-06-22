"use client"

import React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useNotifications } from "@/contexts/app-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: string
  requiredRole?: string | string[]
}

export function ProtectedRoute({ children, requiredPermission, requiredRole }: ProtectedRouteProps) {
  const { state, can, hasRole } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { addNotification } = useNotifications()

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/login") return

    // Check authentication
    if (!state.isAuthenticated) {
      router.push("/login")
      return
    }

    // Check permission if specified
    if (requiredPermission && !can(requiredPermission)) {
      addNotification({
        type: "error",
        message: "You don't have permission to access this resource.",
      })
      router.push("/")
      return
    }

    // Check role if specified
    if (requiredRole && !hasRole(requiredRole)) {
      addNotification({
        type: "error",
        message: "This area requires higher access level.",
      })
      router.push("/")
      return
    }
  }, [state.isAuthenticated, requiredPermission, requiredRole, can, hasRole, router, pathname, addNotification])

  // If we're checking permissions and not authenticated yet, show loading
  if ((requiredPermission || requiredRole) && !state.isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <React.Fragment>{children}</React.Fragment>
}
