"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import ClientProvider from "./ClientProvider";
import "./globals.css";

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