import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import { AuthProvider, AuthContextType } from "./auth-context";

// Mocks
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: mockPush }) }));

const mockAddNotification = jest.fn();
jest.mock("@/contexts/app-context", () => ({
  useNotifications: () => ({ addNotification: mockAddNotification }),
}));

// Mock the API modules used in the context
const mockValidateTokenApi = jest.fn();
const mockLoginApi = jest.fn();
jest.mock("@/features/auth/api", () => ({
  validateTokenApi: (...args: unknown[]) => mockValidateTokenApi(...args),
  loginApi: (...args: unknown[]) => mockLoginApi(...args),
  resetPasswordApi: jest.fn(),
}));

jest.mock("@/lib/auth/permissions", () => ({
  can: (user: User, permission: string) =>
    user?.permissions?.includes(permission),
  hasRole: (user: User, role: string | string[]) => {
    if (!user) return false;
    if (Array.isArray(role)) return role.includes(user.role);
    return user.role === role;
  },
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

import { useAuth } from "@/features/auth/hooks/useAuth";
import { User } from "@/features/auth/types";

function TestComponent() {
  const ctx = useAuth();
  if (!ctx) return null;
  return (
    <div>
      <span data-testid="isAuthenticated">
        {ctx.state.isAuthenticated ? "yes" : "no"}
      </span>
      <span data-testid="user">
        {ctx.state.user ? ctx.state.user.name : "none"}
      </span>
      <button onClick={() => ctx.logout("test")}>Logout</button>
      <button onClick={() => ctx.clearError()}>ClearError</button>
      <button onClick={() => ctx.updateActivity()}>UpdateActivity</button>
    </div>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateTokenApi.mockReset();
    mockLoginApi.mockReset();
    localStorage.clear();
  });

  it("initializes with no user if no token", async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });
    expect(localStorage.getItem("wms_token")).toBeNull();
  });

  it("initializes with user if valid token", async () => {
    localStorage.setItem("wms_token", "valid-token");
    mockValidateTokenApi.mockResolvedValueOnce({
      user: {
        id: "1",
        name: "Test",
        email: "t@e.com",
        role: "admin",
        permissions: ["read"],
      },
      token: "valid-token",
    });
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    // Wait for the context to finish initializing and set the user
    await waitFor(() => getByTestId("isAuthenticated").textContent === "yes");
    expect(mockValidateTokenApi).toHaveBeenCalledWith("valid-token");
    expect(getByTestId("user").textContent).toBe("Test");
  });

  

  it("logout resets state and removes token", async () => {
    localStorage.setItem("wms_token", "abc")
    mockValidateTokenApi.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: "1", name: "Test", email: "t@e.com", role: "admin", permissions: [] } }),
    })
    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => getByText("Logout"))
    await act(async () => {
      getByText("Logout").click()
    })
    expect(localStorage.getItem("wms_token")).toBeNull()
  })

  it("can() returns correct permission admin", async () => {
    localStorage.setItem("wms_token", "valid-token");
    mockValidateTokenApi.mockResolvedValueOnce({
      user: {
        id: "1",
        name: "Test",
        email: "t@e.com",
        role: "admin",
        permissions: ["read", "write"],
      },
      token: "valid-token",
    });
    function PermTest() {
      const ctx = useAuth();
      return (
        <>
          <span data-testid="can-read">{ctx.can("read") ? "yes" : "no"}</span>
          <span data-testid="can-delete">
            {ctx.can("delete") ? "yes" : "no"}
          </span>
        </>
      );
    }
    const { getByTestId } = render(
      <AuthProvider>
        <PermTest />
      </AuthProvider>
    );
    await waitFor(() => getByTestId("can-read").textContent === "yes");
    expect(getByTestId("can-read").textContent).toBe("yes");
    expect(getByTestId("can-delete").textContent).toBe("no");
  });

  it("can() returns correct permission for non admin", async () => {
    localStorage.setItem("wms_token", "valid-token");
    mockValidateTokenApi.mockResolvedValueOnce({
      user: {
        id: "1",
        name: "Test",
        email: "t@e.com",
        role: "manager",
        permissions: ["read"], // Only "read" permission, no "delete"
      },
      token: "valid-token",
    });
    function PermTest() {
      const ctx = useAuth();
      return (
        <>
          <span data-testid="can-read">{ctx.can("read") ? "yes" : "no"}</span>
          <span data-testid="can-delete">
            {ctx.can("delete") ? "yes" : "no"}
          </span>
        </>
      );
    }
    const { getByTestId } = render(
      <AuthProvider>
        <PermTest />
      </AuthProvider>
    );
    await waitFor(() => getByTestId("can-read").textContent === "yes");
    expect(getByTestId("can-read").textContent).toBe("yes");
    expect(getByTestId("can-delete").textContent).toBe("no");
  });

  it("hasRole() works for string and array", async () => {
    localStorage.setItem("wms_token", "valid-token");
    mockValidateTokenApi.mockResolvedValueOnce({
      user: {
        id: "1",
        name: "Test",
        email: "t@e.com",
        role: "admin",
        permissions: [],
      },
      token: "valid-token",
    });
    function RoleTest() {
      const ctx = useAuth();
      return (
        <>
          <span data-testid="single">
            {ctx.hasRole("admin") ? "yes" : "no"}
          </span>
          <span data-testid="multi1">
            {ctx.hasRole(["admin", "user"]) ? "yes" : "no"}
          </span>
          <span data-testid="multi2">
            {ctx.hasRole(["user", "guest"]) ? "yes" : "no"}
          </span>
        </>
      );
    }
    const { getByTestId } = render(
      <AuthProvider>
        <RoleTest />
      </AuthProvider>
    );
    await waitFor(() => getByTestId("single").textContent === "yes");
    expect(getByTestId("single").textContent).toBe("yes");
    expect(getByTestId("multi1").textContent).toBe("yes");
    expect(getByTestId("multi2").textContent).toBe("no");
  });

  

  it("updateActivity updates lastActivity", async () => {
    mockValidateTokenApi.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          id: "1",
          name: "Test",
          email: "t@e.com",
          role: "admin",
          permissions: [],
        },
      }),
    });
    let ctx: AuthContextType;
    function ActivityTest() {
      ctx = useAuth();
      return <button onClick={() => ctx.updateActivity()}>Update</button>;
    }
    const { getByText } = render(
      <AuthProvider>
        <ActivityTest />
      </AuthProvider>
    );
    const before = ctx!.state.lastActivity;
    await act(async () => {
      getByText("Update").click();
    });
    expect(ctx!.state.lastActivity).not.toBe(before);
  });
});
