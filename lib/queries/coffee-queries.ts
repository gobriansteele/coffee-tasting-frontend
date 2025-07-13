import type { ApiClient } from '@/lib/api/client'
import type { Coffee, CreateCoffeeRequest } from '@/lib/api/types'

interface CoffeeFilters {
  roasterId?: string
  skip?: number
  limit?: number
}

// Pure query functions - no hooks, no React Query dependencies
// These can be used in both client and server components
export const getCoffees = async (apiClient: ApiClient, filters: CoffeeFilters = {}) => {
  return apiClient.getCoffees(filters)
}

export const getCoffee = async (apiClient: ApiClient, id: string) => {
  return apiClient.getCoffee(id)
}

export const createCoffee = async (apiClient: ApiClient, data: CreateCoffeeRequest) => {
  return apiClient.createCoffee(data)
}

export const updateCoffee = async (apiClient: ApiClient, id: string, data: Partial<Coffee>) => {
  return apiClient.updateCoffee(id, data)
}

export const deleteCoffee = async (apiClient: ApiClient, id: string) => {
  return apiClient.deleteCoffee(id)
}