# Project Guide: WMS-FE

This document provides a comprehensive overview of the WMS-FE (Warehouse Management System - Frontend) project, including its architecture, key flows, technology stack, and setup instructions.

## High-Level Architecture

The WMS-FE is a modern web application built with Next.js and React. It serves as the user interface for a warehouse management system. The application is designed to be a single-page application (SPA) with server-side rendering (SSR) capabilities provided by Next.js.

The application interacts with a backend API for data persistence and business logic. The API is responsible for handling user authentication, data storage, and business operations. The frontend communicates with the API via RESTful endpoints.

## Folder Structure Breakdown

The project follows a standard Next.js project structure. The key folders are:

- **`/src`**: This is the main folder containing all the application code.
  - **`/src/app`**: This folder contains the main application pages and layouts.
    - **`/src/app/api`**: This folder contains the API routes for handling backend communication.
    - **`/src/app/login`**: This folder contains the login page.
    - **`/src/app/forgot-password`**: This folder contains the forgot password pages.
  - **`/src/components`**: This folder contains all the reusable React components.
    - **`/src/components/common`**: This folder contains common components used across the application.
    - **`/src/components/modules`**: This folder contains components specific to different modules of the application.
    - **`/src/components/ui`**: This folder contains the UI components like buttons, inputs, etc.
  - **`/src/contexts`**: This folder contains the React contexts for managing global state.
  - **`/src/hooks`**: This folder contains custom React hooks.
  - **`/src/lib`**: This folder contains the utility functions, constants, and type definitions.
    - **`/src/lib/api`**: This folder contains the functions for making API calls.
    - **`/src/lib/auth`**: This folder contains the authentication related functions.
    - **`/src/lib/types`**: This folder contains the TypeScript type definitions.
- **`/public`**: This folder contains all the static assets like images, fonts, etc.
- **`/node_modules`**: This folder contains all the project dependencies.

## Key Flows

### Authentication Flow

The authentication flow is managed by the `AuthContext` located in `/src/contexts/auth-context.tsx`. The flow is as follows:

1.  The user enters their email and password on the login page.
2.  The `login` function in the `AuthContext` is called, which makes an API call to the backend to authenticate the user.
3.  If the authentication is successful, the backend returns a JWT token, which is stored in the local storage.
4.  The user is then redirected to the dashboard.
5.  For subsequent requests, the JWT token is sent in the Authorization header to authenticate the user.
6.  The `AuthContext` also handles token validation, refresh, and logout.

### CRUD or Business Logic Flows

The application has several modules for managing different aspects of the warehouse, such as inventory, orders, and returns. Each module has its own set of components and business logic. The components interact with the backend API to perform CRUD (Create, Read, Update, Delete) operations on the data.

### API Interactions

The API interactions are handled by the functions in the `/src/lib/api` folder. These functions use the `fetch` API to make RESTful API calls to the backend. The API endpoints are defined in the `/src/app/api` folder.

## Technology Stack & Tools

- **Framework**: Next.js, React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Testing**: Jest, React Testing Library
- **Linting**: ESLint
- **Package Manager**: npm

## Missing or Inconsistent Logic

- **Unused or duplicate components**: The codebase has some duplicate components, such as `custom-table.tsx` in both `/src/components/common` and `/src/components/ui`. This should be refactored to have a single source of truth.
- **Incomplete flows**: The password reset flow is implemented on the frontend, but the backend API for it is not yet implemented.
- **Circular dependencies**: There are no major circular dependencies detected in the codebase.
- **Redundant logic**: There is some redundant logic in the `AuthContext` that can be simplified.

## Environment & Setup Guide

To run the application locally, you need to have Node.js and npm installed on your machine. You also need to have a backend API running and configured.

1.  Clone the repository.
2.  Install the dependencies using `npm install`.
3.  Create a `.env.local` file in the root of the project and add the following environment variables:

    ```
    NEXT_PUBLIC_API_URL=http://localhost:8080/api
    ```

4.  Run the development server using `npm run dev`.

## Suggestions

- **Code Structure**: The code structure is generally good, but it can be improved by refactoring the duplicate components and simplifying the `AuthContext`.
- **Performance/Scale Concerns**: The application is built with Next.js, which provides server-side rendering and other performance optimizations. However, the performance can be further improved by implementing code splitting and lazy loading for the components.
- **Security Issues**: The application uses JWT for authentication, which is a secure way of handling authentication. However, the JWT token is stored in the local storage, which can be vulnerable to XSS attacks. It is recommended to store the JWT token in a secure cookie instead.
