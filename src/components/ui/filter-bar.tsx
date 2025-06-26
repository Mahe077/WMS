"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { FilterBarProps, FilterConfig } from "@/lib/types";
import { cn } from "@/lib/utils";

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
          <Select
            key={config.key}
            value={filters[config.key] || "all"}
            onValueChange={(value) => onFilterChange(config.key, value)}
          >
            <SelectTrigger className={cn("w-full sm:w-48", config.width)}>
              <SelectValue placeholder={config.placeholder || config.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {config.label}</SelectItem>
              {config.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                  {option.count !== undefined && (
                    <span className="ml-2 text-muted-foreground">
                      ({option.count})
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'text':
        return (
          <Input
            key={config.key}
            placeholder={config.placeholder || config.label}
            value={filters[config.key] || ""}
            onChange={(e) => onFilterChange(config.key, e.target.value)}
            className={cn("w-full sm:w-48", config.width)}
          />
        );

      case 'date':
        return (
          <Input
            key={config.key}
            type="date"
            placeholder={config.placeholder || config.label}
            value={filters[config.key] || ""}
            onChange={(e) => onFilterChange(config.key, e.target.value)}
            className={cn("w-full sm:w-48", config.width)}
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
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
                {(hasActiveFilters || searchTerm) && (
                  <span className="ml-1 text-xs bg-destructive text-destructive-foreground rounded-full px-1.5 py-0.5">
                    !
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}