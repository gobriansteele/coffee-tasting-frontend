'use client'

import { useState } from 'react'
import { useFlavors } from '@/lib/queries/flavors'
import type { Flavor } from '@/lib/api/types'

type FlavorSearchFormProps = {
  selectedFlavorIds: string[]
  onSelectionChange: (flavorIds: string[]) => void
  excludeTasted: boolean
  onExcludeTastedChange: (exclude: boolean) => void
}

export function FlavorSearchForm({
  selectedFlavorIds,
  onSelectionChange,
  excludeTasted,
  onExcludeTastedChange,
}: FlavorSearchFormProps) {
  const { data: flavorsData, isLoading } = useFlavors()
  const [searchTerm, setSearchTerm] = useState('')

  const flavors = flavorsData?.items || []

  // Group flavors by category
  const flavorsByCategory = flavors.reduce<Record<string, Flavor[]>>(
    (acc, flavor) => {
      const category = flavor.category || 'Other'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(flavor)
      return acc
    },
    {}
  )

  // Filter by search term
  const filteredCategories = Object.entries(flavorsByCategory).reduce<
    Record<string, Flavor[]>
  >((acc, [category, categoryFlavors]) => {
    const filtered = categoryFlavors.filter((f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (filtered.length > 0) {
      acc[category] = filtered
    }
    return acc
  }, {})

  const toggleFlavor = (flavorId: string) => {
    if (selectedFlavorIds.includes(flavorId)) {
      onSelectionChange(selectedFlavorIds.filter((id) => id !== flavorId))
    } else {
      onSelectionChange([...selectedFlavorIds, flavorId])
    }
  }

  const clearSelection = () => {
    onSelectionChange([])
  }

  if (isLoading) {
    return (
      <div className="text-center text-ink-muted py-4">Loading flavors...</div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search flavors..."
          className="w-full px-3 py-2 bg-card border border-border rounded-md text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Selected Flavors */}
      {selectedFlavorIds.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {selectedFlavorIds.map((id) => {
              const flavor = flavors.find((f) => f.id === id)
              return flavor ? (
                <button
                  key={id}
                  onClick={() => toggleFlavor(id)}
                  className="px-3 py-1 bg-primary text-white rounded-full text-sm hover:bg-primary-hover transition-colors"
                >
                  {flavor.name} ×
                </button>
              ) : null
            })}
          </div>
          <button
            onClick={clearSelection}
            className="text-sm text-ink-muted hover:text-ink"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Exclude Tasted Toggle */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={excludeTasted}
          onChange={(e) => onExcludeTastedChange(e.target.checked)}
          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
        />
        <span className="text-sm text-ink">
          Exclude coffees I&apos;ve already tasted
        </span>
      </label>

      {/* Flavor Grid by Category */}
      <div className="border border-border rounded-lg max-h-64 overflow-y-auto">
        {Object.keys(filteredCategories).length === 0 ? (
          <div className="p-4 text-center text-ink-muted text-sm">
            No matching flavors
          </div>
        ) : (
          Object.entries(filteredCategories).map(
            ([category, categoryFlavors]) => (
              <div key={category}>
                <div className="px-3 py-1.5 bg-sand text-xs font-medium text-ink-muted uppercase tracking-wide sticky top-0">
                  {category}
                </div>
                <div className="p-3 flex flex-wrap gap-2">
                  {categoryFlavors.map((flavor) => (
                    <button
                      key={flavor.id}
                      onClick={() => toggleFlavor(flavor.id)}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        selectedFlavorIds.includes(flavor.id)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-card border-border hover:border-primary hover:text-primary'
                      }`}
                    >
                      {flavor.name}
                    </button>
                  ))}
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  )
}
