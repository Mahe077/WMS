import { User } from "../types";

//permission checking functions
export function can(user: User | null, permission: string): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  return user.permissions.includes(permission);
}

// Check if user has a specific role or one of multiple roles
export function hasRole(user: User | null, role: string | string[]): boolean {
  if (!user) return false;
  if (Array.isArray(role)) return role.includes(user.role);
  return user.role === role;
}
