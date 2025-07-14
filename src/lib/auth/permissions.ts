
import { User } from "@/features/auth/types";
import { modulePermissions } from "../module-permissions";

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

export function findFirstAllowedModule(user: User | null): string {
  if (!user) return "/login";

  // Prioritize dashboard if accessible
  if (can(user, modulePermissions["/dashboard"])) {
    return "/dashboard";
  }
  
  // Iterate through other modules in a defined order
  const orderedModules = [
    "/dispatch",
    "/receiving",
    "/inventory",
    "/dock-scheduling",
    "/order-fulfillment",
    "/reports",
    "/returns",
    "/user-management",
  ] as Array<keyof typeof modulePermissions>;

  for (const modulePath of orderedModules) {
    const requiredPermission = modulePermissions[modulePath];
    if (requiredPermission && can(user, requiredPermission)) {
      return modulePath;
    }
  }

  // Fallback if no module is accessible (e.g., user has no permissions)
  return "/access-denied";
}
