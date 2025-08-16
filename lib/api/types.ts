export interface Roaster {
  id: string
  name: string
  location?: string
  website?: string
  notes?: string
  created_at: string
  updated_at: string
}

export type CreateRoasterRequest = Omit<
  Roaster,
  'id' | 'created_at' | 'updated_at'
>

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
  coffee_name: string
  roaster_name: string
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
  tasting_notes?: TastingNote[]
}

export interface TastingNote {
  id: string
  tasting_session_id: string
  flavor_tag_id: string
  intensity?: number
  notes?: string
  aroma: boolean
  flavor: boolean
  aftertaste: boolean
  created_at: string
  flavor_tag?: FlavorTag
}

export interface TastingNoteCreate {
  flavor_name: string
  intensity?: number
  notes?: string
  aroma?: boolean
  flavor?: boolean
  aftertaste?: boolean
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
  tastings: TastingSession[]
  total: number
  page: number
  size: number
}

// Enums to match Python API
export enum ProcessingMethod {
  WASHED = 'washed',
  NATURAL = 'natural',
  HONEY = 'honey',
  SEMI_WASHED = 'semi_washed',
  WET_HULLED = 'wet_hulled',
  ANAEROBIC = 'anaerobic',
  CARBONIC_MACERATION = 'carbonic_maceration',
  OTHER = 'other',
}

export enum RoastLevel {
  LIGHT = 'light',
  MEDIUM_LIGHT = 'medium_light',
  MEDIUM = 'medium',
  MEDIUM_DARK = 'medium_dark',
  DARK = 'dark',
  FRENCH = 'french',
  ITALIAN = 'italian',
}

// Create coffee request to match Python API schema
export interface CreateCoffeeRequest {
  name: string
  roaster_id: string

  // Origin info
  origin_country?: string
  origin_region?: string
  farm_name?: string
  producer?: string
  altitude?: string

  // Processing
  processing_method?: ProcessingMethod
  variety?: string

  // Roasting
  roast_level?: RoastLevel
  roast_date?: string

  // Additional info
  description?: string
  price?: number
  bag_size?: string
}

// Updated Coffee interface to match API response
export interface CoffeeResponse {
  id: string
  roaster_id: string
  name: string

  // Origin info
  origin_country?: string
  origin_region?: string
  farm_name?: string
  producer?: string
  altitude?: string

  // Processing
  processing_method?: ProcessingMethod
  variety?: string

  // Roasting
  roast_level?: RoastLevel
  roast_date?: string

  // Additional info
  description?: string
  price?: number
  bag_size?: string

  created_at: string
  updated_at: string
  roaster?: Roaster
}

// Brew methods type to match Python API
export type BrewMethod =
  | 'pour_over'
  | 'espresso'
  | 'french_press'
  | 'aeropress'
  | 'cold_brew'
  | 'moka_pot'
  | 'drip'
  | 'other'

// Grind size type to match Python API
export type GrindSize =
  | 'extra_fine'
  | 'fine'
  | 'medium_fine'
  | 'medium'
  | 'medium_coarse'
  | 'coarse'
  | 'extra_coarse'

// Create tasting session request to match Python API schema
export interface CreateTastingSessionRequest {
  coffee_id: string

  // Brewing parameters
  brew_method: BrewMethod
  grind_size?: GrindSize

  // Measurements
  coffee_dose?: number
  water_amount?: number
  water_temperature?: number
  brew_time?: string

  // Equipment
  grinder?: string
  brewing_device?: string
  filter_type?: string

  // Session notes
  session_notes?: string
  overall_rating?: number
  would_buy_again?: boolean

  // Tasting notes
  tasting_notes?: TastingNoteCreate[]
}
