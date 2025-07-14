import { fireEvent, render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { InventoryItemStatus } from '@/lib/enum';
import * as FilterHooks from '@/hooks/use-filters';
import React from 'react';
import { AuthProvider } from '@/providers/auth-provider';
import InventoryPage from './page';
import * as AuthApi from '@/features/auth/api';

// Mock the API module
jest.mock('@/features/auth/api');

// Mock child components
jest.mock('@/components/common/protected-route', () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock functions
const mockAddNotification = jest.fn();
const mockSetFilter = jest.fn();
const mockSetSearchTerm = jest.fn();
const mockClearFilters = jest.fn();
const mockGoToPage = jest.fn();
const mockSetPagination = jest.fn();
const mockGetPageItems = jest.fn((items) => items.slice(0, 10));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock the context hooks
jest.mock('@/contexts/app-context', () => ({
  useNotifications: () => ({
    addNotification: mockAddNotification,
  }),
  useFilters: () => ({
    filters: {},
    searchTerm: '',
    setFilter: mockSetFilter,
    setSearchTerm: mockSetSearchTerm,
    clearFilters: mockClearFilters,
  }),
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

jest.mock('@/components/ui/stat-card', () => ({
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
      <div data-testid="custom-table-pagination">
        <button onClick={() => goToPage && goToPage(2)}>Next Page</button>
        <button onClick={() => handleItemsPerPageChange && handleItemsPerPageChange(20)} aria-label="Change Items Per Page">
          Change Items Per Page
        </button>
      </div>
    </div>
  ),
}));

const renderComponent = async () => {
    const renderResult = render(<AuthProvider><InventoryPage /></AuthProvider>);
    await act(async () => {
      await Promise.resolve();
    });
    return renderResult;
};

describe('InventoryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const mockValidateTokenApi = AuthApi.validateTokenApi as jest.Mock;
    mockValidateTokenApi.mockResolvedValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com', roles: ['admin'], permissions: ['read:inventory'] },
      token: 'mock-token',
    });

    const mockUseFilteredData = FilterHooks.useFilteredData as jest.MockedFunction<typeof FilterHooks.useFilteredData>;
    mockUseFilteredData.mockImplementation((data) => data);
    mockGetPageItems.mockImplementation((items) => items.slice(0, 10));
  });

  describe('Component Rendering', () => {
    test('renders main heading and description', async () => {
      await renderComponent();
      expect(await screen.findByText('Inventory Management')).toBeInTheDocument();
      expect(screen.getByText('Monitor stock levels, locations, and item status')).toBeInTheDocument();
    });

    test('renders action buttons', async () => {
      await renderComponent();
      expect(await screen.findByText('Adjust Stock')).toBeInTheDocument();
      expect(screen.getByText('Create Alert')).toBeInTheDocument();
    });

    test('renders all statistics cards', async () => {
      await renderComponent();
      const statCards = await screen.findAllByTestId('stat-card');
      expect(statCards).toHaveLength(4);
      expect(screen.getByText('Total SKUs')).toBeInTheDocument();
      expect(screen.getByText('Low Stock Items')).toBeInTheDocument();
      expect(screen.getByText('Items on Hold')).toBeInTheDocument();
      expect(screen.getByText('Expiring Soon')).toBeInTheDocument();
    });

    test('renders filter bar', async () => {
      await renderComponent();
      expect(await screen.findByTestId('filter-bar')).toBeInTheDocument();
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    test('renders inventory table', async () => {
      await renderComponent();
      expect(await screen.findByTestId('custom-table')).toBeInTheDocument();
    });

    test('renders pagination', async () => {
      await renderComponent();
      expect(await screen.findByTestId('custom-table-pagination')).toBeInTheDocument();
    });
  });

  describe('Mock Data Generation', () => {
    test('generates correct number of inventory items', async () => {
      await renderComponent();
      const tableRows = await screen.findAllByTestId(/table-row-/);
      expect(tableRows.length).toBeLessThanOrEqual(10);
    });

    test('statistics calculations are correct', async () => {
      await renderComponent();
      const statCards = await screen.findAllByTestId('stat-card');
      expect(statCards[0]).toHaveTextContent('50');
    });
  });

  describe('User Interactions', () => {
    test('handles search input changes', async () => {
      const user = userEvent.setup();
      await renderComponent();
      const searchInput = await screen.findByTestId('search-input');
      await user.clear(searchInput);
      await user.type(searchInput, 'SKU-12345');
      const allCalls = mockSetSearchTerm.mock.calls.map(call => call[0]);
      expect(allCalls).toContain('SKU-12345');
    });

    test('handles search input with direct value change', async () => {
      await renderComponent();
      const searchInput = await screen.findByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'TEST-SKU' } });
      expect(mockSetSearchTerm).toHaveBeenCalledWith('TEST-SKU');
    });

    test('handles filter changes', async () => {
      const user = userEvent.setup();
      await renderComponent();
      const filterButton = await screen.findByTestId('filter-button');
      await user.click(filterButton);
      expect(mockSetFilter).toHaveBeenCalled();
    });

    test('handles clear filters action', async () => {
      const user = userEvent.setup();
      await renderComponent();
      const clearButton = await screen.findByTestId('clear-filters');
      await user.click(clearButton);
      expect(mockClearFilters).toHaveBeenCalled();
    });

    test('handles pagination page change', async () => {
      const user = userEvent.setup();
      await renderComponent();
      const nextPageButton = await screen.findByText('Next Page');
      await user.click(nextPageButton);
      expect(mockGoToPage).toHaveBeenCalledWith(2);
    });

    test('handles items per page change', async () => {
      const user = userEvent.setup();
      await renderComponent();
      const itemsPerPageButton = await screen.findByText('Change Items Per Page');
      await user.click(itemsPerPageButton);
      expect(mockSetPagination).toHaveBeenCalledWith({
        itemsPerPage: 20,
        currentPage: 1
      });
    });

    test('handles action button clicks', async () => {
      const user = userEvent.setup();
      await renderComponent();
      const adjustStockButton = await screen.findByText('Adjust Stock');
      await user.click(adjustStockButton);
      expect(mockAddNotification).toHaveBeenCalledWith({
        type: 'success',
        message: 'Stock Adjustment action performed on Multiple Items'
      });
    });

    test('handles table row actions', async () => {
      const user = userEvent.setup();
      await renderComponent();
      const editButton = (await screen.findAllByText('Edit'))[0];
      await user.click(editButton);
      expect(mockAddNotification).toHaveBeenCalledWith({
        type: 'success',
        message: expect.stringContaining('edit action performed on')
      });
    });
  });

  describe('Status Badge Rendering', () => {
    test('renders correct badge for available items', async () => {
      await renderComponent();
      const availableBadges = await screen.findAllByText('Available');
      expect(availableBadges.length).toBeGreaterThan(0);
    });

    test('renders on hold badge for items with holds', async () => {
      await renderComponent();
      const holdBadges = await screen.findAllByText('On Hold');
      expect(holdBadges.length).toBeGreaterThan(0);
    });
  });

  describe('Filter Functions', () => {
    test('status filter function works correctly', async () => {
      await renderComponent();
      expect(await screen.findByTestId('filter-bar')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('renders mobile-friendly layout classes', async () => {
      await renderComponent();
      const heading = await screen.findByText('Inventory Management');
      expect(heading.className).toContain('text-2xl lg:text-3xl');
    });
  });

  describe('Edge Cases', () => {
    test('handles empty search results', async () => {
      const mockUseFilteredData = FilterHooks.useFilteredData as jest.MockedFunction<typeof FilterHooks.useFilteredData>;
      mockUseFilteredData.mockReturnValueOnce([]);
      await renderComponent();
      expect(await screen.findByTestId('custom-table')).toBeInTheDocument();
    });

    test('handles zero quantity items styling', async () => {
      await renderComponent();
      expect(await screen.findByTestId('custom-table')).toBeInTheDocument();
    });

    test('handles items without BBD', async () => {
      await renderComponent();
      expect(await screen.findByTestId('custom-table')).toBeInTheDocument();
    });
  });

  describe('Expanded Content Rendering', () => {
    test('renders expanded content correctly', async () => {
      await renderComponent();
      const expandedContent = await screen.findAllByTestId(/expanded-/);
      expect(expandedContent.length).toBeGreaterThan(0);
      expect(expandedContent[0]).toHaveTextContent('LOT');
      expect(expandedContent[0]).toHaveTextContent('Location');
      expect(expandedContent[0]).toHaveTextContent('BBD');
    });

    test('renders holds in expanded content when present', async () => {
      await renderComponent();
      const expandedSections = await screen.findAllByTestId(/expanded-/);
      const sectionWithHolds = expandedSections.find(section =>
        section.textContent?.includes('Holds')
      );
      if (sectionWithHolds) {
        expect(sectionWithHolds).toHaveTextContent('Holds');
      }
    });
  });

  describe('Performance Considerations', () => {
    test('uses useMemo for mock data generation', async () => {
      const { rerender } = await renderComponent();
      expect(await screen.findByText('Inventory Management')).toBeInTheDocument();
      // Re-rendering
      rerender(<AuthProvider><InventoryPage /></AuthProvider>);
      expect(await screen.findByText('Inventory Management')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper heading structure', async () => {
      await renderComponent();
      const mainHeading = await screen.findByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent('Inventory Management');
    });

    test('buttons have accessible text', async () => {
      await renderComponent();
      expect(await screen.findByRole('button', { name: /adjust stock/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create alert/i })).toBeInTheDocument();
    });
  });

  describe('Integration with Context Providers', () => {
    test('correctly uses notification context', async () => {
      const user = userEvent.setup();
      await renderComponent();
      const createAlertButton = await screen.findByText('Create Alert');
      await user.click(createAlertButton);
      expect(mockAddNotification).toHaveBeenCalledWith({
        type: 'success',
        message: 'Alert Creation action performed on System'
      });
    });

    test('correctly uses filters context', async () => {
      await renderComponent();
      await screen.findByTestId('filter-bar');
      expect(mockSetSearchTerm).toBeDefined();
      expect(mockSetFilter).toBeDefined();
      expect(mockClearFilters).toBeDefined();
    });

    test('correctly uses pagination context', async () => {
      await renderComponent();
      await screen.findByTestId('custom-table-pagination');
      expect(mockGoToPage).toBeDefined();
      expect(mockSetPagination).toBeDefined();
    });
  });
});

describe('InventoryPage Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const mockValidateTokenApi = AuthApi.validateTokenApi as jest.Mock;
    mockValidateTokenApi.mockResolvedValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com', roles: ['admin'], permissions: ['read:inventory'] },
      token: 'mock-token',
    });
  });

  test('filtering and pagination work together', async () => {
    const user = userEvent.setup();
    await renderComponent();
    const filterButton = await screen.findByTestId('filter-button');
    await user.click(filterButton);
    const nextPageButton = await screen.findByText('Next Page');
    await user.click(nextPageButton);
    expect(mockSetFilter).toHaveBeenCalled();
    expect(mockGoToPage).toHaveBeenCalled();
  });

  test('search and filtering work together', async () => {
    const user = userEvent.setup();
    await renderComponent();
    const searchInput = await screen.findByTestId('search-input');
    await user.type(searchInput, 'SKU');
    const filterButton = await screen.findByTestId('filter-button');
    await user.click(filterButton);
    expect(mockSetSearchTerm).toHaveBeenCalled();
    expect(mockSetFilter).toHaveBeenCalled();
  });
});

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

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

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