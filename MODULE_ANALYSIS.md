# Module Analysis and Refactoring Suggestions

This document provides an analysis of the current modular architecture of the WMS-FE application and offers suggestions for improvement to align with a more scalable and maintainable structure.

## Module Analysis

The application generally follows a feature-based modular architecture, which is a good foundation for scalability and maintainability. However, there are still areas where further refinement can enhance clarity, reduce coupling, and improve adherence to best practices.

### Detected Issues and Current State

1.  **Improper Separation of Concerns**:
    *   **`AuthContext` Overload**: The `AuthContext` (`src/contexts/auth-context.tsx`) previously handled too many responsibilities (authentication state, API calls, token management, routing). This has been partially addressed by moving `AuthContext` to `src/providers/auth-provider.tsx` and extracting API calls and types to `src/features/auth/api` and `src/features/auth/types` respectively. The `useAuth` hook now provides a cleaner interface.
    *   **Dashboard Layout Modularization**: The `src/app/(dashboard)/layout.tsx` file has been successfully modularized. The main logic, state management, header, and sidebar have been extracted into dedicated components (`DashboardLayoutClient.tsx`, `DashboardHeader.tsx`, `DashboardSidebar.tsx`) within `src/app/(dashboard)/_components/`. This significantly improves separation of concerns and readability for the dashboard layout.
    *   **`page.tsx` as a Controller (Historical)**: The original `page.tsx` (likely `src/app/page.tsx` or an older pattern) used to act as a controller with a large `switch` statement for rendering modules. With the adoption of Next.js App Router, this issue is largely mitigated as routing is handled by the file-system based routing, and each `page.tsx` is responsible for its own content.

2.  **Overlaps or Coupling Between Modules**:
    *   **`AuthContext` and `app-context`**: There remains a dependency between `AuthContext` (now `AuthProvider`) and `useNotifications` from `app-context`. While necessary for displaying notifications related to auth actions, this still represents a direct coupling between two distinct contexts. Consider a more generic event/notification system if this becomes problematic.

3.  **Ambiguous or “Catch-All” Files/Folders**:
    *   **`lib/types`**: The `src/lib/types` folder still contains a general `index.ts` exporting various types. While some shared types are acceptable, many types could be more appropriately co-located with the features they belong to (e.g., `customer.types.ts` could potentially move closer to a `customer` feature).
    *   **`lib/const.ts` and `lib/enum.ts`**: These files centralize constants and enums. While useful, ensure that constants/enums highly specific to a single feature are moved into that feature's directory.

4.  **Unused or Redundant Modules**:
    *   **Simulated Logic**: The forgot password flow still appears to be largely simulated on the frontend, with backend API calls commented out. This indicates incomplete functionality or placeholder logic.

## Suggested Folder Restructure (Current State and Recommendations)

The project largely adheres to a feature-based structure, which is good. The `_components` convention within route segments (`src/app/(dashboard)/_components/`) is a valid and common pattern for internal components.

```
/src
├── /app
│   ├── (dashboard)               # Next.js app router route group for dashboard
│   │   ├── _components           # Internal components specific to dashboard layout/pages
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── DashboardSidebar.tsx
│   │   │   └── DashboardLayoutClient.tsx
│   │   ├── layout.tsx            # Thin wrapper for DashboardLayoutClient
│   │   └── ... (other dashboard pages/routes)
│   ├── (features)                # Other Next.js app router routes (e.g., login, access-denied)
│   │   ├── /inventory
│   │   ├── /login
│   │   └── ...
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Root page
├── /components
│   ├── /common                   # Reusable components used across multiple features
│   ├── /ui                       # Reusable UI primitives (Button, Input, etc.)
├── /contexts                     # Global React Contexts (e.g., app-context)
├── /features                     # Feature-specific logic and components
│   ├── /auth
│   │   ├── /api                  # API calls for authentication
│   │   ├── /hooks                # Auth-related hooks
│   │   └── /types                # Auth-related types
│   ├── /inventory
│   │   ├── /components           # Inventory-specific components
│   │   ├── /data                 # Mock/sample data for inventory
│   │   └── /types                # Inventory-specific types
│   └── ... (similar structure for other features)
├── /hooks                        # Common custom hooks (e.g., use-filters, use-mobile)
├── /lib
│   ├── /auth                     # Core auth logic (e.g., permissions.ts)
│   ├── /pdf                      # PDF generation utilities
│   ├── /types                    # Shared/global types (minimize usage)
│   ├── const.ts                  # Global constants
│   ├── enum.ts                   # Global enums
│   ├── navigation-items.ts       # Centralized navigation data
│   └── utils.ts                  # Generic utility functions
├── /providers                    # All application providers (Auth, App, etc.)
```

## Code Refactor Suggestions

1.  **Refine Type Co-location**: Review `src/lib/types` and move types that are exclusively used by a single feature into that feature's `types` subdirectory (e.g., `src/features/inventory/types/inventory.types.ts`). Keep only truly global or widely shared types in `src/lib/types`.

2.  **Complete Simulated Logic**: Prioritize completing the backend integration for simulated flows (e.g., forgot password) to ensure full functionality and remove misleading placeholder logic.

3.  **Review Global Constants/Enums**: While `src/lib/const.ts` and `src/lib/enum.ts` are useful, periodically review them to ensure that items are truly global. If a constant or enum is only used within one feature, consider moving it to that feature's directory.

By continuing to refine these areas, the WMS-FE application will further enhance its modularity, making it more robust, easier to understand, and more efficient to develop and maintain.