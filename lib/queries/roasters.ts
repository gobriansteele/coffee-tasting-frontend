'use client'

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useApiClient } from '@/hooks/use-api-client'
import { queryKeys } from '@/lib/query-keys'
import * as roasterQueries from './roaster-queries'
import type { CreateRoasterRequest } from '@/lib/api/types'

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

// React Query hook to create a roaster
export const useCreateRoaster = () => {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRoasterRequest) =>
      roasterQueries.createRoaster(apiClient, data),
    onSuccess: (newRoaster) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roasters.lists() })
      queryClient.setQueryData(
        queryKeys.roasters.detail(newRoaster.id),
        newRoaster
      )
    },
  })
}
