"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/features/auth/hooks/useAuth"
// import { Settings, HelpCircle, LogOut, ChevronDown, UserCircle, Palette } from "lucide-react"


export function UserProfileButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { state: authState } = useAuth()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop Profile Button */}
      <Button
        variant="ghost"
        className="hidden lg:flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-semibold">
                {authState.user?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("") || "JD"}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>

          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-gray-900 leading-tight">
              {authState.user?.name || "John Doe"}
            </span>
            <Badge
              variant="outline"
              className={`text-xs capitalize px-1 py-0.5 ${
                authState.user?.role === "admin"
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : authState.user?.role === "manager"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              {authState.user?.role}
            </Badge>
          </div>
        </div>
        {/* <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        /> */}
      </Button>

      {/* Mobile Profile Button */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white text-xs font-semibold">
              {authState.user?.name
                .split(" ")
                .map((n) => n[0])
                .join("") || "JD"}
            </span>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-white"></div>
        </div>
      </Button>

      {/* Dropdown Menu */}
      {/* {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          {/* <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {authState.user?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("") || "JD"}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{authState.user?.name}</p>
                <p className="text-xs text-gray-500">{authState.user?.email}</p>
                <Badge variant="outline" className="mt-1 text-xs capitalize">
                  {authState.user?.role}
                </Badge>
              </div>
            </div>
          </div>*/}

          {/* Menu Items */}
          {/* <div className="py-2">
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-sm hover:bg-gray-50"
              onClick={() => {
                setIsOpen(false)
                // Handle profile view
              }}
            >
              <UserCircle className="h-4 w-4 mr-3" />
              View Profile
            </Button>

            {onSettings && (
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-2 text-sm hover:bg-gray-50"
                onClick={() => {
                  setIsOpen(false)
                  onSettings()
                }}
              >
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Button>
            )}

            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-sm hover:bg-gray-50"
              onClick={() => {
                setIsOpen(false)
                // Handle preferences
              }}
            >
              <Palette className="h-4 w-4 mr-3" />
              Preferences
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-sm hover:bg-gray-50"
              onClick={() => {
                setIsOpen(false)
                // Handle help
              }}
            >
              <HelpCircle className="h-4 w-4 mr-3" />
              Help & Support
            </Button>

            <div className="my-2 border-t border-gray-100" />

            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => {
                setIsOpen(false)
                onLogout()
              }}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      )} */}
    </div>
  )
}
