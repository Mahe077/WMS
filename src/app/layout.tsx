import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AppProvider } from "@/contexts/app-context"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ 
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Waratah Logistics",
  description: "A comprehensive warehouse management system for 3PL providers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <AuthProvider>{children}</AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}
