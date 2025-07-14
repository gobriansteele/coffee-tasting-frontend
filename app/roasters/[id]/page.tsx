'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-keys'

export default function RoasterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const roasterId = params.id as string

  const {
    data: roaster,
    isLoading: isLoadingRoaster,
    error: errorRoaster,
  } = useQuery({
    queryKey: queryKeys.roasters.detail(roasterId),
    queryFn: () => apiClient.getRoaster(roasterId),
  })
  const {
    data: coffees,
    isLoading: isLoadingCoffees,
    error: errorCoffees,
  } = useQuery({
    queryKey: queryKeys.coffees.list({ roasterId }),
    queryFn: () => apiClient.getCoffees({ roasterId }),
    enabled: !!roasterId,
  })

  const { mutate: deleteRoaster, isPending: deleting } = useMutation({
    mutationFn: (roasterId: string) => apiClient.deleteRoaster(roasterId),
  })

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this roaster?')) {
      return
    }

    deleteRoaster(roasterId, {
      onSuccess: () => {
        router.push('/roasters')
      },
    })
  }

  if (isLoadingRoaster || isLoadingCoffees) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading roaster details...</div>
      </div>
    )
  }

  if (errorRoaster || errorCoffees || !roaster) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-red-600">
          Error:{' '}
          {errorRoaster?.message ||
            errorCoffees?.message ||
            'Roaster not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{roaster.name}</h1>
          <div className="flex space-x-2">
            <Link
              href={`/roasters/${roasterId}/edit`}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        <div className="space-y-2 text-gray-600">
          {roaster.location && <p>📍 Location: {roaster.location}</p>}
          {roaster.website && (
            <p>
              🌐 Website:{' '}
              <a
                href={roaster.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {roaster.website}
              </a>
            </p>
          )}
          {roaster.notes && (
            <div className="mt-4">
              <p className="font-semibold text-gray-700">Notes:</p>
              <p className="mt-1">{roaster.notes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Coffees from {roaster.name}
        </h2>
        <Link
          href={`/coffees/new?roasterId=${roasterId}`}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Coffee
        </Link>
      </div>

      {coffees?.coffees.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No coffees found for this roaster.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coffees?.coffees.map((coffee) => (
            <Link
              key={coffee.id}
              href={`/coffees/${coffee.id}`}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                {coffee.name}
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                {coffee.origin && <p>🌍 {coffee.origin}</p>}
                {coffee.process && <p>⚙️ {coffee.process}</p>}
                {coffee.varietal && <p>🌱 {coffee.varietal}</p>}
                {coffee.price && <p>💰 ${coffee.price}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
