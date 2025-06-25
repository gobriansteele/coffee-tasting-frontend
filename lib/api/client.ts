import { createClient } from '@/lib/supabase/client'
import type {
  Roaster,
  Coffee,
  CoffeeResponse,
  CreateCoffeeRequest,
  FlavorTag,
  TastingSession,
  TastingNote,
  RoasterListResponse,
  CoffeeListResponse,
  FlavorTagListResponse,
  TastingSessionListResponse,
  PaginatedResponse,
} from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type GetCoffeesParams = {
  skip?: number
  limit?: number
  roasterId?: string
}

class ApiClient {
  private async getAuthToken() {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session?.access_token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken()

    const response = await fetch(`${API_URL}/api/v1${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  // Roasters
  async getRoasters(
    skip: number = 0,
    limit: number = 100,
    search?: string
  ): Promise<RoasterListResponse> {
    const params = new URLSearchParams()
    params.append('skip', skip.toString())
    params.append('limit', limit.toString())
    if (search) params.append('search', search)

    return this.request<RoasterListResponse>(`/roasters?${params.toString()}`)
  }

  async getRoaster(id: string): Promise<Roaster> {
    return this.request<Roaster>(`/roasters/${id}`)
  }

  async createRoaster(data: Partial<Roaster>): Promise<Roaster> {
    return this.request<Roaster>('/roasters', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateRoaster(id: string, data: Partial<Roaster>): Promise<Roaster> {
    return this.request<Roaster>(`/roasters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteRoaster(id: string): Promise<void> {
    return this.request<void>(`/roasters/${id}`, {
      method: 'DELETE',
    })
  }

  // Coffees
  async getCoffees({
    skip,
    limit,
    roasterId,
  }: GetCoffeesParams): Promise<CoffeeListResponse> {
    if (!roasterId) {
      // should be adding coffees in this case
      return {
        coffees: [],
        total: 0,
        page: 0,
        size: 0,
      }
    }

    const params = new URLSearchParams()
    params.append('skip', skip?.toString() || '0')
    params.append('limit', limit?.toString() || '100')
    if (roasterId) params.append('roaster_id', roasterId)

    return this.request<CoffeeListResponse>(`/coffees?${params.toString()}`)
  }

  async getCoffee(id: string): Promise<Coffee> {
    return this.request<Coffee>(`/coffees/${id}`)
  }

  async createCoffee(data: CreateCoffeeRequest): Promise<CoffeeResponse> {
    return this.request<CoffeeResponse>('/coffees', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateCoffee(id: string, data: Partial<Coffee>): Promise<Coffee> {
    return this.request<Coffee>(`/coffees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteCoffee(id: string): Promise<void> {
    return this.request<void>(`/coffees/${id}`, {
      method: 'DELETE',
    })
  }

  // Flavor Tags
  async getFlavorTags(
    skip: number = 0,
    limit: number = 100
  ): Promise<FlavorTagListResponse> {
    const params = new URLSearchParams()
    params.append('skip', skip.toString())
    params.append('limit', limit.toString())

    return this.request<FlavorTagListResponse>(
      `/flavor-tags?${params.toString()}`
    )
  }

  async createFlavorTag(data: Partial<FlavorTag>): Promise<FlavorTag> {
    return this.request<FlavorTag>('/flavor-tags', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Tasting Sessions
  async getTastingSessions(
    skip: number = 0,
    limit: number = 100,
    coffeeId?: string
  ): Promise<TastingSessionListResponse> {
    const params = new URLSearchParams()
    params.append('skip', skip.toString())
    params.append('limit', limit.toString())
    if (coffeeId) params.append('coffee_id', coffeeId)

    return this.request<TastingSessionListResponse>(
      `/tasting-sessions?${params.toString()}`
    )
  }

  async getTastingSession(id: string): Promise<TastingSession> {
    return this.request<TastingSession>(`/tasting-sessions/${id}`)
  }

  async createTastingSession(
    data: Partial<TastingSession>
  ): Promise<TastingSession> {
    return this.request<TastingSession>('/tasting-sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTastingSession(
    id: string,
    data: Partial<TastingSession>
  ): Promise<TastingSession> {
    return this.request<TastingSession>(`/tasting-sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteTastingSession(id: string): Promise<void> {
    return this.request<void>(`/tasting-sessions/${id}`, {
      method: 'DELETE',
    })
  }

  // Tasting Notes
  async createTastingNote(data: Partial<TastingNote>): Promise<TastingNote> {
    return this.request<TastingNote>('/tasting-notes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteTastingNote(id: string): Promise<void> {
    return this.request<void>(`/tasting-notes/${id}`, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient()
