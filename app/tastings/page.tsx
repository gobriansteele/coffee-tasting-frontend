'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/api/client'
import type { TastingSession } from '@/lib/api/types'

export default function TastingsPage() {
  const [tastings, setTastings] = useState<TastingSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTastings()
  }, [])

  const loadTastings = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getTastingSessions()
      setTastings(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tastings')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading your tastings...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-red-600">Error: {error}</div>
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

      {tastings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            You haven't recorded any tastings yet.
          </p>
          <Link href="/tastings/new" className="text-blue-600 hover:underline">
            Record your first tasting
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tastings.map((tasting) => (
            <Link
              key={tasting.id}
              href={`/tastings/${tasting.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {tasting.coffee?.name || 'Unknown Coffee'}
                </h3>
                {tasting.coffee?.roaster && (
                  <p className="text-sm text-gray-600">
                    {tasting.coffee.roaster.name}
                  </p>
                )}
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
                    {formatDate(tasting.tasting_date)}
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
