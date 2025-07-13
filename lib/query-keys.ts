interface CoffeeFilters {
  roasterId?: string
  skip?: number
  limit?: number
}

interface TastingFilters {
  coffeeId?: string
  skip?: number
  limit?: number
}

interface PaginationFilters {
  skip?: number
  limit?: number
}

export const queryKeys = {
  all: ['coffee-app'] as const,
  roasters: {
    all: () => [...queryKeys.all, 'roasters'] as const,
    lists: () => [...queryKeys.roasters.all(), 'list'] as const,
    list: (filters?: PaginationFilters) => [...queryKeys.roasters.lists(), filters] as const,
    details: () => [...queryKeys.roasters.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.roasters.details(), id] as const,
  },
  coffees: {
    all: () => [...queryKeys.all, 'coffees'] as const,
    lists: () => [...queryKeys.coffees.all(), 'list'] as const,
    list: (filters?: CoffeeFilters) => [...queryKeys.coffees.lists(), filters] as const,
    details: () => [...queryKeys.coffees.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.coffees.details(), id] as const,
  },
  tastings: {
    all: () => [...queryKeys.all, 'tastings'] as const,
    lists: () => [...queryKeys.tastings.all(), 'list'] as const,
    list: (filters?: TastingFilters) => [...queryKeys.tastings.lists(), filters] as const,
    details: () => [...queryKeys.tastings.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.tastings.details(), id] as const,
  },
} as const