import { users } from "@/lib/sample-data/users";

// src/features/auth/api/index.ts
export async function loginApi(email: string, password: string) {
  // Mock authentication for specific users
  if (email === "admin@example.com" && password === "admin123") {
    return {
      user: users.find((u) => u.email === email),
      token: "mock-admin-token",
    };
  } else if (email === "manager@example.com" && password === "manager123") {
    return {
      user: users.find((u) => u.email === email),
      token: "mock-manager-token",
    };
  } else if (email === "receiving@example.com" && password === "receiving123") {
    return {
      user: users.find((u) => u.email === email),
      token: "mock-receiving-token",
    };
  } else if (email === "dispatch@example.com" && password === "dispatch123") {
    return {
      user: users.find((u) => u.email === email),
      token: "mock-dispatch-token",
    };
  }

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }
  return res.json();
}

export async function forgotPasswordApi(email: string) {
  const res = await fetch("/api/auth/forgot-password/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Forgot password request failed");
  }
  return res.json();
}

export async function resetPasswordApi(email: string, password: string) {
  const res = await fetch("/api/auth/forgot-password/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Reset password failed");
  }
  return res.json();
}

export async function validateTokenApi(token: string) {
  const res = await fetch("/api/auth/validate", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Invalid token");
  }
  return res.json();
}
export async function logoutApi() {
  // In a real app, you might invalidate the token on the server
  // Here we just clear localStorage
  localStorage.removeItem("wms_token");
  return { message: "Logged out successfully" };
}
