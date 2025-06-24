export interface Roaster {
  id: string
  name: string
  location?: string
  website?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Coffee {
  id: string
  roaster_id: string
  name: string
  origin?: string
  process?: string
  varietal?: string
  altitude?: string
  harvest_date?: string
  roast_date?: string
  price?: number
  notes?: string
  created_at: string
  updated_at: string
  roaster?: Roaster
}

export interface FlavorTag {
  id: string
  name: string
  category?: string
  created_at: string
}

export interface TastingSession {
  id: string
  coffee_id: string
  user_id: string
  brew_method: string
  grind_size?: string
  water_temp_celsius?: number
  brew_time_seconds?: number
  coffee_grams?: number
  water_grams?: number
  overall_rating: number
  aroma_rating?: number
  flavor_rating?: number
  aftertaste_rating?: number
  acidity_rating?: number
  body_rating?: number
  balance_rating?: number
  uniformity_rating?: number
  clean_cup_rating?: number
  sweetness_rating?: number
  notes?: string
  tasting_date: string
  created_at: string
  updated_at: string
  coffee?: Coffee
  tasting_notes?: TastingNote[]
}

export interface TastingNote {
  id: string
  tasting_session_id: string
  flavor_tag_id: string
  intensity?: number
  notes?: string
  created_at: string
  flavor_tag?: FlavorTag
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  size: number
}

export interface RoasterListResponse {
  roasters: Roaster[]
  total: number
  page: number
  size: number
}

export interface CoffeeListResponse {
  coffees: Coffee[]
  total: number
  page: number
  size: number
}

export interface FlavorTagListResponse {
  flavor_tags: FlavorTag[]
  total: number
  page: number
  size: number
}

export interface TastingSessionListResponse {
  tasting_sessions: TastingSession[]
  total: number
  page: number
  size: number
}