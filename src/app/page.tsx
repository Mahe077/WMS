"use client"

import { useEffect } from "react"
import { redirect } from "next/navigation"
import { useAuth } from "@/features/auth/hooks/useAuth"

export default function Home() {
  const { state: authState } = useAuth()

  useEffect(() => {
    if (authState.isAuthenticated) {
      redirect("/dashboard")
    } else if (authState.isAuthenticated === false) {
      redirect("/login")
    }
  }, [authState.isAuthenticated])

  return null
}