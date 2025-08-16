'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-keys'
import { formatShortDate } from '@/lib/utils/date'

export default function CoffeeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const coffeeId = params.id as string
  const queryClient = useQueryClient()
  const isDeletingRef = useRef(false)

  const {
    data: coffee,
    isLoading: isLoadingCoffee,
    error: errorCoffee,
  } = useQuery({
    queryKey: queryKeys.coffees.detail(coffeeId),
    queryFn: () => apiClient.getCoffee(coffeeId),
    enabled: !!coffeeId && !isDeletingRef.current,
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

  const { mutate: deleteCoffee, isPending: deleting } = useMutation({
    mutationFn: (coffeeId: string) => apiClient.deleteCoffee(coffeeId),
  })

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this coffee?')) {
      return
    }

    isDeletingRef.current = true
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
        <div className="text-center">Loading coffee details...</div>
      </div>
    )
  }

  if (errorCoffee || errorTastings || !coffee) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-red-600">
          Error:{' '}
          {errorCoffee?.message || errorTastings?.message || 'Coffee not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Coffee Information Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{coffee.name}</h1>
            {coffee.roaster && (
              <Link
                href={`/roasters/${coffee.roaster_id}`}
                className="text-lg text-blue-600 hover:underline"
              >
                by {coffee.roaster.name}
              </Link>
            )}
          </div>
          <div className="flex space-x-2">
            <Link
              href={`/coffees/${coffeeId}/edit`}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Origin Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Origin</h3>
            <div className="space-y-2 text-gray-600">
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
            <h3 className="text-lg font-semibold text-gray-900">
              Processing & Roasting
            </h3>
            <div className="space-y-2 text-gray-600">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Description
            </h3>
            <p className="text-gray-600">{coffee.description}</p>
          </div>
        )}
      </div>

      {/* Tastings Section */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Tasting Sessions
        </h2>
        <Link
          href={`/tastings/new?coffeeId=${coffeeId}`}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Tasting
        </Link>
      </div>

      {tastings?.tastings.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            No tasting sessions found for this coffee.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tastings?.tastings.map((tasting) => (
            <Link
              key={tasting.id}
              href={`/tastings/${tasting.id}`}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">
                  {tasting.brew_method.replace('_', ' ')}
                </h3>
                <div className="flex items-center">
                  <span className="text-yellow-500">⭐</span>
                  <span className="ml-1 text-sm font-medium">
                    {tasting.overall_rating}/10
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                {tasting.coffee_grams && tasting.water_grams && (
                  <p>
                    ☕ {tasting.coffee_grams}g coffee, {tasting.water_grams}g
                    water
                  </p>
                )}
                {tasting.water_temp_celsius && (
                  <p>🌡️ {tasting.water_temp_celsius}°C</p>
                )}
                {tasting.brew_time_seconds && (
                  <p>⏱️ {tasting.brew_time_seconds}s</p>
                )}
                {tasting.grind_size && (
                  <p>🔧 {tasting.grind_size.replace('_', ' ')}</p>
                )}
                <p className="text-xs text-gray-500">
                  {formatShortDate(tasting.created_at)}
                </p>
              </div>

              {tasting.notes && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 line-clamp-2">
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
