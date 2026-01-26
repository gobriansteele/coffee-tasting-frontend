'use client'

import { useState } from 'react'
import { useFlavors } from '@/lib/queries/flavors'
import { FlavorIntensitySlider } from './FlavorIntensitySlider'
import { FlavorQuickCreate } from './FlavorQuickCreate'
import type { Flavor, DetectedFlavorInput } from '@/lib/api/types'

type FlavorPickerProps = {
  selectedFlavors: DetectedFlavorInput[]
  onChange: (flavors: DetectedFlavorInput[]) => void
}

export function FlavorPicker({ selectedFlavors, onChange }: FlavorPickerProps) {
  const { data: flavorsData, isLoading } = useFlavors()
  const [searchTerm, setSearchTerm] = useState('')
  const [showFlavorForm, setShowFlavorForm] = useState(false)

  const flavors = flavorsData?.items || []

  const handleFlavorCreated = (newFlavor: Flavor) => {
    // Add the new flavor with default intensity of 5
    onChange([...selectedFlavors, { flavor_id: newFlavor.id, intensity: 5 }])
    setShowFlavorForm(false)
  }

  // Get flavor objects for selected flavor IDs
  const selectedFlavorIds = new Set(selectedFlavors.map((sf) => sf.flavor_id))

  // Filter available flavors (not selected and matching search)
  const availableFlavors = flavors.filter(
    (f) =>
      !selectedFlavorIds.has(f.id) &&
      f.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Group available flavors by category
  const flavorsByCategory = availableFlavors.reduce<Record<string, Flavor[]>>(
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

  const handleAddFlavor = (flavor: Flavor) => {
    onChange([...selectedFlavors, { flavor_id: flavor.id, intensity: 5 }])
    setSearchTerm('')
  }

  const handleRemoveFlavor = (flavorId: string) => {
    onChange(selectedFlavors.filter((sf) => sf.flavor_id !== flavorId))
  }

  const handleIntensityChange = (flavorId: string, intensity: number) => {
    onChange(
      selectedFlavors.map((sf) =>
        sf.flavor_id === flavorId ? { ...sf, intensity } : sf
      )
    )
  }

  const getFlavorById = (id: string): Flavor | undefined => {
    return flavors.find((f) => f.id === id)
  }

  if (isLoading) {
    return (
      <div className="text-center text-ink-muted py-4">Loading flavors...</div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Selected Flavors */}
      {selectedFlavors.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-ink-muted">
            Selected Flavors ({selectedFlavors.length})
          </label>
          <div className="space-y-2">
            {selectedFlavors.map((sf) => {
              const flavor = getFlavorById(sf.flavor_id)
              if (!flavor) return null
              return (
                <FlavorIntensitySlider
                  key={sf.flavor_id}
                  flavor={flavor}
                  intensity={sf.intensity}
                  onChange={(intensity) =>
                    handleIntensityChange(sf.flavor_id, intensity)
                  }
                  onRemove={() => handleRemoveFlavor(sf.flavor_id)}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Search and Add */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-ink-muted">
            Add Flavor
          </label>
          {!showFlavorForm && (
            <button
              type="button"
              onClick={() => setShowFlavorForm(true)}
              className="text-sm text-primary hover:text-primary-hover"
            >
              + New Flavor
            </button>
          )}
        </div>

        {/* Flavor Quick Create Form */}
        {showFlavorForm && (
          <FlavorQuickCreate
            onFlavorCreated={handleFlavorCreated}
            onCancel={() => setShowFlavorForm(false)}
          />
        )}

        {!showFlavorForm && (
          <>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search flavors..."
              className="w-full px-3 py-2 bg-card border border-border rounded-md text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {/* Available Flavors */}
            {(searchTerm || selectedFlavors.length === 0) && (
              <div className="mt-3 max-h-48 overflow-y-auto border border-border rounded-md">
                {Object.entries(flavorsByCategory).length === 0 ? (
                  <div className="p-3 text-center text-ink-muted text-sm">
                    {searchTerm ? (
                      'No matching flavors'
                    ) : (
                      <>
                        <p>No flavors available.</p>
                        <button
                          type="button"
                          onClick={() => setShowFlavorForm(true)}
                          className="text-primary hover:underline mt-1"
                        >
                          Create your first flavor
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  Object.entries(flavorsByCategory).map(
                    ([category, categoryFlavors]) => (
                      <div key={category}>
                        <div className="px-3 py-1.5 bg-sand text-xs font-medium text-ink-muted uppercase tracking-wide sticky top-0">
                          {category}
                        </div>
                        <div className="p-2 flex flex-wrap gap-2">
                          {categoryFlavors.map((flavor) => (
                            <button
                              key={flavor.id}
                              type="button"
                              onClick={() => handleAddFlavor(flavor)}
                              className="px-3 py-1 text-sm bg-card border border-border rounded-full hover:border-primary hover:text-primary transition-colors"
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
            )}
          </>
        )}
      </div>
    </div>
  )
}
