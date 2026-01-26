'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiClient } from '@/hooks/use-api-client'
import { queryKeys } from '@/lib/query-keys'
import type { CreateRatingRequest, UpdateRatingRequest } from '@/lib/api/types'

export const useRating = (tastingId: string) => {
  const apiClient = useApiClient()

  return useQuery({
    queryKey: queryKeys.ratings.detail(tastingId),
    queryFn: () => apiClient.getRating(tastingId),
    staleTime: 5 * 60 * 1000,
    enabled: !!tastingId,
  })
}

export const useCreateRating = (tastingId: string) => {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRatingRequest) =>
      apiClient.createRating(tastingId, data),
    onSuccess: (newRating) => {
      queryClient.setQueryData(queryKeys.ratings.detail(tastingId), newRating)
      // Also invalidate the tasting since it includes the rating
      queryClient.invalidateQueries({
        queryKey: queryKeys.tastings.detail(tastingId),
      })
    },
  })
}

export const useUpdateRating = (tastingId: string) => {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateRatingRequest) =>
      apiClient.updateRating(tastingId, data),
    onSuccess: (updatedRating) => {
      queryClient.setQueryData(
        queryKeys.ratings.detail(tastingId),
        updatedRating
      )
      queryClient.invalidateQueries({
        queryKey: queryKeys.tastings.detail(tastingId),
      })
    },
  })
}

export const useDeleteRating = (tastingId: string) => {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiClient.deleteRating(tastingId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.ratings.detail(tastingId) })
      queryClient.invalidateQueries({
        queryKey: queryKeys.tastings.detail(tastingId),
      })
    },
  })
}
