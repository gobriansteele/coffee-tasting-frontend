'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiClient } from '@/hooks/use-api-client'
import { queryKeys } from '@/lib/query-keys'
import type { CreateFlavorRequest } from '@/lib/api/types'

type FlavorFilters = {
  skip?: number
  limit?: number
  category?: string
}

export const useFlavors = (filters?: FlavorFilters) => {
  const apiClient = useApiClient()

  return useQuery({
    queryKey: queryKeys.flavors.list(filters),
    queryFn: () => apiClient.getFlavors(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useFlavor = (id: string) => {
  const apiClient = useApiClient()

  return useQuery({
    queryKey: queryKeys.flavors.detail(id),
    queryFn: () => apiClient.getFlavor(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  })
}

export const useCreateFlavor = () => {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateFlavorRequest) => apiClient.createFlavor(data),
    onSuccess: (newFlavor) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.flavors.lists() })
      queryClient.setQueryData(
        queryKeys.flavors.detail(newFlavor.id),
        newFlavor
      )
    },
  })
}
