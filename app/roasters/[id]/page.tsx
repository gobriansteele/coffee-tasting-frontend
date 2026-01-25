'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-keys'

export default function RoasterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const roasterId = params.id as string
  const queryClient = useQueryClient()

  const { mutate: deleteRoaster, isPending: isDeleting } = useMutation({
    mutationFn: (roasterId: string) => apiClient.deleteRoaster(roasterId),
  })

  const {
    data: roaster,
    isLoading: isLoadingRoaster,
    error: errorRoaster,
  } = useQuery({
    queryKey: queryKeys.roasters.detail(roasterId),
    queryFn: () => apiClient.getRoaster(roasterId),
    enabled: !!roasterId && !isDeleting,
  })

  const {
    data: coffees,
    isLoading: isLoadingCoffees,
    error: errorCoffees,
  } = useQuery({
    queryKey: queryKeys.coffees.list({ roaster_id: roasterId }),
    queryFn: () => apiClient.getCoffees({ roaster_id: roasterId }),
    enabled: !!roasterId,
  })

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this roaster?')) {
      return
    }

    deleteRoaster(roasterId, {
      onSuccess: () => {
        router.push('/roasters')
        queryClient.invalidateQueries({ queryKey: queryKeys.roasters.all() })
      },
    })
  }

  if (isLoadingRoaster || isLoadingCoffees) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-ink-muted">Loading roaster details...</div>
      </div>
    )
  }

  if (errorRoaster || errorCoffees || !roaster) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-danger">
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
      <div className="bg-card shadow-sm rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="font-display text-3xl font-bold text-ink">{roaster.name}</h1>
          <div className="flex space-x-2">
            <Link
              href={`/roasters/${roasterId}/edit`}
              className="bg-sand text-ink px-4 py-2 rounded-md hover:bg-border transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-danger text-white px-4 py-2 rounded-md hover:bg-danger/90 transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        <div className="space-y-2 text-ink-muted">
          {roaster.location && <p>Location: {roaster.location}</p>}
          {roaster.website && (
            <p>
              Website:{' '}
              <a
                href={roaster.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {roaster.website}
              </a>
            </p>
          )}
          {roaster.description && (
            <div className="mt-4">
              <p className="font-semibold text-ink">Description:</p>
              <p className="mt-1">{roaster.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Coffees from {roaster.name}
        </h2>
        <Link
          href={`/coffees/new?roasterId=${roasterId}`}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover transition-colors"
        >
          Add Coffee
        </Link>
      </div>

      {coffees?.items.length === 0 ? (
        <div className="text-center py-8 bg-sand rounded-lg">
          <p className="text-ink-muted">No coffees found for this roaster.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coffees?.items.map((coffee) => (
            <Link
              key={coffee.id}
              href={`/coffees/${coffee.id}`}
              className="bg-card rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-ink mb-2">
                {coffee.name}
              </h3>
              <div className="space-y-1 text-sm text-ink-muted">
                {coffee.origin_country && <p>{coffee.origin_country}</p>}
                {coffee.processing_method && (
                  <p className="capitalize">{coffee.processing_method}</p>
                )}
                {coffee.variety && <p>{coffee.variety}</p>}
                {coffee.roast_level && (
                  <p className="capitalize">{coffee.roast_level.replace('_', ' ')}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
