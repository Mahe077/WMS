"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Shield, Edit } from "lucide-react"
import { UserView } from "./user-management-module/users-view"
import { User } from "@/lib/types"

export function UserManagementModule() {
  const [selectedView, setSelectedView] = useState("users")

  const users = [
    {
      id: "USR-001",
      name: "John Doe",
      email: "john.doe@company.com",
      role: "Admin",
      status: "Active",
      lastLogin: "2024-01-15 14:30",
      modules: ["All Modules"],
    },
    {
      id: "USR-002",
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      role: "Manager",
      status: "Active",
      lastLogin: "2024-01-15 12:15",
      modules: ["Receiving", "Inventory", "Orders", "Reports"],
    },
    {
      id: "USR-003",
      name: "Mike Wilson",
      email: "mike.w@company.com",
      role: "Picker",
      status: "Active",
      lastLogin: "2024-01-15 09:45",
      modules: ["Orders", "Inventory"],
    },
    {
      id: "USR-004",
      name: "Lisa Chen",
      email: "lisa.c@company.com",
      role: "Forklift Driver",
      status: "Inactive",
      lastLogin: "2024-01-14 16:20",
      modules: ["Receiving", "Dispatch"],
    },
  ]

  const roles = [
    {
      id: "admin",
      name: "Admin",
      description: "Full system access with all permissions",
      permissions: ["All Modules", "User Management", "System Settings"],
      userCount: 2,
    },
    {
      id: "manager",
      name: "Manager",
      description: "Supervisory access to operational modules",
      permissions: ["Receiving", "Inventory", "Orders", "Dispatch", "Returns", "Reports"],
      userCount: 5,
    },
    {
      id: "picker",
      name: "Picker",
      description: "Order fulfillment and inventory access",
      permissions: ["Orders", "Inventory (Read-only)"],
      userCount: 12,
    },
    {
      id: "forklift",
      name: "Forklift Driver",
      description: "Receiving and dispatch operations",
      permissions: ["Receiving", "Dispatch", "Inventory (Read-only)"],
      userCount: 8,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <Shield className="h-4 w-4 mr-2" />
            Manage Roles
          </Button>
          <Button className="w-full sm:w-auto">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedView === "users" ? "default" : "outline"}
          onClick={() => setSelectedView("users")}
          size="sm"
        >
          Users
        </Button>
        <Button
          variant={selectedView === "roles" ? "default" : "outline"}
          onClick={() => setSelectedView("roles")}
          size="sm"
        >
          Roles & Permissions
        </Button>
        <Button
          variant={selectedView === "activity" ? "default" : "outline"}
          onClick={() => setSelectedView("activity")}
          size="sm"
        >
          Activity Log
        </Button>
      </div>

      {selectedView === "users" && (
        <UserView
          users={users}
        />
      )}

      {selectedView === "roles" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New User</CardTitle>
              <CardDescription>Add a new user to the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter last name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="user@company.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="picker">Picker</SelectItem>
                    <SelectItem value="forklift">Forklift Driver</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input id="password" type="password" placeholder="Generate or enter password" />
              </div>

              <Button className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Create User
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Role Definitions
              </CardTitle>
              <CardDescription>System roles and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles.map((role) => (
                  <div key={role.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{role.name}</h4>
                        <Badge variant="outline">{role.userCount} users</Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedView === "activity" && (
        <Card>
          <CardHeader>
            <CardTitle>User Activity Log</CardTitle>
            <CardDescription>Recent user actions and system access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">John Doe logged in</div>
                  <div className="text-sm text-gray-600">Admin • 2024-01-15 14:30</div>
                </div>
                <Badge variant="outline">Login</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Sarah Johnson processed order ORD-2024-001</div>
                  <div className="text-sm text-gray-600">Manager • 2024-01-15 13:45</div>
                </div>
                <Badge variant="secondary">Order Processing</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Mike Wilson updated inventory for SKU-12345</div>
                  <div className="text-sm text-gray-600">Picker • 2024-01-15 12:20</div>
                </div>
                <Badge variant="default">Inventory Update</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Lisa Chen failed login attempt</div>
                  <div className="text-sm text-gray-600">Forklift Driver • 2024-01-15 11:15</div>
                </div>
                <Badge variant="destructive">Failed Login</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
