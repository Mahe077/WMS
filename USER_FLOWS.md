# User Flow Analysis

This document outlines the main user flows in the WMS-FE application, from user interaction to backend API calls. It also highlights potential missing edge cases and validations.

## Authentication Flow

### Login

1.  **User Interaction**: The user enters their email and password on the login page and clicks the "Sign in" button.
2.  **Frontend Logic**: The `LoginPage` component calls the `login` function from the `AuthContext`.
3.  **API Call**: The `login` function in `AuthContext` makes a POST request to the `/api/auth/login` endpoint with the user's credentials.
4.  **Backend/Database**: The backend receives the request, validates the credentials against the user database, and if successful, generates a JWT token.
5.  **Response**: The backend returns a JSON response with the user's data and the JWT token.
6.  **Frontend Logic**: The `AuthContext` stores the JWT token in local storage and updates the application state to reflect that the user is authenticated.
7.  **Redirection**: The user is redirected to the main dashboard page.

**Missing Edge Case Handling/Validations**:

*   **Input Validation**: The frontend should have more robust input validation to prevent empty submissions or invalid email formats before sending the request to the backend.
*   **Error Handling**: The error handling for failed login attempts could be more specific (e.g., "Invalid credentials" vs. a generic "Login failed").
*   **Security**: Storing the JWT in local storage is vulnerable to XSS attacks. It's recommended to store it in a secure, HTTP-only cookie.

### Forgot Password

1.  **User Interaction**: The user clicks the "Forgot password?" link on the login page, enters their email, and clicks "Send PIN".
2.  **Frontend Logic**: The `ForgotPasswordPage` component simulates a network request and navigates to the PIN verification page.
3.  **API Call (Simulated)**: The code for the actual API call to `/api/forgot-password/request` is commented out. It would typically send the user's email to the backend.
4.  **Backend/Database**: The backend would generate a time-sensitive PIN, store it, and send it to the user's email address.
5.  **Redirection**: The user is redirected to the `/forgot-password/verify-pin` page.

**Missing Edge Case Handling/Validations**:

*   **API Integration**: The entire forgot password flow is currently simulated on the frontend. The backend API needs to be implemented.
*   **Email Validation**: The frontend should validate the email format before making the API call.
*   **User Existence**: The backend should handle cases where the provided email does not exist in the database.

### Verify PIN and Reset Password

1.  **User Interaction**: The user enters the PIN they received and clicks "Verify PIN". If successful, they are taken to the reset password page where they enter and confirm their new password.
2.  **Frontend Logic**: The `VerifyPinPage` and `ResetPasswordPage` components handle the user input and simulate the verification and reset processes.
3.  **API Call (Simulated)**: The API calls to `/api/forgot-password/verify` and `/api/forgot-password/reset` are commented out.
4.  **Backend/Database**: The backend would need to verify the PIN and then update the user's password in the database.

**Missing Edge Case Handling/Validations**:

*   **API Integration**: This flow is also simulated and requires backend implementation.
*   **PIN Expiration**: The backend should handle PIN expiration.
*   **Password Strength**: The frontend and backend should enforce password strength requirements.
*   **Password Confirmation**: The frontend should ensure the new password and confirmation match before submitting the form.

## Main Application Flow

### Dashboard and Navigation

1.  **User Interaction**: After logging in, the user is presented with the main dashboard, which displays key statistics and alerts. The user can navigate to different modules using the sidebar.
2.  **Frontend Logic**: The `WMSDashboardContent` component in `src/app/page.tsx` is the main layout. It uses the `useApp` and `useAuth` hooks to manage application state and user permissions.
3.  **Module Loading**: The `renderActiveModule` function dynamically renders the component for the currently active module based on the application state.
4.  **Protected Routes**: The `ProtectedRoute` and `ProtectedComponent` components are used to ensure that only authenticated and authorized users can access certain pages and components.

**Missing Edge Case Handling/Validations**:

*   **Data Fetching**: The dashboard data is currently hardcoded. This should be fetched from the backend API.
*   **Real-time Updates**: For a real-time system, the dashboard should be updated with live data using WebSockets or polling.

### Module-Specific Flows

Each module (Inventory, Orders, etc.) will have its own specific user flows for performing CRUD operations. These flows will generally follow this pattern:

1.  **User Interaction**: The user interacts with the UI to view, create, edit, or delete data (e.g., clicking a button to add a new inventory item).
2.  **Frontend Logic**: The module's components handle the user input and make the appropriate API calls.
3.  **API Call**: A request is sent to the backend API to perform the requested operation.
4.  **Backend/Database**: The backend processes the request, interacts with the database, and returns a response.
5.  **Frontend Logic**: The frontend updates the UI to reflect the changes.

**Missing Edge Case Handling/Validations**:

*   **Comprehensive Error Handling**: Each module needs comprehensive error handling for all API interactions.
*   **Input Validation**: All user input should be thoroughly validated on the frontend and backend.
*   **Concurrency Control**: For a multi-user system, the backend needs to handle potential race conditions and data conflicts.
