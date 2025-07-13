'use client'

import { apiClient } from '@/lib/api/client'

// Simple hook that returns the singleton API client instance
export const useApiClient = () => {
  return apiClient
}