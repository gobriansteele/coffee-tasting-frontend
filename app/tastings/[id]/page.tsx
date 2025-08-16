'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-keys'
import { formatLongDate, formatTime } from '@/lib/utils/date'

export default function TastingDetailPage() {
  const params = useParams()
  const tastingId = params.id as string

  const {
    data: tasting,
    isLoading: isLoadingTasting,
    error: errorTasting,
  } = useQuery({
    queryKey: queryKeys.tastings.detail(tastingId),
    queryFn: () => apiClient.getTastingSession(tastingId),
    enabled: !!tastingId,
  })
  console.log(tasting)

  if (isLoadingTasting) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading tasting details...</div>
      </div>
    )
  }

  if (errorTasting || !tasting) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-red-600">
          Error: {errorTasting?.message || 'Tasting not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {tasting.coffee_name}
            </h1>
            <p className="text-lg text-gray-600">by {tasting.roaster_name}</p>
            <p className="text-sm text-gray-500">
              Tasted on {formatLongDate(tasting.created_at)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {tasting.overall_rating}/10
              </div>
              <div className="text-sm text-gray-500">Overall Rating</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Brewing Parameters */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Brewing Parameters
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Method:</span>
              <span className="font-medium">
                {tasting.brew_method.replace('_', ' ')}
              </span>
            </div>
            {tasting.grind_size && (
              <div className="flex justify-between">
                <span className="text-gray-600">Grind Size:</span>
                <span className="font-medium">
                  {tasting.grind_size.replace('_', ' ')}
                </span>
              </div>
            )}
            {tasting.coffee_grams && (
              <div className="flex justify-between">
                <span className="text-gray-600">Coffee:</span>
                <span className="font-medium">{tasting.coffee_grams}g</span>
              </div>
            )}
            {tasting.water_grams && (
              <div className="flex justify-between">
                <span className="text-gray-600">Water:</span>
                <span className="font-medium">{tasting.water_grams}g</span>
              </div>
            )}
            {tasting.water_temp_celsius && (
              <div className="flex justify-between">
                <span className="text-gray-600">Water Temperature:</span>
                <span className="font-medium">
                  {tasting.water_temp_celsius}°C
                </span>
              </div>
            )}
            {tasting.brew_time_seconds && (
              <div className="flex justify-between">
                <span className="text-gray-600">Brew Time:</span>
                <span className="font-medium">
                  {tasting.brew_time_seconds}s
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Ratings */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Detailed Ratings
          </h2>
          <div className="space-y-3">
            {tasting.aroma_rating && (
              <div className="flex justify-between">
                <span className="text-gray-600">Aroma:</span>
                <span className="font-medium">{tasting.aroma_rating}/10</span>
              </div>
            )}
            {tasting.flavor_rating && (
              <div className="flex justify-between">
                <span className="text-gray-600">Flavor:</span>
                <span className="font-medium">{tasting.flavor_rating}/10</span>
              </div>
            )}
            {tasting.aftertaste_rating && (
              <div className="flex justify-between">
                <span className="text-gray-600">Aftertaste:</span>
                <span className="font-medium">
                  {tasting.aftertaste_rating}/10
                </span>
              </div>
            )}
            {tasting.acidity_rating && (
              <div className="flex justify-between">
                <span className="text-gray-600">Acidity:</span>
                <span className="font-medium">{tasting.acidity_rating}/10</span>
              </div>
            )}
            {tasting.body_rating && (
              <div className="flex justify-between">
                <span className="text-gray-600">Body:</span>
                <span className="font-medium">{tasting.body_rating}/10</span>
              </div>
            )}
            {tasting.balance_rating && (
              <div className="flex justify-between">
                <span className="text-gray-600">Balance:</span>
                <span className="font-medium">{tasting.balance_rating}/10</span>
              </div>
            )}
            {tasting.uniformity_rating && (
              <div className="flex justify-between">
                <span className="text-gray-600">Uniformity:</span>
                <span className="font-medium">
                  {tasting.uniformity_rating}/10
                </span>
              </div>
            )}
            {tasting.clean_cup_rating && (
              <div className="flex justify-between">
                <span className="text-gray-600">Clean Cup:</span>
                <span className="font-medium">
                  {tasting.clean_cup_rating}/10
                </span>
              </div>
            )}
            {tasting.sweetness_rating && (
              <div className="flex justify-between">
                <span className="text-gray-600">Sweetness:</span>
                <span className="font-medium">
                  {tasting.sweetness_rating}/10
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tasting Notes */}
      {tasting.tasting_notes && tasting.tasting_notes.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Flavor Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasting.tasting_notes.map((note) => (
              <div
                key={note.id}
                className="border border-gray-200 rounded-lg p-3"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-900">
                    {note.flavor_tag?.name || 'Unknown'}
                  </span>
                  {note.intensity && (
                    <span className="text-sm text-gray-500">
                      Intensity: {note.intensity}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {note.aroma && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Aroma
                    </span>
                  )}
                  {note.flavor && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Flavor
                    </span>
                  )}
                  {note.aftertaste && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      Aftertaste
                    </span>
                  )}
                </div>
                {note.notes && (
                  <p className="text-sm text-gray-600">{note.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {tasting.notes && (
        <div className="bg-white shadow-md rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{tasting.notes}</p>
        </div>
      )}

      {/* Session Info */}
      <div className="bg-gray-50 rounded-lg p-4 mt-8">
        <div className="text-sm text-gray-500">
          <p>
            Session created: {formatLongDate(tasting.created_at)} at{' '}
            {formatTime(tasting.created_at)}
          </p>
          {tasting.updated_at !== tasting.created_at && (
            <p>
              Last updated: {formatLongDate(tasting.updated_at)} at{' '}
              {formatTime(tasting.updated_at)}
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <Link href="/tastings" className="text-blue-600 hover:underline">
          ← Back to Tastings
        </Link>
        <div className="flex space-x-2">
          <Link
            href={`/tastings/${tastingId}/edit`}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Edit Tasting
          </Link>
        </div>
      </div>
    </div>
  )
}
