'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiClient } from '@/hooks/use-api-client'
import { queryKeys } from '@/lib/query-keys'
import type { Coffee, CoffeeInput } from '@/lib/api/types'

export const useCreateCoffeeFromInput = () => {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<Coffee, Error, CoffeeInput>({
    mutationFn: async (input) => {
      const roaster_id = input.roaster.existing_id
        ?? (await apiClient.createRoaster({
            name: input.roaster.name,
            location: input.roaster.location,
          })).id

      return apiClient.createCoffee({
        name: input.name,
        roaster_id,
        origin_country: input.origin_country,
        origin_region: input.origin_region,
        processing_method: input.processing_method,
        variety: input.variety,
        roast_level: input.roast_level,
        description: input.description,
      })
    },
    onSuccess: (newCoffee) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roasters.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.coffees.lists() })
      queryClient.setQueryData(
        queryKeys.coffees.detail(newCoffee.id),
        newCoffee
      )
    },
  })
}
