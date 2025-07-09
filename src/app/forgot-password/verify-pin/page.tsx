"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function VerifyPinPage() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setLoading(true);
    // setError("");
    // const res = await fetch("/api/forgot-password/verify", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, pin }),
    // });
    // setLoading(false);
    // if (res.ok) {
    //   router.push(`/forgot-password/reset?email=${encodeURIComponent(email)}`);
    // } else {
    //   setError("Invalid PIN. Try again.");
    // }
    console.log("Verifying PIN for:", email, "PIN:", pin);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (pin === "123456") { // Simulate successful verification
        router.push(`/forgot-password/reset?email=${encodeURIComponent(email)}`);
      } else {
        setError("Invalid PIN. Try again.");
      }
    }, 1000); // Simulate network delay
  };

  return (
    // <div style={{ maxWidth: 400, margin: "auto", padding: 32 }}>
    //   <h2>Enter PIN</h2>
    //   <form onSubmit={handleSubmit}>
    //     <input
    //       type="text"
    //       placeholder="Enter the PIN sent to your email"
    //       value={pin}
    //       onChange={e => setPin(e.target.value)}
    //       required
    //       style={{ width: "100%", marginBottom: 12 }}
    //     />
    //     <button type="submit" disabled={loading} style={{ width: "100%" }}>
    //       {loading ? "Verifying..." : "Verify PIN"}
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
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent><form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Enter PIN</h2>
        <div className="space-y-2">
          <Label htmlFor="pin">PIN</Label>
          <Input
            id="pin"
            type="text"
            placeholder="Enter the PIN sent to your email"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Verifying..." : "Verify PIN"}
        </Button>
      </form>
        </CardContent>
      </Card>
    </div>
  );
}
