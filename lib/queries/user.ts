'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiClient } from '@/hooks/use-api-client'
import { queryKeys } from '@/lib/query-keys'
import type { UpdateProfileRequest } from '@/lib/api/types'

export const useProfile = () => {
  const apiClient = useApiClient()

  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: () => apiClient.getProfile(),
    staleTime: 5 * 60 * 1000,
  })
}

export const useUpdateProfile = () => {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => apiClient.updateProfile(data),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(queryKeys.user.profile(), updatedProfile)
    },
  })
}

export const useFlavorProfile = () => {
  const apiClient = useApiClient()

  return useQuery({
    queryKey: queryKeys.user.flavorProfile(),
    queryFn: () => apiClient.getFlavorProfile(),
    staleTime: 5 * 60 * 1000,
  })
}
