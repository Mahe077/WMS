"use client"

import React, { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useNotifications } from "@/contexts/app-context"
import { LoadingSpinner } from "../ui/loading-spinner"
import { useAuth } from "@/features/auth/hooks/useAuth"

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
  
  const [isChecking, setIsChecking] = useState(true)
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/login") {
      setIsChecking(false)
      setHasChecked(true)
      return
    }

    // Wait for auth state to be initialized
    if (state.isAuthenticated === null || state.isAuthenticated === undefined) {
      return // Keep showing loading until auth state is determined
    }

    const timer = setTimeout(() => { //TODO: remove this timeout in production
      if (!state.isAuthenticated) {
        router.push("/login")
        return
      }
      
      if (requiredPermission && !can(requiredPermission)) {
        addNotification({
          type: "error",
          message: "You don't have permission to access this resource.",
        })
        router.push("/")
        return
      }
      
      if (requiredRole && !hasRole(requiredRole)) {
        addNotification({
          type: "error",
          message: "This area requires higher access level.",
        })
        router.push("/")
        return
      }

      setHasChecked(true)
      setIsChecking(false)
    }, 5000) // Reduced timeout for better UX

    return () => clearTimeout(timer)
  }, [pathname, state.isAuthenticated, requiredPermission, requiredRole, can, hasRole, router, addNotification])

  // Always show loading for protected routes until fully checked
  if (pathname !== "/login" && (isChecking || !hasChecked)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner variant="default" size="md" />
      </div>
    )
  }

  // Only render children after successful auth check or on login page
  if (pathname === "/login" || (hasChecked && state.isAuthenticated)) {
    return <>{children}</>
  }

  // Fallback loading state
  return (
    <div className="flex items-center justify-center h-screen">
      <LoadingSpinner variant="default" size="md" />
    </div>
  )
}