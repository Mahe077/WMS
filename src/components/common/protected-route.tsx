"use client"

import React, { useEffect } from "react"
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

  useEffect(() => {
    if (pathname === "/login") {
      return;
    }

    if (state.isLoading) {
      return;
    }

    if (!state.isAuthenticated) {
      router.push("/login");
      return;
    }

    if (requiredPermission && !can(requiredPermission)) {
      addNotification({
        type: "error",
        message: "You don't have permission to access this resource.",
      });
      router.push("/access-denied");
      return;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      addNotification({
        type: "error",
        message: "This area requires a higher access level.",
      });
      router.push("/access-denied");
      return;
    }
  }, [pathname, state.isAuthenticated, state.isLoading, requiredPermission, requiredRole, can, hasRole, router, addNotification]);

  // Always show loading for protected routes until fully checked
  if (pathname !== "/login" && state.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner variant="default" size="md" />
      </div>
    )
  }

  // Only render children after successful auth check or on login page
  if (pathname === "/login" || state.isAuthenticated) {
    return <>{children}</>
  }

  // Fallback loading state
  return (
    <div className="flex items-center justify-center h-screen">
      <LoadingSpinner variant="default" size="md" />
    </div>
  )
}