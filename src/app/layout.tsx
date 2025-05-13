"use client";

import React from "react";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import ClientProvider from "./ClientProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIGRA8",
  description: "Sigra8 Film Festival",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ClientProvider>
            {children}
          </ClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}