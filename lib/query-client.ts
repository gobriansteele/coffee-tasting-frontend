import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // How long before data is considered stale
      staleTime: 5 * 60 * 1000, // 5 minutes
      // How long to keep unused data in cache
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      // Retry failed requests
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors-janky, should fix with ApiErrorClass
        if (error.message.includes('4')) {
          return false
        }

        return failureCount < 2
      },
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
})
