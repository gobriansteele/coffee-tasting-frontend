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
    queryFn: () => apiClient.getTasting(tastingId),
    enabled: !!tastingId,
  })

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
              {tasting.coffee.name}
            </h1>
            <p className="text-lg text-ink-muted">
              by {tasting.coffee.roaster?.name || 'Unknown Roaster'}
            </p>
            <p className="text-sm text-ink-muted">
              Tasted on {formatLongDate(tasting.created_at)}
            </p>
          </div>
          {tasting.rating && (
            <div className="flex items-center space-x-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-warning tabular-nums">
                  {tasting.rating.score}/5
                </div>
                <div className="text-sm text-ink-muted">Rating</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Brewing Parameters */}
        <div className="bg-card shadow-sm rounded-lg p-6">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">
            Brewing Parameters
          </h2>
          <div className="space-y-3">
            {tasting.brew_method && (
              <div className="flex justify-between">
                <span className="text-ink-muted">Method:</span>
                <span className="font-medium text-ink capitalize">
                  {tasting.brew_method.replace('_', ' ')}
                </span>
              </div>
            )}
            {tasting.grind_size && (
              <div className="flex justify-between">
                <span className="text-ink-muted">Grind Size:</span>
                <span className="font-medium text-ink capitalize">
                  {tasting.grind_size.replace('_', ' ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Rating & Notes */}
        <div className="bg-card shadow-sm rounded-lg p-6">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">
            Rating
          </h2>
          {tasting.rating ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-ink-muted">Score:</span>
                <span className="font-medium text-ink tabular-nums">
                  {tasting.rating.score}/5
                </span>
              </div>
              {tasting.rating.notes && (
                <div>
                  <span className="text-ink-muted">Rating Notes:</span>
                  <p className="mt-1 text-ink">{tasting.rating.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-ink-muted">No rating recorded</p>
          )}
        </div>
      </div>

      {/* Detected Flavors */}
      {tasting.detected_flavors && tasting.detected_flavors.length > 0 && (
        <div className="bg-card shadow-sm rounded-lg p-6 mt-8">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">
            Detected Flavors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasting.detected_flavors.map((df, index) => (
              <div
                key={index}
                className="border border-border rounded-lg p-3"
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium text-ink">
                    {df.flavor.name}
                  </span>
                  <span className="text-sm text-ink-muted">
                    Intensity: {df.intensity}/10
                  </span>
                </div>
                {df.flavor.category && (
                  <span className="text-xs bg-sand text-ink-muted px-2 py-1 rounded mt-2 inline-block">
                    {df.flavor.category}
                  </span>
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
