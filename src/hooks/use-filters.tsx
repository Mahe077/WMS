import { useMemo } from "react";

export function useFilteredData<T, F = unknown>(
  data: T[],
  searchTerm: string,
  filters: Record<string, F>,
  searchFields: (keyof T)[],
  filterFunctions: Record<string, (item: T, filterValue: F) => boolean>
) {
  return useMemo(() => {
    return data.filter((item) => {
      // Search logic
      const matchesSearch = !searchTerm || searchFields.some((field) => {
        const value = item[field];
        return value && 
               String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });

      // Filter logic
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value || value === "all" || value === "") return true;
        const filterFn = filterFunctions[key];
        return filterFn ? filterFn(item, value) : true;
      });

      return matchesSearch && matchesFilters;
    });
  }, [data, searchTerm, filters, searchFields, filterFunctions]);
}