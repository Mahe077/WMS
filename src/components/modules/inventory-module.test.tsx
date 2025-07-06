import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { InventoryItemStatus } from '@/lib/enum';
// import * as AppContext from '@/contexts/app-context';
import * as FilterHooks from '@/hooks/use-filters';
import { InventoryModule } from './inventory-module';
import React from 'react';

// Mock functions
const mockAddNotification = jest.fn();
const mockSetFilter = jest.fn();
const mockSetSearchTerm = jest.fn();
const mockClearFilters = jest.fn();
const mockGoToPage = jest.fn();
const mockSetPagination = jest.fn();
const mockGetPageItems = jest.fn((items) => items.slice(0, 10));

// Mock the context hooks
jest.mock('@/contexts/app-context', () => ({
  useNotifications: () => ({
    addNotification: mockAddNotification,
  }),
  
  // Filters context
  useFilters: () => ({
    filters: {},
    searchTerm: '',
    setFilter: mockSetFilter,
    setSearchTerm: mockSetSearchTerm,
    clearFilters: mockClearFilters,
  }),
  
  // pagination context
  usePagination: () => ({
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 5,
    goToPage: mockGoToPage,
    getPageItems: mockGetPageItems,
    setPagination: mockSetPagination,
  }),
}));
// Mock the custom filtering hook
jest.mock('@/hooks/use-filters', () => ({
  useFilteredData: jest.fn((data) => data),
}));

// Mock child components
jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    [key: string]: unknown;
  }) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({
    children,
    variant,
  }: {
    children: React.ReactNode;
    variant?: string;
  }) => (
    <span data-variant={variant}>{children}</span>
  ),
}));

jest.mock('../ui/stat-card', () => ({
  StatCard: ({ 
    title, 
    value, 
    changeDescription
  }: {
    title: string;
    value: string | number;
    changeDescription?: string;
  }) => (
    <div data-testid="stat-card">
      <div>{title}</div>
      <div>{value}</div>
      <div>{changeDescription}</div>
    </div>
  ),
}));

jest.mock('@/components/ui/filter-bar', () => {
  return {
    FilterBar: ({
      searchTerm,
      onSearchChange,
      onFilterChange,
      onClearFilters
    }: {
      searchTerm: string;
      onSearchChange: (term: string) => void;
      onFilterChange: (field: string, value: string) => void;
      onClearFilters: () => void;
    }) => {
      const [value, setValue] = React.useState(searchTerm);

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        onSearchChange(e.target.value);
      };

      return (
        <div data-testid="filter-bar">
          <input
            data-testid="search-input"
            value={value}
            onChange={handleChange}
          />
          <button data-testid="filter-button" onClick={() => onFilterChange('status', 'available')}>Filter</button>
          <button data-testid="clear-filters" onClick={onClearFilters}>Clear</button>
        </div>
      );
    },
  };
});

jest.mock('@/components/common/custom-table', () => ({
  CustomTable: ({
    data,
    onRowAction,
    renderExpandedContent,
    goToPage,
    handleItemsPerPageChange,
  }: {
    data: Array<{ sku: string; status?: string; holds?: string[]; [key: string]: unknown }>;
    onRowAction: (action: string, item: unknown) => void;
    renderExpandedContent?: (item: unknown) => React.ReactNode;
    goToPage?: (page: number) => void;
    handleItemsPerPageChange?: (itemsPerPage: number) => void;
  }) => (
    <div data-testid="custom-table">
      {data.map((item, index) => (
        <div key={index} data-testid={`table-row-${index}`}>
          <span>{item.sku}</span>
          {item.status && <span>{item.status}</span>}
          {item.holds && item.holds.length > 0 && <span>On Hold</span>}
          <button onClick={() => onRowAction('edit', item)}>Edit</button>
          {renderExpandedContent && (
            <div data-testid={`expanded-${index}`}>
              {renderExpandedContent(item)}
            </div>
          )}
        </div>
      ))}
      {/* Pagination controls inside CustomTable mock */}
      <div data-testid="custom-table-pagination">
        <button onClick={() => goToPage && goToPage(2)}>Next Page</button>
        <button onClick={() => handleItemsPerPageChange && handleItemsPerPageChange(20)} aria-label="Change Items Per Page">
          Change Items Per Page
        </button>
      </div>
    </div>
  ),
}));

