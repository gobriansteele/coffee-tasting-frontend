'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiClient } from '@/hooks/use-api-client'
import { queryKeys } from '@/lib/query-keys'
import type { Tasting, CreateTastingRequest, UpdateTastingRequest } from '@/lib/api/types'
import { useRouter } from 'next/navigation'

type TastingFilters = {
  skip?: number
  limit?: number
  coffee_id?: string
}

export const useTastings = (filters?: TastingFilters) => {
  const apiClient = useApiClient()

  return useQuery({
    queryKey: queryKeys.tastings.list(filters),
    queryFn: () => apiClient.getTastings(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useTasting = (id: string) => {
  const apiClient = useApiClient()

  return useQuery({
    queryKey: queryKeys.tastings.detail(id),
    queryFn: () => apiClient.getTasting(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  })
}

export const useCreateTasting = () => {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: CreateTastingRequest) => apiClient.createTasting(data),
    onSuccess: (newTasting) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tastings.lists() })
      queryClient.setQueryData(
        queryKeys.tastings.detail(newTasting.id),
        newTasting
      )
      router.push(`/tastings/${newTasting.id}`)
    },
  })
}

export const useUpdateTasting = () => {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTastingRequest }) =>
      apiClient.updateTasting(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.tastings.detail(id),
      })

      const previousTasting = queryClient.getQueryData(
        queryKeys.tastings.detail(id)
      )

      queryClient.setQueryData(
        queryKeys.tastings.detail(id),
        (old: Tasting | undefined) => (old ? { ...old, ...data } : old)
      )

      return { previousTasting }
    },
    onError: (_err, { id }, context) => {
      if (context?.previousTasting) {
        queryClient.setQueryData(
          queryKeys.tastings.detail(id),
          context.previousTasting
        )
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tastings.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.tastings.lists() })
    },
  })
}

export const useDeleteTasting = () => {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteTasting(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.tastings.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.tastings.lists() })
      router.push('/tastings')
    },
  })
}
