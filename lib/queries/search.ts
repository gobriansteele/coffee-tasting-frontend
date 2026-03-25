'use client'

import { useQuery } from '@tanstack/react-query'
import { useApiClient } from '@/hooks/use-api-client'
import { queryKeys } from '@/lib/query-keys'

export const useSearchRoasters = (query: string) => {
  const apiClient = useApiClient()

  return useQuery({
    queryKey: queryKeys.search.roasters(query),
    queryFn: () => apiClient.searchRoasters(query),
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
  })
}

export const useSearchCoffees = (query: string) => {
  const apiClient = useApiClient()

  return useQuery({
    queryKey: queryKeys.search.coffees(query),
    queryFn: () => apiClient.searchCoffees(query),
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
  })
}
