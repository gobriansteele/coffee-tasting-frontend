'use client'

import { useQuery } from '@tanstack/react-query'
import { useApiClient } from '@/hooks/use-api-client'
import { queryKeys } from '@/lib/query-keys'

export const useSimilarCoffees = (coffeeId: string, limit?: number) => {
  const apiClient = useApiClient()

  return useQuery({
    queryKey: queryKeys.recommendations.similar(coffeeId),
    queryFn: () => apiClient.getSimilarCoffees(coffeeId, limit),
    staleTime: 5 * 60 * 1000,
    enabled: !!coffeeId,
  })
}

export const useCoffeesByFlavor = (
  flavorIds: string[],
  excludeTasted?: boolean
) => {
  const apiClient = useApiClient()

  return useQuery({
    queryKey: queryKeys.recommendations.byFlavor(flavorIds),
    queryFn: () => apiClient.getCoffeesByFlavor(flavorIds, excludeTasted),
    staleTime: 5 * 60 * 1000,
    enabled: flavorIds.length > 0,
  })
}
