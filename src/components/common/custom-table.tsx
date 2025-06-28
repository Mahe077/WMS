"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Eye, Edit, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export interface TableColumn<T> {
  key: keyof T
  label: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
  mobileHidden?: boolean
  priority?: "high" | "medium" | "low"
}

interface CustomTableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  title?: string
  onRowAction?: (action: string, row: T) => void
  expandable?: boolean
  renderExpandedContent?: (row: T) => React.ReactNode
}

export function CustomTable<T>({
  columns,
  data,
  title,
  onRowAction,
  expandable = false,
  renderExpandedContent,
}:CustomTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRowExpansion = (rowId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId)
    } else {
      newExpanded.add(rowId)
    }
    setExpandedRows(newExpanded)
  }

  // Get primary columns for mobile (high priority)
  const primaryColumns = columns.filter((col) => col.priority === "high" || !col.priority)
  const secondaryColumns = columns.filter((col) => col.priority === "medium")

  return (
    <div className="space-y-2">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card>
          {title && (
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
          )}
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    {columns.map((column) => (
                      <th key={String(column.key)} className="text-left p-2 font-medium">
                        {column.label}
                      </th>
                    ))}
                    <th className="text-left p-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      {columns.map((column) => (
                        <td key={String(column.key)} className="p-2">
                          {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                        </td>
                      ))}
                      <td className="p-2">
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" onClick={() => onRowAction?.("view", row)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => onRowAction?.("edit", row)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {data.map((row, index) => {
          const rowId = `row-${index}`
          const isExpanded = expandedRows.has(rowId)

          return (
            <Card key={index} className="overflow-hidden py-0">
              <CardContent className="p-4">
                {/* Primary Information */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    {primaryColumns.map((column) => (
                      <div key={String(column.key)} className="mb-1">
                        {column.key === primaryColumns[0].key ? (
                          <div className="font-medium text-base truncate">
                            {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">{column.label}:</span>{" "}
                            {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Actions Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onRowAction?.("view", row)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRowAction?.("edit", row)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Secondary Information (when expanded or always visible) */}
                {(secondaryColumns.length > 0 || expandable) && (
                  <>
                    {(isExpanded || !expandable) && (
                      <div className="space-y-1 text-sm">
                        {secondaryColumns.map((column) => (
                          <div key={String(column.key)} className="flex justify-between">
                            <span className="text-gray-600">{column.label}:</span>
                            <span className="font-medium">
                              {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                            </span>
                          </div>
                        ))}
                        {expandable && renderExpandedContent && renderExpandedContent(row)}
                      </div>
                    )}

                    {expandable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2 text-blue-600"
                        onClick={() => toggleRowExpansion(rowId)}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronRight className="h-4 w-4 mr-1" />
                            Show More
                          </>
                        )}
                      </Button>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}