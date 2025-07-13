import type { ApiClient } from '@/lib/api/client'
import type { Roaster, CreateRoasterRequest } from '@/lib/api/types'

interface RoasterFilters {
  skip?: number
  limit?: number
  search?: string
}

// Pure query functions - no hooks, no React Query dependencies
export const getRoasters = async (apiClient: ApiClient, filters?: RoasterFilters) => {
  return apiClient.getRoasters(
    filters?.skip ?? 0,
    filters?.limit ?? 100,
    filters?.search
  )
}

export const getRoaster = async (apiClient: ApiClient, id: string) => {
  return apiClient.getRoaster(id)
}

export const createRoaster = async (apiClient: ApiClient, data: CreateRoasterRequest) => {
  return apiClient.createRoaster(data)
}

export const updateRoaster = async (apiClient: ApiClient, id: string, data: Partial<Roaster>) => {
  return apiClient.updateRoaster(id, data)
}

export const deleteRoaster = async (apiClient: ApiClient, id: string) => {
  return apiClient.deleteRoaster(id)
}