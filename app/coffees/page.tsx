'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-keys'

export default function CoffeesPage() {
  const router = useRouter()
  const {
    data: coffees,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.coffees.lists(),
    queryFn: () => apiClient.getCoffees({}),
  })

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-ink-muted">Loading coffees...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-danger">Error: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">All Coffees</h1>
        <Link
          href="/coffees/new"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover transition-colors"
        >
          Add Coffee
        </Link>
      </div>

      {coffees?.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-ink-muted mb-4">No coffees yet.</p>
          <Link href="/coffees/new" className="text-primary hover:underline">
            Add your first coffee
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coffees?.items.map((coffee) => (
            <div
              key={coffee.id}
              onClick={() => router.push(`/coffees/${coffee.id}`)}
              className="bg-card rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="font-semibold text-ink mb-2">
                {coffee.name}
              </h3>
              <div className="space-y-1 text-sm text-ink-muted">
                {coffee.roaster && (
                  <p>
                    <Link
                      href={`/roasters/${coffee.roaster.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-primary hover:underline"
                    >
                      {coffee.roaster.name}
                    </Link>
                  </p>
                )}
                {coffee.origin_country && <p>{coffee.origin_country}</p>}
                {coffee.roast_level && (
                  <p className="capitalize">{coffee.roast_level.replace('_', ' ')}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
