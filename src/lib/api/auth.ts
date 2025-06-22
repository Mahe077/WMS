// lib/api/auth.ts
export async function loginApi(email: string, password: string) {
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