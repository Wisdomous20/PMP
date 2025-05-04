"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import React from "react";
import "./globals.css";
import ClientProvider from "./ClientProvider";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            {children}
          </SessionProvider>
          {/* React Query Devtools for debugging */}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        </ClientProvider>
      </body>
    </html>
  );
}