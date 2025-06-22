"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  variant?: "default" | "warehouse" | "pulse" | "dots" | "bars" | "orbit" | "gear" | "truck"
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  color?: "blue" | "green" | "orange" | "red" | "gray"
}

export function LoadingSpinner({ variant = "default", size = "md", className, color = "blue" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  }

  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    orange: "text-orange-600",
    red: "text-red-600",
    gray: "text-gray-600",
  }

  const baseClasses = cn(sizeClasses[size], colorClasses[color], className)

  switch (variant) {
    case "warehouse":
      return (
        <div className={cn("relative", baseClasses)}>
          {/* Warehouse Box Stack Animation */}
          <div className="absolute inset-0 animate-pulse">
            <div className="w-full h-1/3 bg-current opacity-80 rounded-sm mb-0.5"></div>
            <div className="w-full h-1/3 bg-current opacity-60 rounded-sm mb-0.5"></div>
            <div className="w-full h-1/3 bg-current opacity-40 rounded-sm"></div>
          </div>
          <div className="absolute inset-0 animate-bounce delay-150">
            <div className="w-full h-1/3 bg-current opacity-20 rounded-sm"></div>
          </div>
        </div>
      )

    case "pulse":
      return (
        <div className={cn("relative", baseClasses)}>
          <div className="absolute inset-0 bg-current rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-0 bg-current rounded-full animate-pulse"></div>
        </div>
      )

    case "dots":
      return (
        <div className={cn("flex space-x-1", className)}>
          <div
            className={cn(
              "rounded-full bg-current animate-bounce",
              sizeClasses[size].replace("w-", "w-").replace("h-", "h-").split(" ")[0],
              colorClasses[color],
            )}
          ></div>
          <div
            className={cn(
              "rounded-full bg-current animate-bounce delay-100",
              sizeClasses[size].replace("w-", "w-").replace("h-", "h-").split(" ")[0],
              colorClasses[color],
            )}
          ></div>
          <div
            className={cn(
              "rounded-full bg-current animate-bounce delay-200",
              sizeClasses[size].replace("w-", "w-").replace("h-", "h-").split(" ")[0],
              colorClasses[color],
            )}
          ></div>
        </div>
      )

    case "bars":
      return (
        <div className={cn("flex items-end space-x-1", className)}>
          <div
            className={cn(
              "bg-current animate-pulse",
              `w-1 h-${size === "sm" ? "3" : size === "md" ? "4" : size === "lg" ? "6" : "8"}`,
              colorClasses[color],
            )}
          ></div>
          <div
            className={cn(
              "bg-current animate-pulse delay-75",
              `w-1 h-${size === "sm" ? "4" : size === "md" ? "6" : size === "lg" ? "8" : "10"}`,
              colorClasses[color],
            )}
          ></div>
          <div
            className={cn(
              "bg-current animate-pulse delay-150",
              `w-1 h-${size === "sm" ? "2" : size === "md" ? "3" : size === "lg" ? "4" : "6"}`,
              colorClasses[color],
            )}
          ></div>
          <div
            className={cn(
              "bg-current animate-pulse delay-225",
              `w-1 h-${size === "sm" ? "5" : size === "md" ? "7" : size === "lg" ? "9" : "12"}`,
              colorClasses[color],
            )}
          ></div>
        </div>
      )

    case "orbit":
      return (
        <div className={cn("relative", baseClasses)}>
          <div className="absolute inset-0 rounded-full border-2 border-current opacity-20"></div>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-current animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-current animate-spin animate-reverse delay-150"></div>
        </div>
      )

    case "gear":
      return (
        <div className={cn("relative", baseClasses)}>
          <svg className="animate-spin" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L20.32 6.32C20.75 5.33 20.75 4.17 20.32 3.18L21 2.5V0.5L19.5 0.5L18.82 1.18C17.83 0.75 16.67 0.75 15.68 1.18L15 0.5H13L13 2.5L13.68 3.18C13.25 4.17 13.25 5.33 13.68 6.32L13 7V9L15 9L15.68 8.32C16.67 8.75 17.83 8.75 18.82 8.32L19.5 9H21.5V7H21ZM12 18C10.9 18 10 18.9 10 20C10 21.1 10.9 22 12 22C13.1 22 14 21.1 14 20C14 18.9 13.1 18 12 18ZM4 12C2.9 12 2 12.9 2 14C2 15.1 2.9 16 4 16C5.1 16 6 15.1 6 14C6 12.9 5.1 12 4 12ZM20 12C18.9 12 18 12.9 18 14C18 15.1 18.9 16 20 16C21.1 16 22 15.1 22 14C22 12.9 21.1 12 20 12Z" />
          </svg>
        </div>
      )

    case "truck":
      return (
        <div className={cn("relative", baseClasses)}>
          <svg className="animate-bounce" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20,8H17V4H3C1.89,4 1,4.89 1,6V17H3C3,18.65 4.35,20 6,20C7.65,20 9,18.65 9,17H15C15,18.65 16.35,20 18,20C19.65,20 21,18.65 21,17H23V12L20,8M19,9.5L20.5,12H17V9.5H19M6,18.5C5.17,18.5 4.5,17.83 4.5,17C4.5,16.17 5.17,15.5 6,15.5C6.83,15.5 7.5,16.17 7.5,17C7.5,17.83 6.83,18.5 6,18.5M18,18.5C17.17,18.5 16.5,17.83 16.5,17C16.5,16.17 17.17,15.5 18,15.5C18.83,15.5 19.5,16.17 19.5,17C19.5,17.83 18.83,18.5 18,18.5Z" />
          </svg>
        </div>
      )

    default:
      return (
        <div className={cn("relative", baseClasses)}>
          <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-current animate-spin"></div>
        </div>
      )
  }
}

