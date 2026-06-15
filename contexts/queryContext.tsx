import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,   // 2 minutes — avoids refetch on every tab visit
      gcTime: 1000 * 60 * 10,     // 10 minutes — keep unused data in cache
      retry: 2,
      refetchOnMount: true,        // refetch if stale when component mounts
      refetchOnWindowFocus: false, // not relevant on native
    },
  },
});

export { queryClient };

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

