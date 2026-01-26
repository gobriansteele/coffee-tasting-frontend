type PaginationFilters = {
  skip?: number
  limit?: number
}

type CoffeeFilters = PaginationFilters & {
  roaster_id?: string
}

type TastingFilters = PaginationFilters & {
  coffee_id?: string
}

type FlavorFilters = PaginationFilters & {
  category?: string
}

export const queryKeys = {
  all: ['coffee-app'] as const,

  roasters: {
    all: () => [...queryKeys.all, 'roasters'] as const,
    lists: () => [...queryKeys.roasters.all(), 'list'] as const,
    list: (filters?: PaginationFilters) =>
      [...queryKeys.roasters.lists(), filters] as const,
    details: () => [...queryKeys.roasters.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.roasters.details(), id] as const,
  },

  coffees: {
    all: () => [...queryKeys.all, 'coffees'] as const,
    lists: () => [...queryKeys.coffees.all(), 'list'] as const,
    list: (filters?: CoffeeFilters) =>
      [...queryKeys.coffees.lists(), filters] as const,
    details: () => [...queryKeys.coffees.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.coffees.details(), id] as const,
  },

  flavors: {
    all: () => [...queryKeys.all, 'flavors'] as const,
    lists: () => [...queryKeys.flavors.all(), 'list'] as const,
    list: (filters?: FlavorFilters) =>
      [...queryKeys.flavors.lists(), filters] as const,
    details: () => [...queryKeys.flavors.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.flavors.details(), id] as const,
  },

  tastings: {
    all: () => [...queryKeys.all, 'tastings'] as const,
    lists: () => [...queryKeys.tastings.all(), 'list'] as const,
    list: (filters?: TastingFilters) =>
      [...queryKeys.tastings.lists(), filters] as const,
    details: () => [...queryKeys.tastings.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.tastings.details(), id] as const,
  },

  ratings: {
    all: () => [...queryKeys.all, 'ratings'] as const,
    detail: (tastingId: string) =>
      [...queryKeys.ratings.all(), tastingId] as const,
  },

  user: {
    all: () => [...queryKeys.all, 'user'] as const,
    profile: () => [...queryKeys.user.all(), 'profile'] as const,
    flavorProfile: () => [...queryKeys.user.all(), 'flavor-profile'] as const,
  },

  recommendations: {
    all: () => [...queryKeys.all, 'recommendations'] as const,
    similar: (coffeeId: string) =>
      [...queryKeys.recommendations.all(), 'similar', coffeeId] as const,
    byFlavor: (flavorIds: string[]) =>
      [...queryKeys.recommendations.all(), 'by-flavor', flavorIds] as const,
  },
} as const
