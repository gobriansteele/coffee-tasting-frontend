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
        <div className="text-center text-ink-muted">Loading tasting details...</div>
      </div>
    )
  }

  if (errorTasting || !tasting) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-danger">
          Error: {errorTasting?.message || 'Tasting not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="bg-card shadow-sm rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">
              {tasting.coffee_name}
            </h1>
            <p className="text-lg text-ink-muted">by {tasting.roaster_name}</p>
            <p className="text-sm text-ink-muted">
              Tasted on {formatLongDate(tasting.created_at)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-warning tabular-nums">
                {tasting.overall_rating}/10
              </div>
              <div className="text-sm text-ink-muted">Overall Rating</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Brewing Parameters */}
        <div className="bg-card shadow-sm rounded-lg p-6">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">
            Brewing Parameters
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-ink-muted">Method:</span>
              <span className="font-medium text-ink">
                {tasting.brew_method.replace('_', ' ')}
              </span>
            </div>
            {tasting.grind_size && (
              <div className="flex justify-between">
                <span className="text-ink-muted">Grind Size:</span>
                <span className="font-medium text-ink">
                  {tasting.grind_size.replace('_', ' ')}
                </span>
              </div>
            )}
            {tasting.coffee_grams && (
              <div className="flex justify-between">
                <span className="text-ink-muted">Coffee:</span>
                <span className="font-medium text-ink tabular-nums">{tasting.coffee_grams}g</span>
              </div>
            )}
            {tasting.water_grams && (
              <div className="flex justify-between">
                <span className="text-ink-muted">Water:</span>
                <span className="font-medium text-ink tabular-nums">{tasting.water_grams}g</span>
              </div>
            )}
            {tasting.water_temp_celsius && (
              <div className="flex justify-between">
                <span className="text-ink-muted">Water Temperature:</span>
                <span className="font-medium text-ink tabular-nums">
                  {tasting.water_temp_celsius}°C
                </span>
              </div>
            )}
            {tasting.brew_time_seconds && (
              <div className="flex justify-between">
                <span className="text-ink-muted">Brew Time:</span>
                <span className="font-medium text-ink tabular-nums">
                  {tasting.brew_time_seconds}s
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Ratings */}
        <div className="bg-card shadow-sm rounded-lg p-6">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">
            Detailed Ratings
          </h2>
          <div className="space-y-3">
            {tasting.aroma_rating && (
              <div className="flex justify-between">
                <span className="text-ink-muted">Aroma:</span>
                <span className="font-medium text-ink tabular-nums">{tasting.aroma_rating}/10</span>
              </div>
            )}
            {tasting.flavor_rating && (
              <div className="flex justify-between">
                <span className="text-ink-muted">Flavor:</span>
                <span className="font-medium text-ink tabular-nums">{tasting.flavor_rating}/10</span>
              </div>
            )}
            {tasting.aftertaste_rating && (
              <div className="flex justify-between">
                <span className="text-ink-muted">Aftertaste:</span>
                <span className="font-medium text-ink tabular-nums">
                  {tasting.aftertaste_rating}/10
                </span>
              </div>
            )}
            {tasting.acidity_rating && (
              <div className="flex justify-between">
                <span className="text-ink-muted">Acidity:</span>
                <span className="font-medium text-ink tabular-nums">{tasting.acidity_rating}/10</span>
              </div>
            )}
            {tasting.body_rating && (
              <div className="flex justify-between">
                <span className="text-ink-muted">Body:</span>
                <span className="font-medium text-ink tabular-nums">{tasting.body_rating}/10</span>
              </div>
            )}
            {tasting.balance_rating && (
              <div className="flex justify-between">
                <span className="text-ink-muted">Balance:</span>
                <span className="font-medium text-ink tabular-nums">{tasting.balance_rating}/10</span>
              </div>
            )}
            {tasting.uniformity_rating && (
              <div className="flex justify-between">
                <span className="text-ink-muted">Uniformity:</span>
                <span className="font-medium text-ink tabular-nums">
                  {tasting.uniformity_rating}/10
                </span>
              </div>
            )}
            {tasting.clean_cup_rating && (
              <div className="flex justify-between">
                <span className="text-ink-muted">Clean Cup:</span>
                <span className="font-medium text-ink tabular-nums">
                  {tasting.clean_cup_rating}/10
                </span>
              </div>
            )}
            {tasting.sweetness_rating && (
              <div className="flex justify-between">
                <span className="text-ink-muted">Sweetness:</span>
                <span className="font-medium text-ink tabular-nums">
                  {tasting.sweetness_rating}/10
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tasting Notes */}
      {tasting.tasting_notes && tasting.tasting_notes.length > 0 && (
        <div className="bg-card shadow-sm rounded-lg p-6 mt-8">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">
            Flavor Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasting.tasting_notes.map((note) => (
              <div
                key={note.id}
                className="border border-border rounded-lg p-3"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-ink">
                    {note.flavor_tag?.name || 'Unknown'}
                  </span>
                  {note.intensity && (
                    <span className="text-sm text-ink-muted">
                      Intensity: {note.intensity}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {note.aroma && (
                    <span className="text-xs bg-primary-soft text-primary px-2 py-1 rounded">
                      Aroma
                    </span>
                  )}
                  {note.flavor && (
                    <span className="text-xs bg-success-soft text-success px-2 py-1 rounded">
                      Flavor
                    </span>
                  )}
                  {note.aftertaste && (
                    <span className="text-xs bg-copper-soft text-copper px-2 py-1 rounded">
                      Aftertaste
                    </span>
                  )}
                </div>
                {note.notes && (
                  <p className="text-sm text-ink-muted">{note.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {tasting.notes && (
        <div className="bg-card shadow-sm rounded-lg p-6 mt-8">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">Notes</h2>
          <p className="text-ink whitespace-pre-wrap">{tasting.notes}</p>
        </div>
      )}

      {/* Session Info */}
      <div className="bg-sand rounded-lg p-4 mt-8">
        <div className="text-sm text-ink-muted">
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
        <Link href="/tastings" className="text-primary hover:underline">
          ← Back to Tastings
        </Link>
        <div className="flex space-x-2">
          <Link
            href={`/tastings/${tastingId}/edit`}
            className="bg-sand text-ink px-4 py-2 rounded-md hover:bg-border transition-colors"
          >
            Edit Tasting
          </Link>
        </div>
      </div>
    </div>
  )
}
