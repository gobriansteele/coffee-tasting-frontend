'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useCoffee } from '@/lib/queries/coffees'
import { useSimilarCoffees } from '@/lib/queries/recommendations'
import { SimilarCoffeesList } from '@/components/SimilarCoffeesList'
import { CoffeeFlavorTags } from '@/components/CoffeeFlavorTags'

export default function SimilarCoffeesPage() {
  const params = useParams()
  const coffeeId = params.id as string

  const { data: coffee, isLoading: isLoadingCoffee, error: coffeeError } = useCoffee(coffeeId)
  const { data: similarData, isLoading: isLoadingSimilar, error: similarError } = useSimilarCoffees(coffeeId)

  if (isLoadingCoffee || isLoadingSimilar) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-ink-muted">Finding similar coffees...</div>
      </div>
    )
  }

  if (coffeeError || !coffee) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-danger">
          Error: {coffeeError?.message || 'Coffee not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/discover"
          className="text-primary hover:underline text-sm mb-4 inline-block"
        >
          ← Back to Discover
        </Link>
        <h1 className="font-display text-3xl font-bold text-ink">
          Coffees Similar to {coffee.name}
        </h1>
        {coffee.roaster && (
          <p className="text-lg text-ink-muted">by {coffee.roaster.name}</p>
        )}
      </div>

      {/* Source Coffee Card */}
      <div className="bg-card shadow-sm rounded-lg p-6 mb-8">
        <h2 className="font-display text-lg font-semibold text-ink mb-3">
          Based on
        </h2>
        <div className="flex items-start justify-between">
          <div>
            <Link
              href={`/coffees/${coffee.id}`}
              className="text-xl font-semibold text-ink hover:text-primary"
            >
              {coffee.name}
            </Link>
            {coffee.roaster && (
              <p className="text-ink-muted">{coffee.roaster.name}</p>
            )}
            <div className="mt-2 space-y-1 text-sm text-ink-muted">
              {coffee.origin_country && <p>{coffee.origin_country}</p>}
              {coffee.processing_method && (
                <p className="capitalize">{coffee.processing_method}</p>
              )}
            </div>
          </div>
          {coffee.flavors && coffee.flavors.length > 0 && (
            <div className="ml-4">
              <CoffeeFlavorTags flavors={coffee.flavors} size="sm" />
            </div>
          )}
        </div>
      </div>

      {/* Similar Coffees */}
      <div>
        <h2 className="font-display text-xl font-semibold text-ink mb-4">
          Similar Coffees
        </h2>
        {similarError ? (
          <div className="text-center text-danger py-8">
            Failed to load similar coffees
          </div>
        ) : (
          <SimilarCoffeesList
            similarCoffees={similarData?.similar || []}
            emptyMessage="No similar coffees found. Try tasting more coffees to improve recommendations."
          />
        )}
      </div>
    </div>
  )
}
