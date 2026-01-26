'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-keys'

export default function RoastersPage() {
  const router = useRouter()
  const {
    data: roasters,
    isLoading: isLoadingRoasters,
    error: errorRoasters,
  } = useQuery({
    queryKey: queryKeys.roasters.all(),
    queryFn: () => apiClient.getRoasters(),
  })

  if (isLoadingRoasters) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-ink-muted">Loading roasters...</div>
      </div>
    )
  }

  if (errorRoasters) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-danger">
          Error: {errorRoasters.message}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">Coffee Roasters</h1>
      </div>

      {roasters?.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-ink-muted mb-4">No roasters yet.</p>
          <p className="text-ink-muted text-sm mb-4">
            Roasters are added when you create a new coffee.
          </p>
          <Link href="/coffees/new" className="text-primary hover:underline">
            Add your first coffee
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roasters?.items.map((roaster) => (
            <div
              key={roaster.id}
              onClick={() => router.push(`/roasters/${roaster.id}`)}
              className="bg-card rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-ink mb-2">
                {roaster.name}
              </h3>

              {roaster.location && (
                <p className="text-sm text-ink-muted mb-2">
                  {roaster.location}
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
                  className="text-sm text-primary hover:underline mb-2 block"
                >
                  {roaster.website}
                </a>
              )}

              {roaster.description && (
                <p className="text-sm text-ink-muted line-clamp-3">
                  {roaster.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
