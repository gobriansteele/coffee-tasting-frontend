import type { ApiClient } from '@/lib/api/client'

// Pure query functions - no hooks, no React Query dependencies
export const syncGraphDatabase = async (apiClient: ApiClient) => {
  return apiClient.syncGraphDatabase()
}
