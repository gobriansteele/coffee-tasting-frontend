'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRoasters } from '@/lib/queries/roasters'

export default function RoastersPage() {
  const router = useRouter()
  const {
    data: roasters,
    isLoading: isLoadingRoasters,
    error: errorRoasters,
  } = useRoasters()

  if (isLoadingRoasters) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading roasters...</div>
      </div>
    )
  }

  if (errorRoasters) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-red-600">
          Error: {errorRoasters.message}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Coffee Roasters</h1>
        <Link
          href="/roasters/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Roaster
        </Link>
      </div>

      {roasters?.roasters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No roasters found.</p>
          <Link href="/roasters/new" className="text-blue-600 hover:underline">
            Add the first roaster
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roasters?.roasters.map((roaster) => (
            <div
              key={roaster.id}
              onClick={() => router.push(`/roasters/${roaster.id}`)}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {roaster.name}
              </h3>

              {roaster.location && (
                <p className="text-sm text-gray-600 mb-2">
                  📍 {roaster.location}
                </p>
              )}

              {roaster.website && (
                <a
                  href={
                    roaster.website.startsWith('http')
                      ? roaster.website
                      : `https://${roaster.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm text-blue-600 hover:underline mb-2 block"
                >
                  🌐 {roaster.website}
                </a>
              )}

              {roaster.notes && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {roaster.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
