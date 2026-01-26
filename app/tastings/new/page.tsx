'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useApiClient } from '@/hooks/use-api-client'
import { useCreateTasting } from '@/lib/queries/tastings'
import type { BrewMethod, GrindSize, DetectedFlavorInput } from '@/lib/api/types'
import { queryKeys } from '@/lib/query-keys'
import { FlavorPicker } from '@/components/FlavorPicker'
import { RatingInput } from '@/components/RatingInput'

export default function NewTastingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const apiClient = useApiClient()
  const createTastingMutation = useCreateTasting()

  const { data: coffees, isLoading: isLoadingCoffees } = useQuery({
    queryKey: queryKeys.coffees.all(),
    queryFn: () => apiClient.getCoffees({ limit: 100 }),
  })

  const [selectedCoffeeId, setSelectedCoffeeId] = useState('')
  const [brewMethod, setBrewMethod] = useState<BrewMethod | ''>('')
  const [grindSize, setGrindSize] = useState<GrindSize | ''>('')
  const [notes, setNotes] = useState('')
  const [detectedFlavors, setDetectedFlavors] = useState<DetectedFlavorInput[]>([])
  const [ratingScore, setRatingScore] = useState<number | null>(null)
  const [ratingNotes, setRatingNotes] = useState('')

  useEffect(() => {
    const coffeeIdParam = searchParams.get('coffeeId')
    if (coffeeIdParam) {
      setSelectedCoffeeId(coffeeIdParam)
    }
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCoffeeId) {
      return
    }

    createTastingMutation.mutate({
      coffee_id: selectedCoffeeId,
      brew_method: brewMethod || undefined,
      grind_size: grindSize || undefined,
      notes: notes || undefined,
      detected_flavors: detectedFlavors.length > 0 ? detectedFlavors : undefined,
      rating: ratingScore ? { score: ratingScore, notes: ratingNotes || undefined } : undefined,
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl font-bold text-ink mb-8">
        New Tasting
      </h1>
      {isLoadingCoffees ? (
        <div className="text-center text-ink-muted">Loading coffees...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {createTastingMutation.error && (
            <div className="bg-danger-soft text-danger p-4 rounded-md">
              {createTastingMutation.error.message}
            </div>
          )}

          <div className="bg-card shadow-sm rounded-lg p-6 space-y-6">
            <h2 className="font-display text-xl font-semibold text-ink">
              Coffee
            </h2>

            <div>
              <label
                htmlFor="coffee"
                className="block text-sm font-medium text-ink-muted mb-2"
              >
                Select Coffee *
              </label>
              <select
                id="coffee"
                value={selectedCoffeeId}
                onChange={(e) => setSelectedCoffeeId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-ink"
              >
                <option value="">Select a coffee</option>
                {coffees?.items.map((coffee) => (
                  <option key={coffee.id} value={coffee.id}>
                    {coffee.name} - {coffee.roaster?.name || 'Unknown Roaster'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-card shadow-sm rounded-lg p-6 space-y-6">
            <h2 className="font-display text-xl font-semibold text-ink">
              Brewing Parameters
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="brewMethod"
                  className="block text-sm font-medium text-ink-muted mb-2"
                >
                  Brew Method
                </label>
                <select
                  id="brewMethod"
                  value={brewMethod}
                  onChange={(e) =>
                    setBrewMethod(e.target.value as BrewMethod | '')
                  }
                  className="w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-ink"
                >
                  <option value="">Select a brew method</option>
                  <option value="pourover">Pour Over</option>
                  <option value="espresso">Espresso</option>
                  <option value="french_press">French Press</option>
                  <option value="aeropress">Aeropress</option>
                  <option value="cold_brew">Cold Brew</option>
                  <option value="drip">Drip</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="grindSize"
                  className="block text-sm font-medium text-ink-muted mb-2"
                >
                  Grind Size
                </label>
                <select
                  id="grindSize"
                  value={grindSize}
                  onChange={(e) =>
                    setGrindSize(e.target.value as GrindSize | '')
                  }
                  className="w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-ink"
                >
                  <option value="">Select a grind size</option>
                  <option value="fine">Fine</option>
                  <option value="medium_fine">Medium Fine</option>
                  <option value="medium">Medium</option>
                  <option value="medium_coarse">Medium Coarse</option>
                  <option value="coarse">Coarse</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-card shadow-sm rounded-lg p-6 space-y-6">
            <h2 className="font-display text-xl font-semibold text-ink">
              Detected Flavors
            </h2>
            <p className="text-sm text-ink-muted">
              What flavors did you taste? Add them and rate their intensity.
            </p>
            <FlavorPicker
              selectedFlavors={detectedFlavors}
              onChange={setDetectedFlavors}
            />
          </div>

          <div className="bg-card shadow-sm rounded-lg p-6 space-y-6">
            <h2 className="font-display text-xl font-semibold text-ink">
              Rating
            </h2>
            <RatingInput
              value={ratingScore}
              onChange={setRatingScore}
            />
            <div>
              <label
                htmlFor="ratingNotes"
                className="block text-sm font-medium text-ink-muted mb-2"
              >
                Rating Notes (optional)
              </label>
              <textarea
                id="ratingNotes"
                value={ratingNotes}
                onChange={(e) => setRatingNotes(e.target.value)}
                rows={2}
                placeholder="Why did you give this rating?"
                className="w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-ink placeholder:text-ink-muted"
              />
            </div>
          </div>

          <div className="bg-card shadow-sm rounded-lg p-6 space-y-6">
            <h2 className="font-display text-xl font-semibold text-ink">
              Notes
            </h2>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-ink-muted mb-2"
              >
                General Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Describe your tasting experience..."
                className="w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-ink placeholder:text-ink-muted"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/tastings')}
              className="px-6 py-2 border border-border rounded-md text-ink hover:bg-sand"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createTastingMutation.isPending}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createTastingMutation.isPending ? 'Creating...' : 'Create Tasting'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
