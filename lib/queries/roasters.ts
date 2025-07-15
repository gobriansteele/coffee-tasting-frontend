'use client'

import { useQuery } from '@tanstack/react-query'
import { useApiClient } from '@/hooks/use-api-client'
import { queryKeys } from '@/lib/query-keys'
import * as roasterQueries from './roaster-queries'

interface RoasterFilters {
  skip?: number
  limit?: number
}

// React Query hook to fetch list of roasters
export const useRoasters = (filters?: RoasterFilters) => {
  const apiClient = useApiClient()

  return useQuery({
    queryKey: queryKeys.roasters.list(filters),
    queryFn: () => roasterQueries.getRoasters(apiClient, filters),
    staleTime: 5 * 60 * 1000,
  })
}
