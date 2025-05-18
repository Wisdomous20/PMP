import React from "react";
import type { Metadata } from "next";
import ClientProvider from "./ClientProvider";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Project Management System",
  description: "CPU Project Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>
          {children}
          <Toaster />
        </ClientProvider>
      </body>
    </html>
  );
}