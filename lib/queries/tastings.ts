'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiClient } from '@/hooks/use-api-client'
import { queryKeys } from '@/lib/query-keys'
import type { CreateTastingSessionRequest, TastingSession } from '@/lib/api/types'

type TastingFilters = {
  skip?: number
  limit?: number
  coffeeId?: string
}

export const useTastings = (filters?: TastingFilters) => {
  const apiClient = useApiClient()

  return useQuery({
    queryKey: queryKeys.tastings.list(filters),
    queryFn: () =>
      apiClient.getTastingSessions(
        filters?.skip,
        filters?.limit,
        filters?.coffeeId
      ),
    staleTime: 5 * 60 * 1000,
  })
}

export const useTasting = (id: string) => {
  const apiClient = useApiClient()

  return useQuery({
    queryKey: queryKeys.tastings.detail(id),
    queryFn: () => apiClient.getTastingSession(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  })
}

export const useCreateTastingSession = () => {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTastingSessionRequest) =>
      apiClient.createTastingSession(data),
    onSuccess: (newTasting) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tastings.lists() })
      queryClient.setQueryData(
        queryKeys.tastings.detail(newTasting.id),
        newTasting
      )
    },
  })
}

export const useUpdateTastingSession = () => {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TastingSession> }) =>
      apiClient.updateTastingSession(id, data),
    onSuccess: (updatedTasting, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tastings.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.tastings.lists() })
    },
  })
}

export const useDeleteTastingSession = () => {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteTastingSession(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.tastings.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.tastings.lists() })
    },
  })
}
