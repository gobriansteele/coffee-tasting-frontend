'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiClient } from '@/hooks/use-api-client'
import { queryKeys } from '@/lib/query-keys'
import type { Coffee, CreateCoffeeRequest, UpdateCoffeeRequest } from '@/lib/api/types'
import { useRouter } from 'next/navigation'

type CoffeeFilters = {
  skip?: number
  limit?: number
  roaster_id?: string
}

export const useCoffees = (filters?: CoffeeFilters) => {
  const apiClient = useApiClient()

  return useQuery({
    queryKey: queryKeys.coffees.list(filters),
    queryFn: () => apiClient.getCoffees(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useCoffee = (id: string) => {
  const apiClient = useApiClient()

  return useQuery({
    queryKey: queryKeys.coffees.detail(id),
    queryFn: () => apiClient.getCoffee(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  })
}

export const useCreateCoffee = () => {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: CreateCoffeeRequest) => apiClient.createCoffee(data),
    onSuccess: (newCoffee) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coffees.lists() })
      queryClient.setQueryData(
        queryKeys.coffees.detail(newCoffee.id),
        newCoffee
      )
      router.push(`/coffees/${newCoffee.id}`)
    },
  })
}

export const useUpdateCoffee = () => {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCoffeeRequest }) =>
      apiClient.updateCoffee(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.coffees.detail(id),
      })

      const previousCoffee = queryClient.getQueryData(
        queryKeys.coffees.detail(id)
      )

      queryClient.setQueryData(
        queryKeys.coffees.detail(id),
        (old: Coffee | undefined) => (old ? { ...old, ...data } : old)
      )

      return { previousCoffee }
    },
    onError: (_err, { id }, context) => {
      if (context?.previousCoffee) {
        queryClient.setQueryData(
          queryKeys.coffees.detail(id),
          context.previousCoffee
        )
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coffees.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.coffees.lists() })
    },
  })
}

export const useDeleteCoffee = () => {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteCoffee(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.coffees.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.coffees.lists() })
      router.push('/coffees')
    },
  })
}
