"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { resetPassword, state } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword(email, password);
    // if (password !== confirm) {
    //   setError("Passwords do not match");
    //   return;
    // }
    // setLoading(true);
    // setError("");
    // const res = await fetch("/api/forgot-password/reset", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, password }),
    // });
    // setLoading(false);
    // if (res.ok) {
    //   router.push("/login");
    // } else {
    //   setError("Failed to reset password. Try again.");
    // }
    console.log("Resetting password for:", email, "New password:", password);
    // Simulate a successful reset
    setTimeout(() => {
      console.log("Password reset successful for:", email);
      // Redirect to login or show success message
    }, 1000); // Simulate network delay
  };

  return (
    // <div style={{ maxWidth: 400, margin: "auto", padding: 32 }}>
    //   <h2>Set New Password</h2>
    //   <form onSubmit={handleSubmit}>
    //     <input
    //       type="password"
    //       placeholder="New password"
    //       value={password}
    //       onChange={e => setPassword(e.target.value)}
    //       required
    //       style={{ width: "100%", marginBottom: 12 }}
    //     />
    //     <input
    //       type="password"
    //       placeholder="Confirm new password"
    //       value={confirm}
    //       onChange={e => setConfirm(e.target.value)}
    //       required
    //       style={{ width: "100%", marginBottom: 12 }}
    //     />
    //     <button type="submit" disabled={loading} style={{ width: "100%" }}>
    //       {loading ? "Resetting..." : "Reset Password"}
    //     </button>
    //     {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    //   </form>
    // </div>

    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
            {/* <Warehouse className="h-6 w-6 text-blue-600" /> */}
            <Image
              src="/wla.png"
              alt="Logo"
              width={40}
              height={40}
              className="h-8 w-8 lg:h-8 lg:w-22"
              priority
            />
          </div>
          <CardTitle className="text-2xl">Waratah Logistics</CardTitle>
          <CardDescription>
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={state.isLoading}>
              {state.isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Resetting...
                </div>
              ) : (
                <div className="flex items-center">Reset Password</div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
