"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient, setQueryClient] = useState<QueryClient | null>(null);

  useEffect(() => {
    setQueryClient(new QueryClient());
  }, []);

  if (!queryClient) {
    return null;
  }

  return (
    <SessionProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </SessionProvider>
  );
}
