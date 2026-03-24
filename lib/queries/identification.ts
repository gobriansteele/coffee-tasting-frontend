'use client'

import { useMutation } from '@tanstack/react-query'
import { useApiClient } from '@/hooks/use-api-client'

export const useIdentifyCoffee = () => {
  const apiClient = useApiClient()

  return useMutation({
    mutationFn: (images: File[]) => apiClient.identifyCoffee(images),
  })
}
