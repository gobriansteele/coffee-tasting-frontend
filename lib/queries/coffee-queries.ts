import type { ApiClient } from '@/lib/api/client'
import type { Coffee, CreateCoffeeRequest } from '@/lib/api/types'

export const getCoffee = async (apiClient: ApiClient, id: string) => {
  return apiClient.getCoffee(id)
}

export const createCoffee = async (
  apiClient: ApiClient,
  data: CreateCoffeeRequest
) => {
  return apiClient.createCoffee(data)
}

export const updateCoffee = async (
  apiClient: ApiClient,
  id: string,
  data: Partial<Coffee>
) => {
  return apiClient.updateCoffee(id, data)
}

export const deleteCoffee = async (apiClient: ApiClient, id: string) => {
  return apiClient.deleteCoffee(id)
}
