'use client'

import { useMutation } from '@tanstack/react-query'
import { useApiClient } from '@/hooks/use-api-client'
import * as adminQueries from './admin-queries'

// React Query hook to sync graph database
export const useAdminGraphSync = () => {
  const apiClient = useApiClient()

  return useMutation({
    mutationFn: () => adminQueries.syncGraphDatabase(apiClient),
  })
}