// Full-screen loading overlay component
interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  variant?: LoadingSpinnerProps["variant"]
  backdrop?: "light" | "dark" | "blur"
}

export function LoadingOverlay({
  isLoading,
  message = "Loading...",
  variant = "warehouse",
  backdrop = "light",
}: LoadingOverlayProps) {
  if (!isLoading) return null

  const backdropClasses = {
    light: "bg-white/80",
    dark: "bg-black/50",
    blur: "bg-white/70 backdrop-blur-sm",
  }

  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center", backdropClasses[backdrop])}>
      <div className="flex flex-col items-center space-y-4 p-8 rounded-lg bg-white shadow-lg border">
        <LoadingSpinner variant={variant} size="xl" />
        <p className="text-sm font-medium text-gray-700">{message}</p>
      </div>
    </div>
  )
}

// Inline loading component for buttons and small areas
interface InlineLoadingProps {
  isLoading: boolean
  children: React.ReactNode
  variant?: LoadingSpinnerProps["variant"]
  size?: LoadingSpinnerProps["size"]
  loadingText?: string
}

export function InlineLoading({
  isLoading,
  children,
  variant = "default",
  size = "sm",
  loadingText,
}: InlineLoadingProps) {
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <LoadingSpinner variant={variant} size={size} />
        {loadingText && <span className="text-sm">{loadingText}</span>}
      </div>
    )
  }

  return <>{children}</>
}

// Skeleton loading component
interface SkeletonProps {
  className?: string
  variant?: "text" | "rectangular" | "circular"
  animation?: "pulse" | "wave" | "none"
}

export function Skeleton({ className, variant = "rectangular", animation = "pulse" }: SkeletonProps) {
  const variantClasses = {
    text: "h-4 rounded",
    rectangular: "rounded-md",
    circular: "rounded-full",
  }

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-pulse", // Could be enhanced with wave animation
    none: "",
  }

  return <div className={cn("bg-gray-200", variantClasses[variant], animationClasses[animation], className)} />
}

// Loading button component
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean
  loadingText?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function LoadingButton({
  isLoading,
  loadingText = "Loading...",
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2",
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  )
}
