/**
 * @file queryClient.js
 * @description TanStack Query client with sensible defaults.
 *
 * - staleTime 1 min: prevents refetch-on-every-mount for stable data
 * - retry 1: reduces flicker on actual server errors
 * - Global error handler: logs in development
 */

import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        if (import.meta.env.DEV) {
          console.error("[Mutation Error]:", error);
        }
      },
    },
  },
});

export default queryClient;
