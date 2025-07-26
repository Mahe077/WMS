
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { WarehouseSelector } from './warehouse-selector';
import { useWarehouse, WarehouseItem } from '@/contexts/warehouse-context';

// Mock the useWarehouse hook
jest.mock('@/contexts/warehouse-context', () => ({
  useWarehouse: jest.fn(),
}));

const mockWarehouses: WarehouseItem[] = [
  {
    id: 'WH001',
    name: 'Main Distribution Center',
    location: 'Atlanta, GA',
    code: 'ATL-DC',
    status: 'active',
    capacity: 50000,
    currentLoad: 32500,
    staff: 45,
  },
  {
    id: 'WH002',
    name: 'West Coast Hub',
    location: 'Los Angeles, CA',
    code: 'LAX-HUB',
    status: 'active',
    capacity: 35000,
    currentLoad: 28900,
    staff: 32,
  },
  {
    id: 'WH003',
    name: 'Northeast Facility',
    location: 'Newark, NJ',
    code: 'EWR-FAC',
    status: 'maintenance',
    capacity: 42000,
    currentLoad: 18750,
    staff: 38,
  },
];

describe('WarehouseSelector', () => {
  const mockHandleWarehouseSelect = jest.fn();

  beforeEach(() => {
    (useWarehouse as jest.Mock).mockReturnValue({
      selectedWarehouse: mockWarehouses[0],
      warehouses: mockWarehouses,
      handleWarehouseSelect: mockHandleWarehouseSelect,
      canViewAllWarehouses: false, // Default to false for most tests
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the selected warehouse correctly', () => {
    render(<WarehouseSelector />);
    expect(screen.getByText('Main Distribution Center')).toBeInTheDocument();
    expect(screen.getByText('ATL-DC')).toBeInTheDocument();
    expect(screen.getByText('Atlanta, GA')).toBeInTheDocument();
  });

  it('opens and closes the dropdown on button click', () => {
    render(<WarehouseSelector />);
    const selectorButton = screen.getByRole('button', { name: /Main Distribution Center/i });

    // Open dropdown
    fireEvent.click(selectorButton);
    expect(screen.getByText('Select Warehouse')).toBeInTheDocument(); // Header of the dropdown

    // Close dropdown by clicking outside (simulated by another click on the button)
    fireEvent.click(selectorButton);
    expect(screen.queryByText('Select Warehouse')).not.toBeInTheDocument();
  });

  it('calls handleWarehouseSelect when an active warehouse is clicked', () => {
    render(<WarehouseSelector />);
    fireEvent.click(screen.getByRole('button', { name: /Main Distribution Center/i })); // Open dropdown

    const westCoastHub = screen.getByText('West Coast Hub');
    fireEvent.click(westCoastHub);

    expect(mockHandleWarehouseSelect).toHaveBeenCalledTimes(1);
    expect(mockHandleWarehouseSelect).toHaveBeenCalledWith(mockWarehouses[1]);
  });

  it('does not call handleWarehouseSelect when a maintenance warehouse is clicked', () => {
    render(<WarehouseSelector />);
    fireEvent.click(screen.getByRole('button', { name: /Main Distribution Center/i })); // Open dropdown

    const northeastFacility = screen.getByText('Northeast Facility');
    fireEvent.click(northeastFacility);

    expect(mockHandleWarehouseSelect).not.toHaveBeenCalled();
  });

  it('does not render if there is only one warehouse', () => {
    (useWarehouse as jest.Mock).mockReturnValue({
      selectedWarehouse: mockWarehouses[0],
      warehouses: [mockWarehouses[0]], // Only one warehouse
      handleWarehouseSelect: mockHandleWarehouseSelect,
      canViewAllWarehouses: false,
    });
    const { container } = render(<WarehouseSelector />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders "All Warehouses" option if canViewAllWarehouses is true', () => {
    (useWarehouse as jest.Mock).mockReturnValue({
      selectedWarehouse: mockWarehouses[0],
      warehouses: mockWarehouses,
      handleWarehouseSelect: mockHandleWarehouseSelect,
      canViewAllWarehouses: true,
    });
    render(<WarehouseSelector />);
    fireEvent.click(screen.getByRole('button', { name: /Main Distribution Center/i })); // Open dropdown
    expect(screen.getByText('All Warehouses')).toBeInTheDocument();
  });

  it('does not render "All Warehouses" option if canViewAllWarehouses is false', () => {
    (useWarehouse as jest.Mock).mockReturnValue({
      selectedWarehouse: mockWarehouses[0],
      warehouses: mockWarehouses,
      handleWarehouseSelect: mockHandleWarehouseSelect,
      canViewAllWarehouses: false,
    });
    render(<WarehouseSelector />);
    fireEvent.click(screen.getByRole('button', { name: /Main Distribution Center/i })); // Open dropdown
    expect(screen.queryByText('All Warehouses')).not.toBeInTheDocument();
  });

  it(`calls handleWarehouseSelect with 'all' when "All Warehouses" is clicked`, () => {
    (useWarehouse as jest.Mock).mockReturnValue({
      selectedWarehouse: mockWarehouses[0],
      warehouses: mockWarehouses,
      handleWarehouseSelect: mockHandleWarehouseSelect,
      canViewAllWarehouses: true,
    });
    render(<WarehouseSelector />);
    fireEvent.click(screen.getByRole('button', { name: /Main Distribution Center/i })); // Open dropdown
    fireEvent.click(screen.getByText('All Warehouses'));
    expect(mockHandleWarehouseSelect).toHaveBeenCalledWith('all');
  });

  it(`displays "All Warehouses" as selected when 'all' is the selectedWarehouse`, () => {
    (useWarehouse as jest.Mock).mockReturnValue({
      selectedWarehouse: 'all',
      warehouses: mockWarehouses,
      handleWarehouseSelect: mockHandleWarehouseSelect,
      canViewAllWarehouses: true,
    });
    render(<WarehouseSelector />);
    expect(screen.getByText('All Warehouses')).toBeInTheDocument();
    expect(screen.queryByText('ATL-DC')).not.toBeInTheDocument(); // Should not show specific warehouse code
  });
});
