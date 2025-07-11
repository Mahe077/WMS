# Module Analysis and Refactoring Suggestions

This document provides an analysis of the current modular architecture of the WMS-FE application and offers suggestions for improvement to align with a more scalable and maintainable structure.

## Module Analysis

The current architecture has a decent separation of concerns, but there are areas where the lines are blurred, leading to potential maintenance challenges as the application grows.

### Detected Issues

1.  **Improper Separation of Concerns**:
    *   **`AuthContext` Overload**: The `AuthContext` (`src/contexts/auth-context.tsx`) handles too many responsibilities. It manages authentication state, API calls for login and password reset, token management, and routing. This entangles UI logic (routing), business logic (authentication), and network logic (API calls).
    *   **Component-Level Fetching**: Components like `LoginPage` and `ForgotPasswordPage` contain logic for handling user input and form submission, but the actual API calls are abstracted away in `AuthContext`. This is a good first step, but the context itself is doing too much.
    *   **`page.tsx` as a Controller**: The main `page.tsx` acts as a controller, deciding which module to render based on the application state. It also contains hardcoded data for the dashboard. This mixes presentation logic with data provisioning.

2.  **Overlaps or Coupling Between Modules**:
    *   **`AuthContext` and `app-context`**: There's a dependency between `AuthContext` and `useNotifications` from `app-context`. While this is for showing notifications, it creates coupling between two different contexts.
    *   **Hardcoded Module Rendering**: The main `page.tsx` has a large `switch` statement to render modules. This creates a tight coupling between the main page and all the feature modules. Adding a new module requires modifying this file.

3.  **Ambiguous or “Catch-All” Files**:
    *   **`lib/api/auth.ts`**: This file is well-named, but as the application grows, having a single `api` folder under `lib` could become a dumping ground for all API-related functions. It would be better to organize API calls by feature.
    *   **`lib/types`**: The `lib/types` folder is a good start, but having a single `index.ts` to export all types can become unwieldy. It's better to have type files co-located with the features they belong to.

4.  **Unused or Redundant Modules**:
    *   **Duplicate `custom-table.tsx`**: As mentioned in a previous analysis, there is a duplicate `custom-table.tsx` component. This should be consolidated.
    *   **Simulated Logic**: The forgot password flow is entirely simulated on the frontend. The backend API calls are commented out, and the logic is not functional.

## Suggested Folder Restructure

To improve scalability and maintainability, I propose a feature-based folder structure. This structure co-locates all the code related to a specific feature in one place, making it easier to find and modify.

```
/src
├── /app
│   ├── (features)                # Next.js app router routes
│   │   ├── /dashboard
│   │   ├── /inventory
│   │   ├── /login
│   │   └── ... (other feature routes)
│   ├── layout.tsx
│   └── page.tsx                  # Main entry point
├── /components
│   └── /ui                       # Reusable UI components (Button, Input, etc.)
├── /features                     # Feature-specific logic and components
│   ├── /auth
│   │   ├── /api                  # API calls for authentication
│   │   ├── /components           # Auth-related components (LoginForm, etc.)
│   │   ├── /hooks                # Auth-related hooks
│   │   └── /types                # Auth-related types
│   ├── /inventory
│   │   └── ... (similar structure for other features)
├── /lib
│   ├── /auth.ts                  # Core auth logic (permissions, etc.)
│   ├── /utils.ts                 # Generic utility functions
├── /providers                    # All application providers (Auth, App, etc.)
└── /hooks                        # Common hooks (use-local-storage, etc.)
```

## Code Refactor Suggestions

Based on the suggested folder restructure, here are some specific code refactoring suggestions:

1.  **Refactor `AuthContext`**:
    *   **Move API calls**: Move the `loginApi`, `resetPasswordApi`, and `validateTokenApi` calls from `AuthContext` to `src/features/auth/api/index.ts`.
    *   **Create `useAuth` hook**: Create a custom hook `src/features/auth/hooks/useAuth.ts` that encapsulates the logic for interacting with the `AuthContext` and making API calls. The components will use this hook instead of directly interacting with the context.
    *   **Simplify `AuthProvider`**: The `AuthProvider` in `src/providers/auth-provider.tsx` should only be responsible for managing the authentication state (user, token, isAuthenticated). The business logic should be in the `useAuth` hook.

2.  **Decouple `page.tsx`**:
    *   **Use a routing solution**: Instead of a giant `switch` statement, use a more dynamic routing solution. The Next.js app router already handles this. The main `page.tsx` should be a simple layout, and the feature modules should be rendered as separate pages.
    *   **Fetch data in components**: The dashboard data should be fetched within the `DashboardModule` component, not in the main `page.tsx`.

3.  **Organize API Calls**:
    *   Create separate API files for each feature under `src/features/<feature>/api`. For example, `src/features/inventory/api/index.ts` would contain all API calls related to inventory.

4.  **Co-locate Types**:
    *   Move the type definitions from `src/lib/types` to the feature folders they belong to. For example, `User` and `Auth` related types should be in `src/features/auth/types/index.ts`.

By implementing these changes, the WMS-FE application will have a more robust and scalable architecture, making it easier to maintain and extend in the future.
