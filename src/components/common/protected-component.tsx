"use client"

import React from "react"

import { useAuth } from "@/contexts/auth-context"

interface ProtectedComponentProps {
  children: React.ReactNode
  requiredPermission?: string
  requiredRole?: string | string[]
  fallback?: React.ReactNode
}

export function ProtectedComponent({
  children,
  requiredPermission,
  requiredRole,
  fallback = null,
}: ProtectedComponentProps) {
  const { can, hasRole } = useAuth()

  // Check permission if specified
  if (requiredPermission && !can(requiredPermission)) {
    return <React.Fragment>{fallback}</React.Fragment>
  }

  // Check role if specified
  if (requiredRole && !hasRole(requiredRole)) {
    return <React.Fragment>{fallback}</React.Fragment>
  }

  return <React.Fragment>{children}</React.Fragment>
}
