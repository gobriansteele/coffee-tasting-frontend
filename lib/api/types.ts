// =============================================================================
// Enums (source of truth from API spec)
// =============================================================================

export type ProcessingMethod = 'washed' | 'natural' | 'honey' | 'anaerobic'

export type RoastLevel = 'light' | 'medium' | 'medium_dark' | 'dark'

export type BrewMethod =
  | 'pourover'
  | 'espresso'
  | 'french_press'
  | 'aeropress'
  | 'cold_brew'
  | 'drip'

export type GrindSize =
  | 'fine'
  | 'medium_fine'
  | 'medium'
  | 'medium_coarse'
  | 'coarse'

// =============================================================================
// Entity Types
// =============================================================================

export type Roaster = {
  id: string
  name: string
  location?: string
  website?: string
  description?: string
  created_at: string
}

export type Flavor = {
  id: string
  name: string
  category?: string
}

export type Coffee = {
  id: string
  name: string
  roaster: Roaster
  origin_country?: string
  origin_region?: string
  processing_method?: ProcessingMethod
  variety?: string
  roast_level?: RoastLevel
  description?: string
  flavors: Flavor[]
  created_at: string
}

export type DetectedFlavor = {
  flavor: Flavor
  intensity: number
}

export type Rating = {
  id: string
  score: number
  notes?: string
  created_at: string
}

export type Tasting = {
  id: string
  coffee: Coffee
  brew_method?: BrewMethod
  grind_size?: GrindSize
  notes?: string
  detected_flavors: DetectedFlavor[]
  rating?: Rating
  created_at: string
}

export type UserProfile = {
  id: string
  email: string
  first_name?: string
  last_name?: string
  display_name?: string
}

// API response types (raw from backend)
export type ApiFlavorProfileEntry = {
  flavor: Flavor
  detection_count: number
  avg_intensity: number
}

export type ApiFlavorProfileResponse = {
  items: ApiFlavorProfileEntry[]
  total: number
}

// Transformed types (used by frontend)
export type FlavorProfileEntry = {
  flavor: Flavor
  count: number
  avg_intensity: number
}

export type FlavorProfile = {
  total_tastings: number
  top_flavors: FlavorProfileEntry[]
  flavor_categories: Record<string, number>
}

export type SimilarCoffee = {
  coffee: Coffee
  shared_flavors: string[]
  similarity_score: number
}

export type FlavorMatchCoffee = {
  coffee: Coffee
  matching_flavors: string[]
  match_count: number
}

// API response types for flavor match endpoint
export type ApiFlavorMatchItem = Coffee & {
  matching_flavors: number
}

export type ApiFlavorMatchResponse = {
  items: ApiFlavorMatchItem[]
  flavor_ids: string[]
  exclude_tasted: boolean
}

// =============================================================================
// Request Types
// =============================================================================

export type CreateRoasterRequest = {
  name: string
  location?: string
  website?: string
  description?: string
}

export type UpdateRoasterRequest = Partial<CreateRoasterRequest>

export type CreateFlavorRequest = {
  name: string
  category?: string
}

export type CreateCoffeeRequest = {
  name: string
  roaster_id: string
  origin_country?: string
  origin_region?: string
  processing_method?: ProcessingMethod
  variety?: string
  roast_level?: RoastLevel
  description?: string
  flavor_ids?: string[]
}

export type UpdateCoffeeRequest = Partial<Omit<CreateCoffeeRequest, 'roaster_id'>> & {
  roaster_id?: string
}

export type DetectedFlavorInput = {
  flavor_id: string
  intensity: number
}

export type CreateTastingRequest = {
  coffee_id: string
  brew_method?: BrewMethod
  grind_size?: GrindSize
  notes?: string
  detected_flavors?: DetectedFlavorInput[]
  rating?: CreateRatingRequest
}

export type UpdateTastingRequest = Partial<Omit<CreateTastingRequest, 'coffee_id'>>

export type CreateRatingRequest = {
  score: number
  notes?: string
}

export type UpdateRatingRequest = Partial<CreateRatingRequest>

export type UpdateProfileRequest = {
  first_name?: string
  last_name?: string
  display_name?: string
}

// =============================================================================
// Response Types (List endpoints)
// =============================================================================

export type PaginatedResponse<T> = {
  items: T[]
  total: number
  skip: number
  limit: number
}

export type RoasterListResponse = PaginatedResponse<Roaster>

export type CoffeeListResponse = PaginatedResponse<Coffee>

export type FlavorListResponse = PaginatedResponse<Flavor>

export type TastingListResponse = PaginatedResponse<Tasting>

// =============================================================================
// Recommendation Response Types
// =============================================================================

export type SimilarCoffeesResponse = {
  coffee_id: string
  similar: SimilarCoffee[]
}

export type FlavorMatchResponse = {
  flavor_ids: string[]
  matches: FlavorMatchCoffee[]
}
