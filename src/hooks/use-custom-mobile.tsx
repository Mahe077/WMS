"use client"

import { useState, useEffect } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }

    // Check on mount
    checkDevice()

    // Add event listener for window resize
    window.addEventListener("resize", checkDevice)

    // Cleanup
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  return isMobile
}
