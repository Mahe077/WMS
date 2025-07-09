"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setLoading(true);
    // setError("");
    // const res = await fetch("/api/forgot-password/request", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email }),
    // });
    // setLoading(false);
    // if (res.ok) {
    //   router.push(`/forgot-password/verify-pin?email=${encodeURIComponent(email)}`);
    // } else {
    //   setError("Failed to send PIN. Try again.");
    // }
    console.log("Forgot password request for:", email);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(`/forgot-password/verify-pin?email=${encodeURIComponent(email)}`);
    }, 1000); // Simulate network delay
  };

  return (
    // <div style={{ maxWidth: 400, margin: "auto", padding: 32 }}>
    //   <h2>Forgot Password</h2>
    //   <form onSubmit={handleSubmit}>
    //     <input
    //       type="email"
    //       placeholder="Enter your email"
    //       value={email}
    //       onChange={e => setEmail(e.target.value)}
    //       required
    //       style={{ width: "100%", marginBottom: 12 }}
    //     />
    //     <button type="submit" disabled={loading} style={{ width: "100%" }}>
    //       {loading ? "Sending..." : "Send PIN"}
    //     </button>
    //     {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    //   </form>
    // </div>
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
            Enter your email to receive a PIN for password reset
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
                ></Input>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending ...
                </div>
              ) : (
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Send PIN
                </div>
              )}
            </Button>
    </form>
    </CardContent>
  </Card>
</div>

  );
}
