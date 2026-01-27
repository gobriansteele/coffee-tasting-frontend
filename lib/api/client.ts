import { createClient } from '@/lib/supabase/client'
import type {
  Roaster,
  Coffee,
  Flavor,
  Tasting,
  Rating,
  UserProfile,
  FlavorProfile,
  ApiFlavorProfileResponse,
  RoasterListResponse,
  CoffeeListResponse,
  FlavorListResponse,
  TastingListResponse,
  SimilarCoffeesResponse,
  FlavorMatchResponse,
  CreateRoasterRequest,
  UpdateRoasterRequest,
  CreateCoffeeRequest,
  UpdateCoffeeRequest,
  CreateFlavorRequest,
  CreateTastingRequest,
  UpdateTastingRequest,
  CreateRatingRequest,
  UpdateRatingRequest,
  UpdateProfileRequest,
} from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type PaginationParams = {
  skip?: number
  limit?: number
}

type CoffeeFilters = PaginationParams & {
  roaster_id?: string
}

type TastingFilters = PaginationParams & {
  coffee_id?: string
}

type FlavorFilters = PaginationParams & {
  category?: string
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

    if (response.status === 401 || response.status === 403) {
      const supabase = createClient()
      await supabase.auth.signOut()

      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }

      throw new Error('Authentication required')
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    if (response.status === 204) {
      return undefined as T
    }

    return response.json()
  }

  // ===========================================================================
  // Roasters
  // ===========================================================================

  async getRoasters(params: PaginationParams & { search?: string } = {}): Promise<RoasterListResponse> {
    const searchParams = new URLSearchParams()
    if (params.skip !== undefined) searchParams.append('skip', params.skip.toString())
    if (params.limit !== undefined) searchParams.append('limit', params.limit.toString())
    if (params.search) searchParams.append('search', params.search)

    const query = searchParams.toString()
    return this.request<RoasterListResponse>(`/roasters${query ? `?${query}` : ''}`)
  }

  async getRoaster(id: string): Promise<Roaster> {
    return this.request<Roaster>(`/roasters/${id}`)
  }

  async createRoaster(data: CreateRoasterRequest): Promise<Roaster> {
    return this.request<Roaster>('/roasters', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateRoaster(id: string, data: UpdateRoasterRequest): Promise<Roaster> {
    return this.request<Roaster>(`/roasters/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteRoaster(id: string): Promise<void> {
    return this.request<void>(`/roasters/${id}`, {
      method: 'DELETE',
    })
  }

  // ===========================================================================
  // Coffees
  // ===========================================================================

  async getCoffees(params: CoffeeFilters = {}): Promise<CoffeeListResponse> {
    const searchParams = new URLSearchParams()
    if (params.skip !== undefined) searchParams.append('skip', params.skip.toString())
    if (params.limit !== undefined) searchParams.append('limit', params.limit.toString())
    if (params.roaster_id) searchParams.append('roaster_id', params.roaster_id)

    const query = searchParams.toString()
    return this.request<CoffeeListResponse>(`/coffees${query ? `?${query}` : ''}`)
  }

  async getCoffee(id: string): Promise<Coffee> {
    return this.request<Coffee>(`/coffees/${id}`)
  }

  async createCoffee(data: CreateCoffeeRequest): Promise<Coffee> {
    return this.request<Coffee>('/coffees', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateCoffee(id: string, data: UpdateCoffeeRequest): Promise<Coffee> {
    return this.request<Coffee>(`/coffees/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteCoffee(id: string): Promise<void> {
    return this.request<void>(`/coffees/${id}`, {
      method: 'DELETE',
    })
  }

  // ===========================================================================
  // Flavors
  // ===========================================================================

  async getFlavors(params: FlavorFilters = {}): Promise<FlavorListResponse> {
    const searchParams = new URLSearchParams()
    if (params.skip !== undefined) searchParams.append('skip', params.skip.toString())
    if (params.limit !== undefined) searchParams.append('limit', params.limit.toString())
    if (params.category) searchParams.append('category', params.category)

    const query = searchParams.toString()
    return this.request<FlavorListResponse>(`/flavors${query ? `?${query}` : ''}`)
  }

  async getFlavor(id: string): Promise<Flavor> {
    return this.request<Flavor>(`/flavors/${id}`)
  }

  async createFlavor(data: CreateFlavorRequest): Promise<Flavor> {
    return this.request<Flavor>('/flavors', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // ===========================================================================
  // Tastings
  // ===========================================================================

  async getTastings(params: TastingFilters = {}): Promise<TastingListResponse> {
    const searchParams = new URLSearchParams()
    if (params.skip !== undefined) searchParams.append('skip', params.skip.toString())
    if (params.limit !== undefined) searchParams.append('limit', params.limit.toString())
    if (params.coffee_id) searchParams.append('coffee_id', params.coffee_id)

    const query = searchParams.toString()
    return this.request<TastingListResponse>(`/tastings${query ? `?${query}` : ''}`)
  }

  async getTasting(id: string): Promise<Tasting> {
    return this.request<Tasting>(`/tastings/${id}`)
  }

  async createTasting(data: CreateTastingRequest): Promise<Tasting> {
    return this.request<Tasting>('/tastings', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTasting(id: string, data: UpdateTastingRequest): Promise<Tasting> {
    return this.request<Tasting>(`/tastings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteTasting(id: string): Promise<void> {
    return this.request<void>(`/tastings/${id}`, {
      method: 'DELETE',
    })
  }

  // ===========================================================================
  // Ratings (nested under tastings)
  // ===========================================================================

  async getRating(tastingId: string): Promise<Rating> {
    return this.request<Rating>(`/tastings/${tastingId}/rating`)
  }

  async createRating(tastingId: string, data: CreateRatingRequest): Promise<Rating> {
    return this.request<Rating>(`/tastings/${tastingId}/rating`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateRating(tastingId: string, data: UpdateRatingRequest): Promise<Rating> {
    return this.request<Rating>(`/tastings/${tastingId}/rating`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteRating(tastingId: string): Promise<void> {
    return this.request<void>(`/tastings/${tastingId}/rating`, {
      method: 'DELETE',
    })
  }

  // ===========================================================================
  // User Profile
  // ===========================================================================

  async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/me')
  }

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    return this.request<UserProfile>('/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async getFlavorProfile(): Promise<FlavorProfile> {
    const response = await this.request<ApiFlavorProfileResponse>('/me/flavor-profile')

    // Build flavor_categories by aggregating counts per category
    const flavorCategories: Record<string, number> = {}
    for (const entry of response.items) {
      const category = entry.flavor.category ?? 'Uncategorized'
      flavorCategories[category] = (flavorCategories[category] ?? 0) + entry.detection_count
    }

    return {
      total_tastings: response.total,
      top_flavors: response.items.map((entry) => ({
        flavor: entry.flavor,
        count: entry.detection_count,
        avg_intensity: entry.avg_intensity,
      })),
      flavor_categories: flavorCategories,
    }
  }

  // ===========================================================================
  // Recommendations
  // ===========================================================================

  async getSimilarCoffees(coffeeId: string, limit?: number): Promise<SimilarCoffeesResponse> {
    const searchParams = new URLSearchParams()
    if (limit !== undefined) searchParams.append('limit', limit.toString())

    const query = searchParams.toString()
    return this.request<SimilarCoffeesResponse>(
      `/recommendations/similar/${coffeeId}${query ? `?${query}` : ''}`
    )
  }

  async getCoffeesByFlavor(
    flavorIds: string[],
    excludeTasted?: boolean
  ): Promise<FlavorMatchResponse> {
    const searchParams = new URLSearchParams()
    searchParams.append('flavor_ids', flavorIds.join(','))
    if (excludeTasted !== undefined) {
      searchParams.append('exclude_tasted', excludeTasted.toString())
    }

    return this.request<FlavorMatchResponse>(
      `/recommendations/by-flavor?${searchParams.toString()}`
    )
  }
}

export type { ApiClient }
export const apiClient = new ApiClient()
