"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, ChevronDownIcon } from "lucide-react";
import { FilterBarProps, FilterConfig } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Calendar } from "./calendar";
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
  const [open, setOpen] = React.useState(false)

  const renderFilter = (config: FilterConfig) => {
    switch (config.type) {
      case 'select':
        return (
          <Select
            key={config.key}
            value={typeof filters[config.key] === "string" ? (filters[config.key] as string) : "all"}
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
            value={typeof filters[config.key] === "string" ? (filters[config.key] as string) : ""}
            onChange={(e) => onFilterChange(config.key, e.target.value)}
            className={cn("w-full sm:w-48", config.width)}
          />
        );

      case 'date':
        return (
          // <Input
          //   key={config.key}
          //   type="date"
          //   placeholder={config.placeholder || config.label}
          //   value={filters[config.key] || ""}
          //   onChange={(e) => onFilterChange(config.key, e.target.value)}
          //   className={cn("w-full sm:w-48", config.width)}
          // />
          <Popover open={open} onOpenChange={setOpen} key={config.key}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal"
              >
                {filters[config.key] ? new Date(filters[config.key] as string).toLocaleDateString() : config.placeholder || config.label}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  filters[config.key]
                    ? new Date(filters[config.key] as string)
                    : undefined
                }
                captionLayout="dropdown"
                onSelect={(date) => {
                  onFilterChange(config.key, date)
                }}
              />
            </PopoverContent>
          </Popover>
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