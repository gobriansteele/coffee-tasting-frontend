'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-keys'
import { formatShortDate } from '@/lib/utils/date'
import type { Tasting } from '@/lib/api/types'

export default function TastingsPage() {
  const {
    data: tastings,
    isLoading: isLoadingTastings,
    error: errorTastings,
  } = useQuery({
    queryKey: queryKeys.tastings.all(),
    queryFn: () => apiClient.getTastings(),
  })

  if (isLoadingTastings) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-ink-muted">Loading your tastings...</div>
      </div>
    )
  }

  if (errorTastings) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-danger">
          Error: {errorTastings.message}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">My Tastings</h1>
        <Link
          href="/tastings/new"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover transition-colors"
        >
          New Tasting
        </Link>
      </div>

      {tastings?.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-ink-muted mb-4">
            You haven&apos;t recorded any tastings yet.
          </p>
          <Link href="/tastings/new" className="text-primary hover:underline">
            Record your first tasting
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tastings?.items.map((tasting: Tasting) => (
            <Link
              key={tasting.id}
              href={`/tastings/${tasting.id}`}
              className="bg-card rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-ink">
                  {tasting.coffee.name}
                </h3>
                <p className="text-sm text-ink-muted">
                  {tasting.coffee.roaster?.name || 'Unknown Roaster'}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                {tasting.brew_method && (
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Method:</span>
                    <span className="font-medium text-ink capitalize">
                      {tasting.brew_method.replace('_', ' ')}
                    </span>
                  </div>
                )}
                {tasting.rating && (
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Rating:</span>
                    <span className="font-medium text-ink">
                      {tasting.rating.score}/5
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-ink-muted">Date:</span>
                  <span className="font-medium text-ink">
                    {formatShortDate(tasting.created_at)}
                  </span>
                </div>
              </div>

              {tasting.detected_flavors && tasting.detected_flavors.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
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
                <p className="mt-3 text-sm text-ink-muted line-clamp-2">
                  {tasting.notes}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
