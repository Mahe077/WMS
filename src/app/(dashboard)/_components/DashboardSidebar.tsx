"use client"

import { useCallback, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/app-context"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { navigationItems } from "@/lib/navigation-items"

interface DashboardSidebarProps {
  onShowLogoutDialog: () => void;
}

export function DashboardSidebar({ onShowLogoutDialog }: DashboardSidebarProps) {
  const { state, dispatch } = useApp();
  const { state: authState, can } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleModuleChange = useCallback((href: string) => {
    router.push(href);
    dispatch({ type: "SET_SIDEBAR_OPEN", payload: false });
  }, [router, dispatch]);

  const memoizedNavigationItems = useMemo(() => {
    return navigationItems.map((item) => {
      const hasPermission = !item.permission || can(item.permission);
      const hasRequiredRole = !item.role || (authState.user && item.role.includes(authState.user.role));

      if (!hasPermission || !hasRequiredRole) return null;

      return (
        <Button
          key={item.id}
          variant={pathname.startsWith(item.href) ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleModuleChange(item.href)}
        >
          <item.icon className="h-4 w-4 mr-3" />
          {item.label}
        </Button>
      );
    });
  }, [pathname, can, authState.user, handleModuleChange]);

  return (
    <>
      <nav
        className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${state.sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-4 pt-20 lg:pt-4">
          <div className="space-y-1">
            {memoizedNavigationItems}
          </div>

          {/* Mobile-only logout section */}
          <div className="pt-6 mt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => {
                dispatch({ type: "SET_SIDEBAR_OPEN", payload: false });
                onShowLogoutDialog();
              }}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {state.sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => dispatch({ type: "SET_SIDEBAR_OPEN", payload: false })}
        />
      )}
    </>
  );
}
