'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCoffeesByFlavor } from '@/lib/queries/recommendations'
import { FlavorSearchForm } from '@/components/FlavorSearchForm'
import { CoffeeFlavorTags } from '@/components/CoffeeFlavorTags'

export default function SearchByFlavorPage() {
  const [selectedFlavorIds, setSelectedFlavorIds] = useState<string[]>([])
  const [excludeTasted, setExcludeTasted] = useState(false)

  const { data: matchData, isLoading, error } = useCoffeesByFlavor(
    selectedFlavorIds,
    excludeTasted
  )

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
          Search by Flavor
        </h1>
        <p className="text-ink-muted mt-2">
          Select flavors you enjoy to find matching coffees
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Flavor Selection */}
        <div className="bg-card shadow-sm rounded-lg p-6">
          <h2 className="font-display text-lg font-semibold text-ink mb-4">
            Select Flavors
          </h2>
          <FlavorSearchForm
            selectedFlavorIds={selectedFlavorIds}
            onSelectionChange={setSelectedFlavorIds}
            excludeTasted={excludeTasted}
            onExcludeTastedChange={setExcludeTasted}
          />
        </div>

        {/* Results */}
        <div>
          <h2 className="font-display text-lg font-semibold text-ink mb-4">
            Matching Coffees
            {matchData?.matches && matchData.matches.length > 0 && (
              <span className="text-ink-muted font-normal ml-2">
                ({matchData.matches.length} found)
              </span>
            )}
          </h2>

          {selectedFlavorIds.length === 0 ? (
            <div className="text-center py-12 bg-sand rounded-lg">
              <p className="text-ink-muted">
                Select some flavors to see matching coffees
              </p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-12 bg-sand rounded-lg">
              <p className="text-ink-muted">Searching...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-danger-soft rounded-lg">
              <p className="text-danger">Failed to search coffees</p>
            </div>
          ) : matchData?.matches.length === 0 ? (
            <div className="text-center py-12 bg-sand rounded-lg">
              <p className="text-ink-muted">
                No coffees found with these flavors
              </p>
              <p className="text-sm text-ink-muted mt-2">
                Try selecting different flavors
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {matchData?.matches.map((item) => (
                <Link
                  key={item.coffee.id}
                  href={`/coffees/${item.coffee.id}`}
                  className="block bg-card shadow-sm rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-ink">
                        {item.coffee.name}
                      </h3>
                      {item.coffee.roaster && (
                        <p className="text-sm text-ink-muted">
                          {item.coffee.roaster.name}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary tabular-nums">
                        {item.match_count}
                      </div>
                      <div className="text-xs text-ink-muted">
                        flavor{item.match_count !== 1 ? 's' : ''} matched
                      </div>
                    </div>
                  </div>

                  {item.matching_flavors.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {item.matching_flavors.map((flavor, index) => (
                          <span
                            key={index}
                            className="bg-success-soft text-success px-2 py-0.5 rounded text-xs"
                          >
                            {flavor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.coffee.flavors && item.coffee.flavors.length > 0 && (
                    <div className="mt-2">
                      <CoffeeFlavorTags
                        flavors={item.coffee.flavors}
                        size="sm"
                        limit={4}
                      />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
