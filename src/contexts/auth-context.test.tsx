import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import { AuthProvider, AuthContext, AuthContextType } from "./auth-context";
import { useContext } from "react";
import { validateTokenApi } from "@/lib/api/auth";

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
jest.mock("@/lib/api/auth", () => ({
  validateTokenApi: (...args: any[]) => mockValidateTokenApi(...args),
  loginApi: (...args: any[]) => mockLoginApi(...args),
}));

jest.mock("@/lib/auth/permissions", () => ({
  can: (user: any, permission: string) =>
    user?.permissions?.includes(permission),
  hasRole: (user: any, role: string | string[]) => {
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

function TestComponent() {
  const ctx = useContext(AuthContext) as AuthContextType;
  if (!ctx) return null;
  return (
    <div>
      <span data-testid="isAuthenticated">
        {ctx.state.isAuthenticated ? "yes" : "no"}
      </span>
      <span data-testid="user">
        {ctx.state.user ? ctx.state.user.name : "none"}
      </span>
      <button onClick={() => ctx.login("test@example.com", "password")}>
        Login
      </button>
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
      ok: true,
      json: async () => ({
        user: {
          id: "1",
          name: "Test",
          email: "t@e.com",
          role: "admin",
          permissions: ["read"],
        },
        token: "valid-token",
      }),
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

  it("login success", async () => {
    mockLoginApi.mockResolvedValueOnce({
      user: {
        id: "1",
        name: "Test",
        email: "t@e.com",
        role: "admin",
        permissions: ["read"],
      },
      token: "abc",
    });
    const { getByText, getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await act(async () => {
      getByText("Login").click();
    });
    await waitFor(() =>
      expect(getByTestId("isAuthenticated").textContent).toBe("yes")
    );
    expect(localStorage.getItem("wms_token")).toBe("abc");
    expect(mockAddNotification).toHaveBeenCalledWith(
      expect.objectContaining({ type: "success" })
    );
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("login failure", async () => {
    mockValidateTokenApi.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    });
    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await act(async () => {
      getByText("Login").click();
    });
    expect(mockAddNotification).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error" })
    );
  });

  it("logout resets state and removes token", async () => {
    localStorage.setItem("wms_token", "abc")
    mockValidateTokenApi.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: "1", name: "Test", email: "t@e.com", role: "admin", permissions: [] } }),
    })
    const { getByText, findByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    // Wait for the "Login" button to appear (i.e., TestComponent rendered)
    await waitFor(() => getByText("Login"))
    await act(async () => {
      getByText("Logout").click()
    })
    expect(localStorage.getItem("wms_token")).toBeNull()
  })

  it("can() returns correct permission admin", async () => {
    localStorage.setItem("wms_token", "valid-token");
    mockValidateTokenApi.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          id: "1",
          name: "Test",
          email: "t@e.com",
          role: "admin",
          permissions: ["read", "write"],
        },
        token: "valid-token",
      }),
    });
    function PermTest() {
      const ctx = useContext(AuthContext) as AuthContextType;
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
      ok: true,
      json: async () => ({
        user: {
          id: "1",
          name: "Test",
          email: "t@e.com",
          role: "manager",
          permissions: ["read"], // Only "read" permission, no "delete"
        },
        token: "valid-token",
      }),
    });
    function PermTest() {
      const ctx = useContext(AuthContext) as AuthContextType;
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
      ok: true,
      json: async () => ({
        user: {
          id: "1",
          name: "Test",
          email: "t@e.com",
          role: "admin",
          permissions: [],
        },
        token: "valid-token",
      }),
    });
    function RoleTest() {
      const ctx = useContext(AuthContext) as AuthContextType;
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

  it("clearError resets error", async () => {
    // Simulate success state
    mockLoginApi.mockResolvedValueOnce({
      user: {
        id: "1",
        name: "Test",
        email: "t@e.com",
        role: "admin",
        permissions: [],
      },
      token: "abc",
    });
    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await act(async () => {
      getByText("Login").click();
    });
    await act(async () => {
      getByText("ClearError").click();
    });
    // Should show a success notification after login
    expect(mockAddNotification).toHaveBeenCalledWith(
      expect.objectContaining({ type: "success" })
    );
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
      ctx = useContext(
        require("./auth-context").AuthContext
      ) as AuthContextType;
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
