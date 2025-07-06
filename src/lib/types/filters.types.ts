// For search and filter functionality
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text';
  options?: FilterOption[];
  placeholder?: string;
  width?: string;
  multiple?: boolean;
}

export interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters: Record<string, unknown>;
  onFilterChange: (key: string, value: unknown) => void;
  onClearFilters: () => void;
  filterConfigs: FilterConfig[];
  showClearButton?: boolean;
  className?: string;
}
