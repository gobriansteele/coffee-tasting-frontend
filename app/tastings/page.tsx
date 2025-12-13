'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-keys'
import { formatShortDate } from '@/lib/utils/date'

export default function TastingsPage() {
  const {
    data: tastings,
    isLoading: isLoadingTastings,
    error: errorTastings,
  } = useQuery({
    queryKey: queryKeys.tastings.all(),
    queryFn: () => apiClient.getTastingSessions(),
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

      {tastings?.tastings.length === 0 ? (
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
          {tastings?.tastings.map((tasting) => (
            <Link
              key={tasting.id}
              href={`/tastings/${tasting.id}`}
              className="bg-card rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-ink">
                  {tasting.coffee_name || 'Unknown Coffee'}
                </h3>
                <p className="text-sm text-ink-muted">
                  {tasting.roaster_name || 'Unknown Roaster'}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Method:</span>
                  <span className="font-medium text-ink">{tasting.brew_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Rating:</span>
                  <span className="font-medium text-ink">
                    {tasting.overall_rating}/10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Date:</span>
                  <span className="font-medium text-ink">
                    {formatShortDate(tasting.created_at)}
                  </span>
                </div>
              </div>

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
