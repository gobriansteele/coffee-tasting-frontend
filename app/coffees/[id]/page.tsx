'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-keys'
import { formatShortDate } from '@/lib/utils/date'
import type { Tasting } from '@/lib/api/types'

export default function CoffeeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const coffeeId = params.id as string
  const queryClient = useQueryClient()

  const { mutate: deleteCoffee, isPending: isDeleting } = useMutation({
    mutationFn: (coffeeId: string) => apiClient.deleteCoffee(coffeeId),
  })

  const {
    data: coffee,
    isLoading: isLoadingCoffee,
    error: errorCoffee,
  } = useQuery({
    queryKey: queryKeys.coffees.detail(coffeeId),
    queryFn: () => apiClient.getCoffee(coffeeId),
    enabled: !!coffeeId && !isDeleting,
  })

  const {
    data: tastings,
    isLoading: isLoadingTastings,
    error: errorTastings,
  } = useQuery({
    queryKey: queryKeys.tastings.list({ coffee_id: coffeeId }),
    queryFn: () => apiClient.getTastings({ coffee_id: coffeeId }),
    enabled: !!coffeeId,
  })

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this coffee?')) {
      return
    }

    deleteCoffee(coffeeId, {
      onSuccess: () => {
        router.push('/coffees')
        queryClient.invalidateQueries({ queryKey: queryKeys.coffees.all() })
      },
    })
  }

  if (isLoadingCoffee || isLoadingTastings) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-ink-muted">Loading coffee details...</div>
      </div>
    )
  }

  if (errorCoffee || errorTastings || !coffee) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-danger">
          Error:{' '}
          {errorCoffee?.message || errorTastings?.message || 'Coffee not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Coffee Information Section */}
      <div className="bg-card shadow-sm rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">{coffee.name}</h1>
            {coffee.roaster && (
              <Link
                href={`/roasters/${coffee.roaster.id}`}
                className="text-lg text-primary hover:underline"
              >
                by {coffee.roaster.name}
              </Link>
            )}
          </div>
          <div className="flex space-x-2">
            <Link
              href={`/coffees/${coffeeId}/edit`}
              className="bg-sand text-ink px-4 py-2 rounded-md hover:bg-border transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-danger text-white px-4 py-2 rounded-md hover:bg-danger/90 transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Origin Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-ink">Origin</h3>
            <div className="space-y-2 text-ink-muted">
              {coffee.origin_country && (
                <p>Country: {coffee.origin_country}</p>
              )}
              {coffee.origin_region && <p>Region: {coffee.origin_region}</p>}
            </div>
          </div>

          {/* Processing & Roasting */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-ink">
              Processing & Roasting
            </h3>
            <div className="space-y-2 text-ink-muted">
              {coffee.processing_method && (
                <p className="capitalize">Process: {coffee.processing_method}</p>
              )}
              {coffee.variety && <p>Variety: {coffee.variety}</p>}
              {coffee.roast_level && (
                <p className="capitalize">Roast Level: {coffee.roast_level.replace('_', ' ')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Flavor Tags */}
        {coffee.flavors && coffee.flavors.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-ink mb-2">Flavors</h3>
            <div className="flex flex-wrap gap-2">
              {coffee.flavors.map((flavor) => (
                <span
                  key={flavor.id}
                  className="bg-primary-soft text-primary px-3 py-1 rounded-full text-sm"
                >
                  {flavor.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {coffee.description && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-ink mb-2">
              Description
            </h3>
            <p className="text-ink-muted">{coffee.description}</p>
          </div>
        )}
      </div>

      {/* Tastings Section */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Tasting Sessions
        </h2>
        <Link
          href={`/tastings/new?coffeeId=${coffeeId}`}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover transition-colors"
        >
          Add Tasting
        </Link>
      </div>

      {tastings?.items.length === 0 ? (
        <div className="text-center py-8 bg-sand rounded-lg">
          <p className="text-ink-muted">
            No tasting sessions found for this coffee.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tastings?.items.map((tasting: Tasting) => (
            <Link
              key={tasting.id}
              href={`/tastings/${tasting.id}`}
              className="bg-card rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-ink capitalize">
                  {tasting.brew_method?.replace('_', ' ') || 'Tasting'}
                </h3>
                {tasting.rating && (
                  <div className="flex items-center">
                    <span className="text-warning">⭐</span>
                    <span className="ml-1 text-sm font-medium text-ink tabular-nums">
                      {tasting.rating.score}/5
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1 text-sm text-ink-muted">
                {tasting.grind_size && (
                  <p className="capitalize">Grind: {tasting.grind_size.replace('_', ' ')}</p>
                )}
                <p className="text-xs text-ink-muted">
                  {formatShortDate(tasting.created_at)}
                </p>
              </div>

              {tasting.detected_flavors && tasting.detected_flavors.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {tasting.detected_flavors.slice(0, 3).map((df, index) => (
                    <span
                      key={index}
                      className="bg-sand text-ink-muted px-2 py-0.5 rounded text-xs"
                    >
                      {df.flavor.name}
                    </span>
                  ))}
                  {tasting.detected_flavors.length > 3 && (
                    <span className="text-xs text-ink-muted">
                      +{tasting.detected_flavors.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {tasting.notes && (
                <div className="mt-2">
                  <p className="text-xs text-ink-muted line-clamp-2">
                    {tasting.notes}
                  </p>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
