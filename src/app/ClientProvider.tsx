"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRef, useState, useEffect } from "react";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient, setQueryClient] = useState<QueryClient | null>(null);

  useEffect(() => {
    setQueryClient(new QueryClient());
  }, []);

  if (!queryClient) {
    return null;
  }

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}
