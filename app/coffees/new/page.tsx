'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useRoasters } from '@/lib/queries/roasters'
import { useCreateCoffee } from '@/lib/queries/coffees'
import { useFlavors } from '@/lib/queries/flavors'
import type {
  CreateCoffeeRequest,
  ProcessingMethod,
  RoastLevel,
  Roaster,
  Flavor,
} from '@/lib/api/types'
import { RoasterQuickCreate } from '@/components/RoasterQuickCreate'
import { FlavorQuickCreate } from '@/components/FlavorQuickCreate'

export default function NewCoffeePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // React Query hooks
  const { data: roastersData, isLoading: loadingRoasters, error: roastersError } = useRoasters()
  const { data: flavorsData, isLoading: loadingFlavors } = useFlavors()
  const createCoffeeMutation = useCreateCoffee()

  const roasters = roastersData?.items || []
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

  // Form state
  const [name, setName] = useState('')
  const [roasterId, setRoasterId] = useState('')
  const [showRoasterForm, setShowRoasterForm] = useState(false)

  // Origin info
  const [originCountry, setOriginCountry] = useState('')
  const [originRegion, setOriginRegion] = useState('')

  // Processing
  const [processingMethod, setProcessingMethod] = useState<
    ProcessingMethod | ''
  >('')
  const [variety, setVariety] = useState('')

  // Roasting
  const [roastLevel, setRoastLevel] = useState<RoastLevel | ''>('')

  // Additional info
  const [description, setDescription] = useState('')

  // Expected flavors
  const [selectedFlavorIds, setSelectedFlavorIds] = useState<string[]>([])
  const [showFlavorForm, setShowFlavorForm] = useState(false)

  const toggleFlavor = (flavorId: string) => {
    setSelectedFlavorIds((prev) =>
      prev.includes(flavorId)
        ? prev.filter((id) => id !== flavorId)
        : [...prev, flavorId]
    )
  }

  const handleFlavorCreated = (newFlavor: Flavor) => {
    setSelectedFlavorIds((prev) => [...prev, newFlavor.id])
    setShowFlavorForm(false)
  }

  useEffect(() => {
    // Pre-select roaster from query params
    const roasterIdParam = searchParams.get('roasterId')
    if (roasterIdParam) {
      setRoasterId(roasterIdParam)
    }
  }, [searchParams])

  const handleRoasterCreated = (newRoaster: Roaster) => {
    setRoasterId(newRoaster.id)
    setShowRoasterForm(false)
  }

  const handleRoasterSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === 'new') {
      setShowRoasterForm(true)
    } else {
      setRoasterId(value)
      setShowRoasterForm(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const coffeeData: CreateCoffeeRequest = {
      name,
      roaster_id: roasterId,
      origin_country: originCountry || undefined,
      origin_region: originRegion || undefined,
      processing_method: processingMethod || undefined,
      variety: variety || undefined,
      roast_level: roastLevel || undefined,
      description: description || undefined,
      flavor_ids: selectedFlavorIds.length > 0 ? selectedFlavorIds : undefined,
    }

    createCoffeeMutation.mutate(coffeeData)
  }

  if (loadingRoasters || loadingFlavors) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-ink-muted">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl font-bold text-ink mb-8">Add New Coffee</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {(roastersError || createCoffeeMutation.error) && (
          <div className="bg-danger-soft text-danger p-4 rounded-md">
            {roastersError?.message || createCoffeeMutation.error?.message || 'An error occurred'}
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-card shadow-sm rounded-lg p-6 space-y-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Basic Information
          </h2>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-ink-muted mb-2"
            >
              Coffee Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Ethiopian Yirgacheffe"
              className="w-full px-3 py-2 bg-card border border-border rounded-md text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="roaster"
              className="block text-sm font-medium text-ink-muted mb-2"
            >
              Roaster *
            </label>
            <select
              id="roaster"
              value={showRoasterForm ? 'new' : roasterId}
              onChange={handleRoasterSelectChange}
              required={!showRoasterForm}
              className="w-full px-3 py-2 bg-card border border-border rounded-md text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select a roaster</option>
              {roasters.map((roaster) => (
                <option key={roaster.id} value={roaster.id}>
                  {roaster.name}
                </option>
              ))}
              <option value="new">+ Add New Roaster</option>
            </select>

            {showRoasterForm && (
              <RoasterQuickCreate
                onRoasterCreated={handleRoasterCreated}
                onCancel={() => setShowRoasterForm(false)}
              />
            )}
          </div>
        </div>

        {/* Origin Information */}
        <div className="bg-card shadow-sm rounded-lg p-6 space-y-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Origin Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="originCountry"
                className="block text-sm font-medium text-ink-muted mb-2"
              >
                Country
              </label>
              <input
                id="originCountry"
                type="text"
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value)}
                placeholder="e.g., Ethiopia"
                className="w-full px-3 py-2 bg-card border border-border rounded-md text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="originRegion"
                className="block text-sm font-medium text-ink-muted mb-2"
              >
                Region
              </label>
              <input
                id="originRegion"
                type="text"
                value={originRegion}
                onChange={(e) => setOriginRegion(e.target.value)}
                placeholder="e.g., Yirgacheffe"
                className="w-full px-3 py-2 bg-card border border-border rounded-md text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="variety"
                className="block text-sm font-medium text-ink-muted mb-2"
              >
                Variety
              </label>
              <input
                id="variety"
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g., Heirloom"
                className="w-full px-3 py-2 bg-card border border-border rounded-md text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Processing & Roasting */}
        <div className="bg-card shadow-sm rounded-lg p-6 space-y-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Processing & Roasting
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="processingMethod"
                className="block text-sm font-medium text-ink-muted mb-2"
              >
                Processing Method
              </label>
              <select
                id="processingMethod"
                value={processingMethod}
                onChange={(e) =>
                  setProcessingMethod(e.target.value as ProcessingMethod)
                }
                className="w-full px-3 py-2 bg-card border border-border rounded-md text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select processing method</option>
                <option value="washed">Washed</option>
                <option value="natural">Natural</option>
                <option value="honey">Honey</option>
                <option value="anaerobic">Anaerobic</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="roastLevel"
                className="block text-sm font-medium text-ink-muted mb-2"
              >
                Roast Level
              </label>
              <select
                id="roastLevel"
                value={roastLevel}
                onChange={(e) => setRoastLevel(e.target.value as RoastLevel)}
                className="w-full px-3 py-2 bg-card border border-border rounded-md text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select roast level</option>
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="medium_dark">Medium-Dark</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expected Flavors */}
        <div className="bg-card shadow-sm rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">
                Expected Flavors
              </h2>
              <p className="text-sm text-ink-muted mt-1">
                Select the flavor notes you expect from this coffee.
              </p>
            </div>
            {!showFlavorForm && (
              <button
                type="button"
                onClick={() => setShowFlavorForm(true)}
                className="text-sm text-primary hover:text-primary-hover"
              >
                + Add New Flavor
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

          {/* Selected flavors */}
          {selectedFlavorIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedFlavorIds.map((id) => {
                const flavor = flavors.find((f) => f.id === id)
                return flavor ? (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleFlavor(id)}
                    className="px-3 py-1 bg-primary text-white rounded-full text-sm hover:bg-primary-hover transition-colors"
                  >
                    {flavor.name} ×
                  </button>
                ) : null
              })}
            </div>
          )}

          {/* Flavor picker by category */}
          <div className="border border-border rounded-lg max-h-64 overflow-y-auto">
            {Object.keys(flavorsByCategory).length === 0 && !showFlavorForm ? (
              <div className="p-4 text-center text-ink-muted text-sm">
                <p>No flavors available.</p>
                <button
                  type="button"
                  onClick={() => setShowFlavorForm(true)}
                  className="text-primary hover:underline mt-2"
                >
                  Create your first flavor
                </button>
              </div>
            ) : Object.keys(flavorsByCategory).length === 0 ? (
              <div className="p-4 text-center text-ink-muted text-sm">
                Create a flavor above to get started
              </div>
            ) : (
              Object.entries(flavorsByCategory).map(([category, categoryFlavors]) => (
                <div key={category}>
                  <div className="px-3 py-1.5 bg-sand text-xs font-medium text-ink-muted uppercase tracking-wide sticky top-0">
                    {category}
                  </div>
                  <div className="p-3 flex flex-wrap gap-2">
                    {categoryFlavors.map((flavor) => (
                      <button
                        key={flavor.id}
                        type="button"
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
              ))
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-card shadow-sm rounded-lg p-6 space-y-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Description
          </h2>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-ink-muted mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the coffee's flavor profile, tasting notes, etc..."
              className="w-full px-3 py-2 bg-card border border-border rounded-md text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/coffees')}
            className="px-6 py-2 border border-border rounded-md text-ink hover:bg-sand transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createCoffeeMutation.isPending}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createCoffeeMutation.isPending ? 'Creating...' : 'Create Coffee'}
          </button>
        </div>
      </form>
    </div>
  )
}
