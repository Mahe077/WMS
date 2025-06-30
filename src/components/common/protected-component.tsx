"use client"

import React from "react"
import { useAuth } from "@/contexts/auth-context"

interface ProtectedComponentProps {
  children: React.ReactNode
  requiredPermission?: string
  requiredRole?: string | string[]
  fallback?: React.ReactNode
  mode?: 'hide' | 'disable' | 'readonly'
}

// Simplified approach - wrapper-based protection
export function ProtectedComponent({
  children,
  requiredPermission,
  requiredRole,
  fallback = null,
  mode = 'hide'
}: ProtectedComponentProps) {
  const { can, hasRole } = useAuth()

  const hasPermission = !requiredPermission || can(requiredPermission)
  const hasRequiredRole = !requiredRole || hasRole(requiredRole)
  const isAuthorized = hasPermission && hasRequiredRole

  if (!isAuthorized) {
    if (mode === 'hide') {
      return <React.Fragment>{fallback}</React.Fragment>
    }
    
    if (mode === 'disable') {
      return (
        <div 
          className="opacity-50 cursor-not-allowed pointer-events-none"
          aria-disabled="true"
          title="You don't have permission to interact with this element"
        >
          {children}
        </div>
      )
    }
    
    if (mode === 'readonly') {
      return (
        <div 
          className="opacity-75 pointer-events-none"
          aria-readonly="true"
          title="This element is read-only"
        >
          {children}
        </div>
      )
    }
  }

  return <React.Fragment>{children}</React.Fragment>
}

// Better alternative: Wrapper components for specific element types
interface ProtectedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  requiredPermission?: string
  requiredRole?: string | string[]
  mode?: 'hide' | 'disable'
  fallback?: React.ReactNode
}

export function ProtectedButton({
  children,
  requiredPermission,
  requiredRole,
  mode = 'hide',
  fallback = null,
  ...buttonProps
}: ProtectedButtonProps) {
  const { can, hasRole } = useAuth()

  const hasPermission = !requiredPermission || can(requiredPermission)
  const hasRequiredRole = !requiredRole || hasRole(requiredRole)
  const isAuthorized = hasPermission && hasRequiredRole

  if (!isAuthorized) {
    if (mode === 'hide') {
      return <>{fallback}</>
    }
    if (mode === 'disable') {
      return (
        <button
          {...buttonProps}
          disabled={true}
          aria-disabled="true"
          className={`${buttonProps.className || ''} opacity-50 cursor-not-allowed`.trim()}
        >
          {children}
        </button>
      )
    }
  }

  return <button {...buttonProps}>{children}</button>
}

interface ProtectedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  requiredPermission?: string
  requiredRole?: string | string[]
  mode?: 'hide' | 'disable' | 'readonly'
  fallback?: React.ReactNode
}

export function ProtectedInput({
  requiredPermission,
  requiredRole,
  mode = 'hide',
  fallback = null,
  ...inputProps
}: ProtectedInputProps) {
  const { can, hasRole } = useAuth()

  const hasPermission = !requiredPermission || can(requiredPermission)
  const hasRequiredRole = !requiredRole || hasRole(requiredRole)
  const isAuthorized = hasPermission && hasRequiredRole

  if (!isAuthorized) {
    if (mode === 'hide') {
      return <>{fallback}</>
    }
    if (mode === 'disable') {
      return (
        <input
          {...inputProps}
          disabled={true}
          aria-disabled="true"
          className={`${inputProps.className || ''} opacity-50 cursor-not-allowed`.trim()}
        />
      )
    }
    if (mode === 'readonly') {
      return (
        <input
          {...inputProps}
          readOnly={true}
          aria-readonly="true"
          className={`${inputProps.className || ''} opacity-75`.trim()}
        />
      )
    }
  }

  return <input {...inputProps} />
}

// Render prop pattern for maximum flexibility
interface AuthorizeProps {
  permission?: string
  role?: string | string[]
  children: (isAuthorized: boolean) => React.ReactNode
}

export function Authorize({ permission, role, children }: AuthorizeProps) {
  const { can, hasRole } = useAuth()

  const hasPermission = !permission || can(permission)
  const hasRequiredRole = !role || hasRole(role)
  const isAuthorized = hasPermission && hasRequiredRole

  return <>{children(isAuthorized)}</>
}

// Hook for inline authorization checks
export function usePermissions() {
  const { can, hasRole } = useAuth()
  
  return {
    can,
    hasRole,
    canAny: (permissions: string[]) => permissions.some(permission => can(permission)),
    hasAnyRole: (roles: string[]) => roles.some(role => hasRole(role)),
    canAll: (permissions: string[]) => permissions.every(permission => can(permission)),
    hasAllRoles: (roles: string[]) => roles.every(role => hasRole(role))
  }
}

// Conditional wrapper for complex logic
interface ConditionalWrapperProps {
  condition: boolean
  wrapper: (children: React.ReactNode) => React.ReactElement
  children: React.ReactNode
}

