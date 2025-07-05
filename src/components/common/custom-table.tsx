"use client";

import React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  Eye,
  Edit,
  MoreVertical,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "../ui/pagination";

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  mobileHidden?: boolean;
  priority?: "high" | "medium" | "low";
}

interface CustomTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  title?: string;
  description?: string;
  onRowAction?: (action: string, row: T) => void;
  expandable?: boolean;
  renderExpandedContent?: (row: T) => React.ReactNode;
  renderFilters?: () => React.ReactNode;
  renderCustomActions?: () => React.ReactNode;
  renderTableActions?: (row: T, index: number) => React.ReactNode;
  showDefaultActions?: boolean;
  className?: string;
  // Pagination props - fixed
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItemsCount: number; // Changed to number
  goToPage: (page: number) => void;
  handleItemsPerPageChange: (itemsPerPage: number) => void;
  //actions
  viewEnabled?: boolean;
  editEnabled?: boolean;
  deleteEnabled?: boolean;
}

export function CustomTable<T>({
  columns,
  data,
  title,
  description,
  onRowAction,
  expandable = false,
  renderExpandedContent,
  renderFilters,
  renderCustomActions,
  renderTableActions,
  showDefaultActions = true,
  className = "",
  // Pagination props - fixed
  currentPage,
  totalPages,
  itemsPerPage,
  totalItemsCount, // Now a number
  goToPage,
  handleItemsPerPageChange,
  //actions
  viewEnabled = true,
  editEnabled = true,
  deleteEnabled = true,
}: CustomTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (rowId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  };

  // Get primary columns for mobile (high priority)
  const primaryColumns = columns.filter(
    (col) => col.priority === "high" || !col.priority
  );
  const secondaryColumns = columns.filter((col) => col.priority === "medium");

  // Create pagination component to avoid duplication
  const paginationComponent = (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      totalItems={totalItemsCount}
      onPageChange={goToPage}
      onItemsPerPageChange={handleItemsPerPageChange}
    />
  );

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card>
          {title && (
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
          )}
          <CardContent>
            {/* Filters and Custom Actions */}
            {(renderFilters || renderCustomActions) && (
              <div className="space-y-4 mb-6">
                {renderFilters && (
                  <div className="rounded-lg">{renderFilters()}</div>
                )}
                {renderCustomActions && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {renderCustomActions()}
                  </div>
                )}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    {columns.map((column) => (
                      <th
                        key={String(column.key)}
                        className="text-left p-2 font-medium"
                      >
                        {column.label}
                      </th>
                    ))}
                    {(showDefaultActions || renderTableActions) && (
                      <th className="text-left p-2 font-medium">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      {columns.map((column) => (
                        <td key={String(column.key)} className="p-2">
                          {column.render ? (
                            column.render(row[column.key], row)
                          ) : (
                            <span className="text-sm text-gray-800">
                              {String(row[column.key])}
                            </span>
                          )}
                        </td>
                      ))}
                      {(showDefaultActions || renderTableActions) && (
                        <td className="p-2">
                          <div className="flex gap-1">
                            {renderTableActions ? (
                              renderTableActions(row, index)
                            ) : (
                              <React.Fragment>
                                {viewEnabled && (<Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onRowAction?.("view", row)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>)}
                                {editEnabled &&
                                (<Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onRowAction?.("edit", row)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>)}
                                {deleteEnabled &&(
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onRowAction?.("delete", row)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>)}
                              </React.Fragment>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination for desktop */}
            <div className="mt-6">{paginationComponent}</div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {/* Mobile Filters */}
        {(renderFilters || renderCustomActions) && (
          <Card>
            <CardContent className="p-4 space-y-4">
              {renderFilters && renderFilters()}
              {renderCustomActions && renderCustomActions()}
            </CardContent>
          </Card>
        )}

        {data.map((row, index) => {
          const rowId = `row-${index}`;
          const isExpanded = expandedRows.has(rowId);

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
                            {column.render ? (
                              column.render(row[column.key], row)
                            ) : (
                              <span className="text-sm text-gray-800">
                                {String(row[column.key])}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">{column.label}:</span>{" "}
                            {column.render ? (
                              column.render(row[column.key], row)
                            ) : (
                              <span className="text-sm text-gray-800">
                                {String(row[column.key])}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Actions Menu */}
                  {(showDefaultActions || renderTableActions) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {renderTableActions ? (
                          <div className="p-1">
                            {renderTableActions(row, index)}
                          </div>
                        ) : (
                          <React.Fragment>
                            {viewEnabled && (
                            <DropdownMenuItem
                              onClick={() => onRowAction?.("view", row)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            )}
                            {editEnabled && (
                            <DropdownMenuItem
                              onClick={() => onRowAction?.("edit", row)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            )}
                            {deleteEnabled && (
                            <DropdownMenuItem
                              onClick={() => onRowAction?.("delete", row)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                            )}
                          </React.Fragment>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* Secondary Information (when expanded or always visible) */}
                {(secondaryColumns.length > 0 || expandable) && (
                  <>
                    {(isExpanded || !expandable) && (
                      <div className="space-y-1 text-sm">
                        {secondaryColumns.map((column) => (
                          <div
                            key={String(column.key)}
                            className="flex justify-between"
                          >
                            <span className="text-gray-600">
                              {column.label}:
                            </span>
                            <span className="font-medium">
                              {column.render ? (
                                column.render(row[column.key], row)
                              ) : (
                                <span className="text-sm text-gray-800">
                                  {String(row[column.key])}
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                        {expandable &&
                          renderExpandedContent &&
                          renderExpandedContent(row)}
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
                          <React.Fragment>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Show Less
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <ChevronRight className="h-4 w-4 mr-1" />
                            Show More
                          </React.Fragment>
                        )}
                      </Button>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Pagination for mobile */}
        {/* <Card> */}
          <CardContent className="p-4">{paginationComponent}</CardContent>
        {/* </Card> */}
      </div>
    </div>
  );
}
