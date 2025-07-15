'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-keys'

export default function TastingsPage() {
  const {
    data: tastings,
    isLoading: isLoadingTastings,
    error: errorTastings,
  } = useQuery({
    queryKey: queryKeys.tastings.all(),
    queryFn: () => apiClient.getTastingSessions(),
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (isLoadingTastings) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading your tastings...</div>
      </div>
    )
  }

  if (errorTastings) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-red-600">
          Error: {errorTastings.message}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Tastings</h1>
        <Link
          href="/tastings/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          New Tasting
        </Link>
      </div>

      {tastings?.tastings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            You haven&apos;t recorded any tastings yet.
          </p>
          <Link href="/tastings/new" className="text-blue-600 hover:underline">
            Record your first tasting
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tastings?.tastings.map((tasting) => (
            <Link
              key={tasting.id}
              href={`/tastings/${tasting.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {tasting.coffee_name || 'Unknown Coffee'}
                </h3>
                <p className="text-sm text-gray-600">
                  {tasting.roaster_name || 'Unknown Roaster'}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-medium">{tasting.brew_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <span className="font-medium">
                    {tasting.overall_rating}/10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {formatDate(tasting.created_at)}
                  </span>
                </div>
              </div>

              {tasting.notes && (
                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
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
