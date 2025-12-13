'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-keys'
import { formatShortDate } from '@/lib/utils/date'

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
    queryKey: queryKeys.tastings.list({ coffeeId }),
    queryFn: () => apiClient.getTastingSessions(0, 100, coffeeId),
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
                href={`/roasters/${coffee.roaster_id}`}
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
                <p>🌍 Country: {coffee.origin_country}</p>
              )}
              {coffee.origin_region && <p>🗺️ Region: {coffee.origin_region}</p>}
              {coffee.farm_name && <p>🏡 Farm: {coffee.farm_name}</p>}
              {coffee.producer && <p>👨‍🌾 Producer: {coffee.producer}</p>}
              {coffee.altitude && <p>⛰️ Altitude: {coffee.altitude}</p>}
            </div>
          </div>

          {/* Processing & Roasting */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-ink">
              Processing & Roasting
            </h3>
            <div className="space-y-2 text-ink-muted">
              {coffee.processing_method && (
                <p>⚙️ Process: {coffee.processing_method}</p>
              )}
              {coffee.variety && <p>🌱 Variety: {coffee.variety}</p>}
              {coffee.roast_level && (
                <p>🔥 Roast Level: {coffee.roast_level}</p>
              )}
              {coffee.roast_date && <p>📅 Roast Date: {coffee.roast_date}</p>}
              {coffee.price && <p>💰 Price: ${coffee.price}</p>}
              {coffee.bag_size && <p>📦 Bag Size: {coffee.bag_size}</p>}
            </div>
          </div>
        </div>

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

      {tastings?.tastings.length === 0 ? (
        <div className="text-center py-8 bg-sand rounded-lg">
          <p className="text-ink-muted">
            No tasting sessions found for this coffee.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tastings?.tastings.map((tasting) => (
            <Link
              key={tasting.id}
              href={`/tastings/${tasting.id}`}
              className="bg-card rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-ink">
                  {tasting.brew_method.replace('_', ' ')}
                </h3>
                <div className="flex items-center">
                  <span className="text-warning">⭐</span>
                  <span className="ml-1 text-sm font-medium text-ink tabular-nums">
                    {tasting.overall_rating}/10
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-sm text-ink-muted">
                {tasting.coffee_grams && tasting.water_grams && (
                  <p className="tabular-nums">
                    ☕ {tasting.coffee_grams}g coffee, {tasting.water_grams}g
                    water
                  </p>
                )}
                {tasting.water_temp_celsius && (
                  <p className="tabular-nums">🌡️ {tasting.water_temp_celsius}°C</p>
                )}
                {tasting.brew_time_seconds && (
                  <p className="tabular-nums">⏱️ {tasting.brew_time_seconds}s</p>
                )}
                {tasting.grind_size && (
                  <p>🔧 {tasting.grind_size.replace('_', ' ')}</p>
                )}
                <p className="text-xs text-ink-muted">
                  {formatShortDate(tasting.created_at)}
                </p>
              </div>

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
