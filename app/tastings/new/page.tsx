'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useApiClient } from '@/hooks/use-api-client'
import { useCreateTastingSession } from '@/lib/queries/tastings'
import type { BrewMethod, GrindSize } from '@/lib/api/types'
import FlavorTag from '@/components/FlavorTag'
import { queryKeys } from '@/lib/query-keys'

export default function NewTastingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const apiClient = useApiClient()
  const createTastingMutation = useCreateTastingSession()

  const { data: coffees, isLoading: isLoadingCoffees } = useQuery({
    queryKey: queryKeys.coffees.all(),
    queryFn: () => apiClient.getCoffees({ limit: 100 }),
  })
  const { data: roasters, isLoading: isLoadingRoasters } = useQuery({
    queryKey: queryKeys.roasters.all(),
    queryFn: () => apiClient.getRoasters(),
  })

  const [selectedCoffeeId, setSelectedCoffeeId] = useState('')
  const [brewMethod, setBrewMethod] = useState<BrewMethod | ''>('')
  const [grindSize, setGrindSize] = useState<GrindSize | ''>('')
  const [waterTemp, setWaterTemp] = useState('')
  const [brewTime, setBrewTime] = useState('')
  const [coffeeGrams, setCoffeeGrams] = useState('')
  const [waterGrams, setWaterGrams] = useState('')
  const [overallRating, setOverallRating] = useState('5')
  const [flavorNotes, setFlavorNotes] = useState<string[]>([])
  const [currentFlavor, setCurrentFlavor] = useState('')
  const [sessionNotes, setSessionNotes] = useState('')
  const [tastingDate, setTastingDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  useEffect(() => {
    const coffeeIdParam = searchParams.get('coffeeId')
    if (coffeeIdParam) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCoffeeId(coffeeIdParam)
    }
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCoffeeId || !brewMethod) {
      return
    }

    createTastingMutation.mutate(
      {
        coffee_id: selectedCoffeeId,
        brew_method: brewMethod,
        grind_size: grindSize || undefined,
        water_temperature: waterTemp ? parseInt(waterTemp) : undefined,
        brew_time: brewTime || undefined,
        coffee_dose: coffeeGrams ? parseFloat(coffeeGrams) : undefined,
        water_amount: waterGrams ? parseFloat(waterGrams) : undefined,
        overall_rating: parseInt(overallRating),
        session_notes: sessionNotes || undefined,
        tasting_notes: flavorNotes.map((flavor) => ({ flavor_name: flavor })),
      },
      {
        onSuccess: (newTasting) => {
          router.push(`/tastings/${newTasting.id}`)
        },
      }
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl font-bold text-ink mb-8">
        New Tasting Session
      </h1>
      {isLoadingCoffees || isLoadingRoasters ? (
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
              Coffee Details
            </h2>

            <div>
              <label
                htmlFor="coffee"
                className="block text-sm font-medium text-ink-muted mb-2"
              >
                Coffee *
              </label>
              <select
                id="coffee"
                value={selectedCoffeeId}
                onChange={(e) => setSelectedCoffeeId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-ink"
              >
                <option value="">Select a coffee</option>
                {coffees?.coffees.map((coffee) => {
                  const roaster = roasters?.roasters.find(
                    (r) => r.id === coffee.roaster_id
                  )
                  return (
                    <option key={coffee.id} value={coffee.id}>
                      {coffee.name} - {roaster?.name || 'Unknown Roaster'}
                    </option>
                  )
                })}
              </select>
            </div>

            <div>
              <label
                htmlFor="tastingDate"
                className="block text-sm font-medium text-ink-muted mb-2"
              >
                Tasting Date *
              </label>
              <input
                id="tastingDate"
                type="date"
                value={tastingDate}
                onChange={(e) => setTastingDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-ink"
              />
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
                  Brew Method *
                </label>
                <select
                  id="brewMethod"
                  value={brewMethod}
                  onChange={(e) =>
                    setBrewMethod(e.target.value as BrewMethod | '')
                  }
                  required
                  className="w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-ink"
                >
                  <option value="">Select a brew method</option>
                  <option value="pour_over">Pour Over</option>
                  <option value="espresso">Espresso</option>
                  <option value="french_press">French Press</option>
                  <option value="aeropress">Aeropress</option>
                  <option value="cold_brew">Cold Brew</option>
                  <option value="moka_pot">Moka Pot</option>
                  <option value="drip">Drip</option>
                  <option value="other">Other</option>
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
                  <option value="extra_fine">Extra Fine</option>
                  <option value="fine">Fine</option>
                  <option value="medium_fine">Medium Fine</option>
                  <option value="medium">Medium</option>
                  <option value="medium_coarse">Medium Coarse</option>
                  <option value="coarse">Coarse</option>
                  <option value="extra_coarse">Extra Coarse</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="waterTemp"
                  className="block text-sm font-medium text-ink-muted mb-2"
                >
                  Water Temperature (°C)
                </label>
                <input
                  id="waterTemp"
                  type="number"
                  value={waterTemp}
                  onChange={(e) => setWaterTemp(e.target.value)}
                  placeholder="e.g., 93"
                  className="w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-ink placeholder:text-ink-muted"
                />
              </div>

              <div>
                <label
                  htmlFor="brewTime"
                  className="block text-sm font-medium text-ink-muted mb-2"
                >
                  Brew Time
                </label>
                <input
                  id="brewTime"
                  type="text"
                  value={brewTime}
                  onChange={(e) => setBrewTime(e.target.value)}
                  placeholder="e.g., 4:30"
                  className="w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-ink placeholder:text-ink-muted"
                />
              </div>

              <div>
                <label
                  htmlFor="coffeeGrams"
                  className="block text-sm font-medium text-ink-muted mb-2"
                >
                  Coffee (grams)
                </label>
                <input
                  id="coffeeGrams"
                  type="number"
                  step="0.1"
                  value={coffeeGrams}
                  onChange={(e) => setCoffeeGrams(e.target.value)}
                  placeholder="e.g., 15"
                  className="w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-ink placeholder:text-ink-muted"
                />
              </div>

              <div>
                <label
                  htmlFor="waterGrams"
                  className="block text-sm font-medium text-ink-muted mb-2"
                >
                  Water (grams)
                </label>
                <input
                  id="waterGrams"
                  type="number"
                  value={waterGrams}
                  onChange={(e) => setWaterGrams(e.target.value)}
                  placeholder="e.g., 250"
                  className="w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-ink placeholder:text-ink-muted"
                />
              </div>
            </div>
          </div>

          <div className="bg-card shadow-sm rounded-lg p-6 space-y-6">
            <h2 className="font-display text-xl font-semibold text-ink">
              Rating & Notes
            </h2>

            <div>
              <label
                htmlFor="overallRating"
                className="block text-sm font-medium text-ink-muted mb-2"
              >
                Overall Rating * (1-10)
              </label>
              <input
                id="overallRating"
                type="number"
                min="1"
                max="10"
                step="0.5"
                value={overallRating}
                onChange={(e) => setOverallRating(e.target.value)}
                required
                className="w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-ink"
              />
            </div>

            <div>
              <label
                htmlFor="flavors"
                className="block text-sm font-medium text-ink-muted mb-2"
              >
                Flavor Notes
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  id="flavors"
                  type="text"
                  value={currentFlavor}
                  onChange={(e) => setCurrentFlavor(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (
                        currentFlavor.trim() &&
                        !flavorNotes.includes(currentFlavor.trim())
                      ) {
                        setFlavorNotes([...flavorNotes, currentFlavor.trim()])
                        setCurrentFlavor('')
                      }
                    }
                  }}
                  placeholder="Type a flavor and press Enter or click Add"
                  className="flex-1 px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-ink placeholder:text-ink-muted"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (
                      currentFlavor.trim() &&
                      !flavorNotes.includes(currentFlavor.trim())
                    ) {
                      setFlavorNotes([...flavorNotes, currentFlavor.trim()])
                      setCurrentFlavor('')
                    }
                  }}
                  className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary-soft transition-colors"
                >
                  Add
                </button>
              </div>
              {flavorNotes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {flavorNotes.map((flavor, index) => (
                    <FlavorTag
                      key={index}
                      flavor={flavor}
                      onRemove={() => {
                        setFlavorNotes(
                          flavorNotes.filter((_, i) => i !== index)
                        )
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="sessionNotes"
                className="block text-sm font-medium text-ink-muted mb-2"
              >
                Session Notes
              </label>
              <textarea
                id="sessionNotes"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                rows={4}
                placeholder="Additional notes about the brewing process, environment, or overall experience..."
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
