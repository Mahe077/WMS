"use client"

import { useCallback, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/app-context"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { navigationItems } from "@/lib/navigation-items"
import { Badge } from "@/components/ui/badge"

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
      <aside
        className={`
          fixed lg:top-18 top-17 lg:pt-2 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40
            transform transition-transform duration-300 ease-in-out
            flex flex-col
          ${state.sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Navigation Items - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {memoizedNavigationItems}
          </div>
        </div>

        {/* Fixed Logout Button at Bottom of Sidebar */}
        {/* Fixed User Information Section at Bottom of Screen */}
        <div
          className={`
          fixed bottom-0 left-0 w-64 bg-white border-t border-r border-gray-200 p-4 z-50
          transform transition-transform duration-300 ease-in-out
          shadow-lg
          ${state.sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <div className="flex items-center space-x-3">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {authState.user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">{authState.user?.name}</div>
              {/* <div className="text-xs text-gray-500 truncate">{authState.user?.email}</div> */}
              <div className="mt-1">
                <Badge variant="outline" className="text-xs capitalize">
                  {authState.user?.role}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors flex-shrink-0"
              onClick={() => {
                dispatch({ type: "SET_SIDEBAR_OPEN", payload: false });
                onShowLogoutDialog();
              }}
              title="Settings"
            >
              <LogOut className="h-4 w-4 mr-3 text-red-400" />
            </Button>
          </div>
        </div>
      </aside>

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
