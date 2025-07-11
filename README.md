# Warehouse Management System (WMS) Frontend

This project is a Warehouse Management System (WMS) frontend built with Next.js. It provides a modern, modular interface for managing inventory, dock scheduling, and order fulfillment operations. The application is structured for scalability and maintainability, using React components, custom hooks, and context providers.

### Main Features

- **Inventory Management:** Track and manage inventory items, with sample data and UI components for listing and editing inventory.
- **Dock Scheduling:** Schedule and manage dock operations, with dedicated modules for both desktop and mobile views.
- **Order Fulfillment:** View and manage active orders and pick lists, supporting efficient order processing.
- **Authentication:** Context-based authentication and protected routes to secure sensitive operations.
- **Reusable UI Components:** Includes a library of UI elements (tables, dialogs, forms, notifications, etc.) for consistent design and rapid development.
- **State Persistence:** Utilities for persisting state across sessions.

### Technologies Used

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) and custom components.
- **Testing:** [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/)

The codebase is organized under `src/` with clear separation of concerns:

- `components/` for UI and feature modules
- `contexts/` for global state management
- `hooks/` for custom React hooks
- `lib/` for shared utilities and types
- `app/` for Next.js routing and API endpoints

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](httpshttps://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.