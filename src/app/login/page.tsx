"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { NotificationToast } from "@/components/common/notification-toast";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, state } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
            {/* <Warehouse className="h-6 w-6 text-blue-600" /> */}
            <Image src="/wla.png" alt="Logo" width={40} height={40} className="h-8 w-8 lg:h-8 lg:w-22" priority />
          </div>
          <CardTitle className="text-2xl">
            Waratah Logistics
          </CardTitle>
          <CardDescription>
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={state.isLoading}>
              {state.isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Sign in
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500 text-center">
              Demo credentials:
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
              <div>
                <div className="font-medium">Admin:</div>
                <div>admin@example.com / admin123</div>
              </div>
              <div>
                <div className="font-medium">Warehouse Manager:</div>
                <div>manager@example.com / manager123</div>
              </div>
              <div>
                <div className="font-medium">Receiving Staff:</div>
                <div>receiving@example.com / receiving123</div>
              </div>
              <div>
                <div className="font-medium">Dispatch Staff:</div>
                <div>dispatch@example.com / dispatch123</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <NotificationToast />
    </div>
  );
}
