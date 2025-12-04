'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-keys'
import { formatShortDate } from '@/lib/utils/date'

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
        <div className="text-center">Loading coffees...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-red-600">Error: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Coffees</h1>
        <Link
          href="/coffees/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Coffee
        </Link>
      </div>

      {coffees?.coffees.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No coffees yet.</p>
          <Link href="/coffees/new" className="text-blue-600 hover:underline">
            Add your first coffee
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coffees?.coffees.map((coffee) => (
            <div
              key={coffee.id}
              onClick={() => router.push(`/coffees/${coffee.id}`)}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                {coffee.name}
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                {coffee.roaster && (
                  <p>
                    <Link
                      href={`/roasters/${coffee.roaster.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 hover:underline"
                    >
                      {coffee.roaster.name}
                    </Link>
                  </p>
                )}
                {coffee.roast_date && (
                  <p>Roasted: {formatShortDate(coffee.roast_date)}</p>
                )}
                {coffee.origin && <p>{coffee.origin}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
