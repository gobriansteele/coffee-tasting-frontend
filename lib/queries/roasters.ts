'use client'

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useApiClient } from '@/hooks/use-api-client'
import { queryKeys } from '@/lib/query-keys'
import type { CreateRoasterRequest, UpdateRoasterRequest } from '@/lib/api/types'

type RoasterFilters = {
  skip?: number
  limit?: number
  search?: string
}

export const useRoasters = (filters?: RoasterFilters) => {
  const apiClient = useApiClient()

  return useQuery({
    queryKey: queryKeys.roasters.list(filters),
    queryFn: () => apiClient.getRoasters(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useRoaster = (id: string) => {
  const apiClient = useApiClient()

  return useQuery({
    queryKey: queryKeys.roasters.detail(id),
    queryFn: () => apiClient.getRoaster(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  })
}

export const useCreateRoaster = () => {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRoasterRequest) => apiClient.createRoaster(data),
    onSuccess: (newRoaster) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roasters.lists() })
      queryClient.setQueryData(
        queryKeys.roasters.detail(newRoaster.id),
        newRoaster
      )
    },
  })
}

export const useUpdateRoaster = () => {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoasterRequest }) =>
      apiClient.updateRoaster(id, data),
    onSuccess: (_updatedRoaster, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roasters.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.roasters.lists() })
    },
  })
}

export const useDeleteRoaster = () => {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteRoaster(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.roasters.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.roasters.lists() })
    },
  })
}
