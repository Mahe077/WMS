// components/dashboard/stat-card.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import React from "react"

interface StatCardProps {
  title: string
  value: number
  change: string
  icon: React.ElementType
  color?: string
}

export function StatCard({ title, value, change, icon: Icon, color = "text-gray-600" }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden py-0 gap-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">{title}</CardTitle>
        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${color} flex-shrink-0`} />
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="flex items-center space-x-1">
          <span className={`text-xs font-medium ${change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
            {change}
          </span>
          <span className="text-xs text-gray-500 hidden sm:inline">from last month</span>
          <span className="text-xs text-gray-500 sm:hidden">vs last</span>
        </div>
      </CardContent>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/30 pointer-events-none lg:hidden" />
    </Card>
  )
}
