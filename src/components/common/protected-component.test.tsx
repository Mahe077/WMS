"use client";

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Authorize, ProtectedButton, ProtectedComponent, ProtectedInput, usePermissions } from './protected-component';
import { useAuth } from '@/features/auth/hooks/useAuth';

// Mock useAuth from the auth-context module (not from protected-component)
jest.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.Mock;

// Helper to set up the mock for useAuth
const setupMockAuth = (permissions: string[], roles: string[]) => {
  mockUseAuth.mockReturnValue({
    state: {
      isAuthenticated: true,
      user: { id: '1', name: 'Test User', email: 'test@test.com', permissions, roles },
      loading: false,
      error: null,
    },
    login: jest.fn(),
    logout: jest.fn(),
    can: (permission: string) => permissions.includes(permission),
    hasRole: (role: string | string[]) => {
      if (Array.isArray(role)) {
        return role.every(r => roles.includes(r));
      }
      return roles.includes(role);
    },
  });
};

describe('Protected Components & Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- ProtectedComponent Tests ---
  describe('ProtectedComponent', () => {
    it('renders children when authorized', () => {
      setupMockAuth(['view_dashboard'], ['user']);
      render(
        <ProtectedComponent requiredPermission="view_dashboard">
          <div>Authorized Content</div>
        </ProtectedComponent>
      );
      expect(screen.getByText('Authorized Content')).toBeInTheDocument();
    });

    it('hides children when not authorized (mode: hide)', () => {
      setupMockAuth([], []);
      render(
        <ProtectedComponent requiredPermission="view_dashboard">
          <div>Authorized Content</div>
        </ProtectedComponent>
      );
      expect(screen.queryByText('Authorized Content')).not.toBeInTheDocument();
    });

    it('renders fallback when not authorized (mode: hide)', () => {
      setupMockAuth([], []);
      render(
        <ProtectedComponent requiredPermission="view_dashboard" fallback={<div>Fallback</div>}>
          <div>Authorized Content</div>
        </ProtectedComponent>
      );
      expect(screen.getByText('Fallback')).toBeInTheDocument();
      expect(screen.queryByText('Authorized Content')).not.toBeInTheDocument();
    });

    it('disables children when not authorized (mode: disable)', () => {
      setupMockAuth([], []);
      const { container } = render(
        <ProtectedComponent requiredPermission="view_dashboard" mode="disable">
          <div>Authorized Content</div>
        </ProtectedComponent>
      );
      expect(screen.getByText('Authorized Content')).toBeInTheDocument();
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
      expect(wrapper).toHaveAttribute('aria-disabled', 'true');
    });

    it('makes children readonly when not authorized (mode: readonly)', () => {
      setupMockAuth([], []);
      const { container } = render(
        <ProtectedComponent requiredPermission="view_dashboard" mode="readonly">
          <div>Authorized Content</div>
        </ProtectedComponent>
      );
      expect(screen.getByText('Authorized Content')).toBeInTheDocument();
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('opacity-75', 'pointer-events-none');
      expect(wrapper).toHaveAttribute('aria-readonly', 'true');
    });
  });

  // --- ProtectedButton Tests ---
  describe('ProtectedButton', () => {
    it('renders button when authorized', () => {
      setupMockAuth(['click_button'], ['user']);
      render(<ProtectedButton requiredPermission="click_button">Click Me</ProtectedButton>);
      expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Click Me' })).not.toBeDisabled();
    });

    it('hides button when not authorized (mode: hide)', () => {
      setupMockAuth([], []);
      render(<ProtectedButton requiredPermission="click_button">Click Me</ProtectedButton>);
      expect(screen.queryByRole('button', { name: 'Click Me' })).not.toBeInTheDocument();
    });

    it('disables button when not authorized (mode: disable)', () => {
      setupMockAuth([], []);
      render(<ProtectedButton requiredPermission="click_button" mode="disable">Click Me</ProtectedButton>);
      const button = screen.getByRole('button', { name: 'Click Me' });
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });

  // --- ProtectedInput Tests ---
  describe('ProtectedInput', () => {
    it('renders input when authorized', () => {
      setupMockAuth(['edit_field'], ['user']);
      render(<ProtectedInput requiredPermission="edit_field" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toBeInTheDocument();
      expect(input).not.toBeDisabled();
      expect(input).not.toHaveAttribute('readonly');
    });

    it('hides input when not authorized (mode: hide)', () => {
      setupMockAuth([], []);
      render(<ProtectedInput requiredPermission="edit_field" data-testid="input" />);
      expect(screen.queryByTestId('input')).not.toBeInTheDocument();
    });

    it('disables input when not authorized (mode: disable)', () => {
      setupMockAuth([], []);
      render(<ProtectedInput requiredPermission="edit_field" mode="disable" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toBeInTheDocument();
      expect(input).toBeDisabled();
    });

    it('makes input readonly when not authorized (mode: readonly)', () => {
      setupMockAuth([], []);
      render(<ProtectedInput requiredPermission="edit_field" mode="readonly" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('readonly');
    });
  });

  // --- Authorize (Render Prop) Tests ---
  describe('Authorize (Render Prop)', () => {
    it('calls children with true when authorized', () => {
      setupMockAuth(['view_secret'], []);
      render(
        <Authorize permission="view_secret">
          {(isAuthorized) => <div>{isAuthorized ? 'Authorized' : 'Not Authorized'}</div>}
        </Authorize>
      );
      expect(screen.getByText('Authorized')).toBeInTheDocument();
    });

    it('calls children with false when not authorized', () => {
      setupMockAuth([], []);
      render(
        <Authorize permission="view_secret">
          {(isAuthorized) => <div>{isAuthorized ? 'Authorized' : 'Not Authorized'}</div>}
        </Authorize>
      );
      expect(screen.getByText('Not Authorized')).toBeInTheDocument();
    });
  });

  // --- usePermissions Hook Tests ---
  describe('usePermissions Hook', () => {
    const TestComponent = () => {
      const { can, hasRole, canAny, hasAnyRole, canAll, hasAllRoles } = usePermissions();
      return (
        <div>
          <div data-testid="can-edit">{can('edit') ? 'yes' : 'no'}</div>
          <div data-testid="hasRole-admin">{hasRole('admin') ? 'yes' : 'no'}</div>
          <div data-testid="canAny-edit-view">{canAny(['edit', 'view']) ? 'yes' : 'no'}</div>
          <div data-testid="hasAnyRole-admin-manager">{hasAnyRole(['admin', 'manager']) ? 'yes' : 'no'}</div>
          <div data-testid="canAll-edit-view">{canAll(['edit', 'view']) ? 'yes' : 'no'}</div>
          <div data-testid="hasAllRoles-admin-manager">{hasAllRoles(['admin', 'manager']) ? 'yes' : 'no'}</div>
        </div>
      );
    };

    it('returns correct values based on permissions and roles', () => {
      setupMockAuth(['edit', 'view'], ['admin']);
      render(<TestComponent />);

      expect(screen.getByTestId('can-edit')).toHaveTextContent('yes');
      expect(screen.getByTestId('hasRole-admin')).toHaveTextContent('yes');
      expect(screen.getByTestId('canAny-edit-view')).toHaveTextContent('yes');
      expect(screen.getByTestId('hasAnyRole-admin-manager')).toHaveTextContent('yes');
      expect(screen.getByTestId('canAll-edit-view')).toHaveTextContent('yes');
      expect(screen.getByTestId('hasAllRoles-admin-manager')).toHaveTextContent('no');
    });

    it('returns correct values when user has partial permissions/roles', () => {
        setupMockAuth(['view'], ['manager']);
        render(<TestComponent />);
  
        expect(screen.getByTestId('can-edit')).toHaveTextContent('no');
        expect(screen.getByTestId('hasRole-admin')).toHaveTextContent('no');
        expect(screen.getByTestId('canAny-edit-view')).toHaveTextContent('yes');
        expect(screen.getByTestId('hasAnyRole-admin-manager')).toHaveTextContent('yes');
        expect(screen.getByTestId('canAll-edit-view')).toHaveTextContent('no');
        expect(screen.getByTestId('hasAllRoles-admin-manager')).toHaveTextContent('no');
      });
  });
});