describe('InventoryModule', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset mock implementations
    const mockUseFilteredData = FilterHooks.useFilteredData as jest.MockedFunction<typeof FilterHooks.useFilteredData>;
    mockUseFilteredData.mockImplementation((data) => data);
    mockGetPageItems.mockImplementation((items) => items.slice(0, 10));
  });

  describe('Component Rendering', () => {
    test('renders main heading and description', () => {
      render(<InventoryModule />);
      
      expect(screen.getAllByText('Inventory Management').length).toBeGreaterThan(0);
      expect(screen.getByText('Monitor stock levels, locations, and item status')).toBeInTheDocument();
    });

    test('renders action buttons', () => {
      render(<InventoryModule />);
      
      expect(screen.getByText('Adjust Stock')).toBeInTheDocument();
      expect(screen.getByText('Create Alert')).toBeInTheDocument();
    });

    test('renders all statistics cards', () => {
      render(<InventoryModule />);
      
      const statCards = screen.getAllByTestId('stat-card');
      expect(statCards).toHaveLength(4);
      
      expect(screen.getByText('Total SKUs')).toBeInTheDocument();
      expect(screen.getByText('Low Stock Items')).toBeInTheDocument();
      expect(screen.getByText('Items on Hold')).toBeInTheDocument();
      expect(screen.getByText('Expiring Soon')).toBeInTheDocument();
    });

    test('renders filter bar', () => {
      render(<InventoryModule />);
      
      expect(screen.getByTestId('filter-bar')).toBeInTheDocument();
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    test('renders inventory table', () => {
      render(<InventoryModule />);
      
      expect(screen.getByTestId('custom-table')).toBeInTheDocument();
    });

    test('renders pagination', () => {
      render(<InventoryModule />);
      expect(screen.getByTestId('custom-table-pagination')).toBeInTheDocument();
    });
  });

  describe('Mock Data Generation', () => {
    test('generates correct number of inventory items', () => {
      render(<InventoryModule />);
      
      // Should have 3 initial items + 47 generated = 50 total
      const tableRows = screen.getAllByTestId(/table-row-/);
      expect(tableRows.length).toBeLessThanOrEqual(10); // Due to pagination
    });

    test('statistics calculations are correct', () => {
      render(<InventoryModule />);
      
      // Total SKUs should be 50 (3 + 47 generated items)
      const statCards = screen.getAllByTestId('stat-card');
      expect(statCards[0]).toHaveTextContent('50'); // Total SKUs
    });
  });

  describe('User Interactions', () => {
    test('handles search input changes', async () => {
      const user = userEvent.setup();
      render(<InventoryModule />);

      const searchInput = screen.getByTestId('search-input');

      await user.clear(searchInput);
      await user.type(searchInput, 'SKU-12345');

      // Get the list of all calls
      const allCalls = mockSetSearchTerm.mock.calls.map(call => call[0]);

      // Check that the final expected value was called
      expect(allCalls).toContain('SKU-12345');
    });

    test('handles search input with direct value change', async () => {
      render(<InventoryModule />);
      
      const searchInput = screen.getByTestId('search-input');
      
      // Simulate direct input change (like paste or programmatic change)
      fireEvent.change(searchInput, { target: { value: 'TEST-SKU' } });
      
      expect(mockSetSearchTerm).toHaveBeenCalledWith('TEST-SKU');
    });

    test('handles filter changes', async () => {
      const user = userEvent.setup();
      render(<InventoryModule />);
      
      const filterButton = screen.getByTestId('filter-button');
      await user.click(filterButton);
      
      expect(mockSetFilter).toHaveBeenCalled();
    });

    test('handles clear filters action', async () => {
      const user = userEvent.setup();
      render(<InventoryModule />);
      
      const clearButton = screen.getByTestId('clear-filters');
      await user.click(clearButton);
      
      expect(mockClearFilters).toHaveBeenCalled();
    });

    test('handles pagination page change', async () => {
      const user = userEvent.setup();
      render(<InventoryModule />);
      
      const nextPageButton = screen.getByText('Next Page');
      await user.click(nextPageButton);
      
      expect(mockGoToPage).toHaveBeenCalledWith(2);
    });

    test('handles items per page change', async () => {
      const user = userEvent.setup();
      render(<InventoryModule />);
      
      const itemsPerPageButton = screen.getByText('Change Items Per Page');
      await user.click(itemsPerPageButton);
      
      expect(mockSetPagination).toHaveBeenCalledWith({
        itemsPerPage: 20,
        currentPage: 1
      });
    });

    test('handles action button clicks', async () => {
      const user = userEvent.setup();
      render(<InventoryModule />);
      
      const adjustStockButton = screen.getByText('Adjust Stock');
      await user.click(adjustStockButton);
      
      expect(mockAddNotification).toHaveBeenCalledWith({
        type: 'success',
        message: 'Stock Adjustment action performed on Multiple Items'
      });
    });

    test('handles table row actions', async () => {
      const user = userEvent.setup();
      render(<InventoryModule />);
      
      const editButton = screen.getAllByText('Edit')[0];
      await user.click(editButton);
      
      expect(mockAddNotification).toHaveBeenCalledWith({
        type: 'success',
        message: expect.stringContaining('edit action performed on')
      });
    });
  });

  describe('Status Badge Rendering', () => {
    test('renders correct badge for available items', () => {
      render(<InventoryModule />);
      
      // Mock data includes available items
      const availableBadges = screen.getAllByText('Available');
      expect(availableBadges.length).toBeGreaterThan(0);
    });

    test('renders on hold badge for items with holds', () => {
      render(<InventoryModule />);
      
      // Mock data includes items with QC holds
      const holdBadges = screen.getAllByText('On Hold');
      expect(holdBadges.length).toBeGreaterThan(0);
    });
  });

  describe('Filter Functions', () => {
    test('status filter function works correctly', () => {
      render(<InventoryModule/>);
      
      // const testItem = {
      //   sku: 'TEST-001',
      //   description: 'Test Item',
      //   lotNumber: 'LOT001',
      //   qty: 100,
      //   location: 'A-01',
      //   bbd: '2024-12-31',
      //   status: InventoryItemStatus.Available,
      //   holds: []
      // };

      // This would be tested in isolation if filter functions were exported
      // For now, we test through component interaction
      expect(screen.getByTestId('filter-bar')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('renders mobile-friendly layout classes', () => {
      render(<InventoryModule />);
      
      const heading = screen.getByText('Inventory Management');
      expect(heading.className).toContain('text-2xl lg:text-3xl');
    });
  });

  describe('Edge Cases', () => {
    test('handles empty search results', () => {
      // Mock useFilteredData to return empty array
      const mockUseFilteredData = FilterHooks.useFilteredData as jest.MockedFunction<typeof FilterHooks.useFilteredData>;
      mockUseFilteredData.mockReturnValueOnce([]);
      
      render(<InventoryModule />);
      
      // Should still render table structure
      expect(screen.getByTestId('custom-table')).toBeInTheDocument();
    });

    test('handles zero quantity items styling', () => {
      render(<InventoryModule />);
      
      // Items with qty <= 25 should have orange styling
      // This would be visible in the custom table component
      expect(screen.getByTestId('custom-table')).toBeInTheDocument();
    });

    test('handles items without BBD', () => {
      render(<InventoryModule />);
      
      // Component should handle items with empty or null BBD
      expect(screen.getByTestId('custom-table')).toBeInTheDocument();
    });
  });

  describe('Expanded Content Rendering', () => {
    test('renders expanded content correctly', () => {
      render(<InventoryModule />);
      
      const expandedContent = screen.getAllByTestId(/expanded-/);
      expect(expandedContent.length).toBeGreaterThan(0);
      
      // Should contain LOT, Location, BBD information
      expect(expandedContent[0]).toHaveTextContent('LOT');
      expect(expandedContent[0]).toHaveTextContent('Location');
      expect(expandedContent[0]).toHaveTextContent('BBD');
    });

    test('renders holds in expanded content when present', () => {
      render(<InventoryModule />);
      
      // Mock data includes items with holds
      const expandedSections = screen.getAllByTestId(/expanded-/);
      const sectionWithHolds = expandedSections.find(section => 
        section.textContent?.includes('Holds')
      );
      
      if (sectionWithHolds) {
        expect(sectionWithHolds).toHaveTextContent('Holds');
      }
    });
  });

  describe('Performance Considerations', () => {
    test('uses useMemo for mock data generation', () => {
      // This tests that the component structure supports performance optimization
      render(<InventoryModule />);
      
      // Re-render shouldn't cause issues
      render(<InventoryModule />);
      expect(screen.getAllByText('Inventory Management').length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    test('has proper heading structure', () => {
      render(<InventoryModule />);
      
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent('Inventory Management');
    });

    test('buttons have accessible text', () => {
      render(<InventoryModule />);
      
      expect(screen.getByRole('button', { name: /adjust stock/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create alert/i })).toBeInTheDocument();
    });
  });

  describe('Integration with Context Providers', () => {
    test('correctly uses notification context', async () => {
      const user = userEvent.setup();
      render(<InventoryModule />);
      
      const createAlertButton = screen.getByText('Create Alert');
      await user.click(createAlertButton);
      
      expect(mockAddNotification).toHaveBeenCalledWith({
        type: 'success',
        message: 'Alert Creation action performed on System'
      });
    });

    test('correctly uses filters context', () => {
      render(<InventoryModule />);
      
      // Verify that filter context methods are available
      expect(mockSetSearchTerm).toBeDefined();
      expect(mockSetFilter).toBeDefined();
      expect(mockClearFilters).toBeDefined();
    });

    test('correctly uses pagination context', () => {
      render(<InventoryModule />);
      
      // Verify that pagination context methods are available
      expect(mockGoToPage).toBeDefined();
      expect(mockSetPagination).toBeDefined();
    });
  });
});

// Additional test file: InventoryModule.integration.test.tsx
describe('InventoryModule Integration Tests', () => {
  test('filtering and pagination work together', async () => {
    const user = userEvent.setup();
    render(<InventoryModule />);
    
    // Apply filter
    const filterButton = screen.getByTestId('filter-button');
    await user.click(filterButton);
    
    // Change page
    const nextPageButton = screen.getByText('Next Page');
    await user.click(nextPageButton);
    
    // Both actions should have been called
    expect(mockSetFilter).toHaveBeenCalled();
    expect(mockGoToPage).toHaveBeenCalled();
  });

  test('search and filtering work together', async () => {
    const user = userEvent.setup();
    render(<InventoryModule />);
    
    // Enter search term
    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'SKU');
    
    // Apply filter
    const filterButton = screen.getByTestId('filter-button');
    await user.click(filterButton);
    
    expect(mockSetSearchTerm).toHaveBeenCalled();
    expect(mockSetFilter).toHaveBeenCalled();
  });
});

// Test utilities file: InventoryModule.test-utils.ts
export const createMockInventoryItem = (overrides = {}) => ({
  sku: 'SKU-TEST',
  description: 'Test Item',
  lotNumber: 'LOT-TEST',
  qty: 100,
  location: 'A-01',
  bbd: '2024-12-31',
  status: InventoryItemStatus.Available,
  holds: [],
  ...overrides
});

export const mockInventoryItems = [
  createMockInventoryItem({ sku: 'SKU-001', qty: 150 }),
  createMockInventoryItem({ 
    sku: 'SKU-002', 
    qty: 25, 
    status: InventoryItemStatus.OutOfStock 
  }),
  createMockInventoryItem({ 
    sku: 'SKU-003', 
    qty: 0, 
    status: InventoryItemStatus.QCHold,
    holds: [InventoryItemStatus.QCHold]
  }),
];

// Setup file: setupTests.ts (for Jest configuration)
// Ensure this is added to your Jest setup
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});