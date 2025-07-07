"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CustomCalender } from "./custom-calender";
import { Input } from "@/components/ui/input";
import { Selector } from "./selector";
import { Search, Filter, X } from "lucide-react";
import { FilterBarProps, FilterConfig } from "@/lib/types";
import { cn } from "@/lib/utils";

import React from "react";

export function FilterBar({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  onFilterChange,
  onClearFilters,
  filterConfigs,
  showClearButton = true,
  className,
}: FilterBarProps) {
  const hasActiveFilters = Object.values(filters).some(
    (value) => value && value !== "all" && value !== ""
  );

  const renderFilter = (config: FilterConfig) => {
    switch (config.type) {
      case 'select':
        return (
          <Selector
            key={config.key}
            value={typeof filters[config.key] === "string" ? (filters[config.key] as string) : "all"}
            onChange={(value) => onFilterChange(config.key, value)}
            options={config.options || []}
            placeholder={config.placeholder}
            label={config.label}
            widthClass={cn("w-full sm:w-48", config.width)}
          />
        );

      case 'text':
        return (
          <Input
            key={config.key}
            placeholder={config.placeholder || config.label}
            value={typeof filters[config.key] === "string" ? (filters[config.key] as string) : ""}
            onChange={(e) => onFilterChange(config.key, e.target.value)}
            className={cn("w-full sm:w-48", config.width)}
          />
        );

      case 'date':
        return (
          <CustomCalender
            key={config.key}
            value={filters[config.key] as string | undefined}
            onChange={(date) => onFilterChange(config.key, date)}
            placeholder={config.placeholder}
            label={config.label}
            widthClass={cn("w-full sm:w-48", config.width)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      {/* <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search & Filter
        </CardTitle>
      </CardHeader> */}
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-6 w-6 p-0"
                  onClick={() => onSearchChange("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
            {filterConfigs.map(renderFilter)}

            {showClearButton && (
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={onClearFilters}
                disabled={!hasActiveFilters && !searchTerm}
              >
                <div className="relative">
                <Filter className="h-4 w-4 mr-2" />
                {(hasActiveFilters || searchTerm) && <span className="absolute -top-1 h-2.5 w-2.5 rounded-full bg-red-500" />}
                </div>
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}