export function ConditionalWrapper({ condition, wrapper, children }: ConditionalWrapperProps) {
  return condition ? wrapper(children) : <>{children}</>
}

// Example: Enhanced Table with column-level permissions
interface ProtectedTableColumn<T> {
  key: string
  label: string
  permission?: string
  role?: string | string[]
  render: (item: T) => React.ReactNode
}

interface ProtectedTableProps<T> {
  columns: ProtectedTableColumn<T>[]
  data: T[]
  className?: string
}

export function ProtectedTable<T>({ columns, data, className }: ProtectedTableProps<T>) {
  const { can, hasRole } = useAuth()
  
  // Filter columns based on permissions
  const visibleColumns = columns.filter(column => {
    if (column.permission && !can(column.permission)) return false
    if (column.role && !hasRole(column.role)) return false
    return true
  })

  return (
    <table className={className}>
      <thead>
        <tr>
          {visibleColumns.map(column => (
            <th key={column.key}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {visibleColumns.map(column => (
              <td key={column.key}>{column.render(item)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// Example: Action buttons with different permission levels
interface ActionButtonProps {
  permission?: string
  role?: string | string[]
  variant?: 'primary' | 'secondary' | 'danger'
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function ActionButton({ 
  permission, 
  role, 
  variant = 'primary', 
  children, 
  onClick,
  className = ''
}: ActionButtonProps) {
  const { can, hasRole } = useAuth()
  
  const hasPermission = !permission || can(permission)
  const hasRequiredRole = !role || hasRole(role)
  const isAuthorized = hasPermission && hasRequiredRole

  if (!isAuthorized) {
    return null // Hide unauthorized actions completely
  }

  const baseStyles = 'px-4 py-2 rounded font-medium'
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  }

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

// Example usage patterns:

/*
// 1. Type-safe component-specific protection
function UserActions({ user }) {
  return (
    <div className="flex gap-2">
      <ProtectedButton 
        requiredPermission="edit_users"
        mode="disable"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => editUser(user.id)}
      >
        Edit User
      </ProtectedButton>
      
      <ProtectedButton 
        requiredRole="admin"
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={() => deleteUser(user.id)}
      >
        Delete User
      </ProtectedButton>
    </div>
  )
}

// 2. Flexible render prop pattern
function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      
      <Authorize permission="view_personal_info">
        {(canView) => canView && (
          <div>
            <p>Phone: {user.phone}</p>
            <p>Address: {user.address}</p>
          </div>
        )}
      </Authorize>
      
      <Authorize permission="edit_profile">
        {(canEdit) => (
          <button 
            disabled={!canEdit}
            className={canEdit ? 'bg-blue-500' : 'bg-gray-400'}
          >
            {canEdit ? 'Edit Profile' : 'No Edit Permission'}
          </button>
        )}
      </Authorize>
    </div>
  )
}

// 3. Conditional table columns (same as before)
const userTableColumns: ProtectedTableColumn[] = [
  { key: 'name', label: 'Name', render: (user) => user.name },
  { key: 'email', label: 'Email', render: (user) => user.email },
  { 
    key: 'salary', 
    label: 'Salary', 
    permission: 'view_salaries',
    render: (user) => `${user.salary}` 
  },
  { 
    key: 'actions', 
    label: 'Actions', 
    role: 'admin',
    render: (user) => (
      <div className="flex gap-2">
        <ActionButton permission="edit_users">Edit</ActionButton>
        <ActionButton permission="delete_users" variant="danger">Delete</ActionButton>
      </div>
    )
  }
]

// 4. Form with protected fields
function UserForm({ user }) {
  return (
    <form>
      <ProtectedInput
        name="email"
        defaultValue={user.email}
        requiredPermission="edit_user_email"
        mode="readonly"
        className="border rounded px-3 py-2"
      />
      
      <ProtectedInput
        name="salary"
        type="number"
        defaultValue={user.salary}
        requiredRole={['admin', 'hr']}
        mode="disable"
        className="border rounded px-3 py-2"
      />
      
      <Authorize permission="submit_user_changes">
        {(canSubmit) => (
          <button 
            type="submit"
            disabled={!canSubmit}
            className={`px-4 py-2 rounded ${
              canSubmit ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
            }`}
          >
            Save Changes
          </button>
        )}
      </Authorize>
    </form>
  )
}

// 5. Complex authorization logic
function Dashboard() {
  const { can, hasRole, canAny } = usePermissions()
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Show widget if user has any of these permissions *//*
      {canAny(['view_analytics', 'view_reports']) && (
        <AnalyticsWidget />
      )}
      
      {/* Different content based on role *//*
      {hasRole('admin') && <AdminPanel />}
      {hasRole('manager') && <ManagerPanel />}
      {hasRole('employee') && <EmployeePanel />}
      
      {/* Conditional styling based on permissions */ /*
      <div className={can('manage_users') ? 'border-blue-500' : 'border-gray-300'}>
        <UserList />
      </div>
    </div>
  )
}
*/