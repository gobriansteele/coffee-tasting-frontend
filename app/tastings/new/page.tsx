'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateTasting } from '@/lib/queries/tastings'
import { useCreateCoffeeFromInput } from '@/lib/queries/submit-coffee'
import { useFlavors, useCreateFlavor } from '@/lib/queries/flavors'
import type {
  BrewMethod,
  GrindSize,
  DetectedFlavorInput,
  CoffeeEntryResult,
  CoffeeIdentificationResponse,
} from '@/lib/api/types'
import { CoffeeEntrySection } from '@/components/CoffeeEntrySection'
import { BagFlavorSuggestions } from '@/components/BagFlavorSuggestions'
import { FlavorPicker } from '@/components/FlavorPicker'
import { RatingInput } from '@/components/RatingInput'

export default function NewTastingPage() {
  const router = useRouter()
  const createTastingMutation = useCreateTasting()
  const createCoffeeMutation = useCreateCoffeeFromInput()

  const { data: flavorsData } = useFlavors()
  const allFlavors = flavorsData?.items ?? []
  const createFlavorMutation = useCreateFlavor()

  const [coffeeEntry, setCoffeeEntry] = useState<CoffeeEntryResult | null>(null)
  const [identification, setIdentification] = useState<CoffeeIdentificationResponse | null>(null)
  const [roastDate, setRoastDate] = useState('')
  const [lotNumber, setLotNumber] = useState('')
  const [brewMethod, setBrewMethod] = useState<BrewMethod | ''>('')
  const [grindSize, setGrindSize] = useState<GrindSize | ''>('')
  const [notes, setNotes] = useState('')
  const [detectedFlavors, setDetectedFlavors] = useState<DetectedFlavorInput[]>([])
  const [ratingScore, setRatingScore] = useState<number | null>(null)
  const [ratingNotes, setRatingNotes] = useState('')

  const isSubmitting = createTastingMutation.isPending || createCoffeeMutation.isPending
  const submitError = createTastingMutation.error || createCoffeeMutation.error

  const handleIdentified = (response: CoffeeIdentificationResponse) => {
    setIdentification(response)
    if (response.roast_date) {
      const parsed = new Date(response.roast_date)
      if (!isNaN(parsed.getTime())) {
        const yyyy = parsed.getFullYear()
        const mm = String(parsed.getMonth() + 1).padStart(2, '0')
        const dd = String(parsed.getDate()).padStart(2, '0')
        setRoastDate(`${yyyy}-${mm}-${dd}`)
      } else {
        setRoastDate(response.roast_date)
      }
    }
    if (response.lot_number) setLotNumber(response.lot_number)
  }

  const handleAddBagFlavor = async (flavorName: string, category: string | null, intensity: number) => {
    let flavor = allFlavors.find(
      (f) => f.name.toLowerCase() === flavorName.toLowerCase()
    )
    if (!flavor) {
      flavor = await createFlavorMutation.mutateAsync({
        name: flavorName,
        category: category ?? undefined,
      })
    }
    setDetectedFlavors((prev) => {
      const alreadyAdded = prev.some((df) => df.flavor_id === flavor.id)
      if (alreadyAdded) return prev
      return [...prev, { flavor_id: flavor.id, intensity }]
    })
  }

  const addedFlavorNames = new Set(
    detectedFlavors
      .map((df) => allFlavors.find((f) => f.id === df.flavor_id)?.name)
      .filter((name): name is string => name !== undefined)
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!coffeeEntry) return

    let coffeeId: string

    if (coffeeEntry.mode === 'existing') {
      coffeeId = coffeeEntry.coffee.id
    } else {
      const coffee = await createCoffeeMutation.mutateAsync(coffeeEntry.input)
      coffeeId = coffee.id
    }

    createTastingMutation.mutate({
      coffee_id: coffeeId,
      brew_method: brewMethod || undefined,
      grind_size: grindSize || undefined,
      notes: notes || undefined,
      detected_flavors: detectedFlavors.length > 0 ? detectedFlavors : undefined,
      rating: ratingScore ? { score: ratingScore, notes: ratingNotes || undefined } : undefined,
    })
  }

  const inputClass =
    'w-full px-3 py-2 bg-card border border-border focus:outline-none focus:border-ink text-ink transition-colors'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl font-bold text-ink mb-8">
        New Tasting
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {submitError && (
          <div className="bg-danger-soft text-danger p-4">
            {submitError.message}
          </div>
        )}

        <CoffeeEntrySection
          onChange={setCoffeeEntry}
          onIdentified={handleIdentified}
        />

        {(roastDate || lotNumber || identification) && (
          <div className="bg-card border border-border p-6 space-y-6">
            <h2 className="font-display text-xl font-semibold text-ink">
              Bag Info
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="roastDate"
                  className="block text-sm font-medium text-ink-muted mb-2"
                >
                  Roast Date
                </label>
                <input
                  id="roastDate"
                  type="date"
                  value={roastDate}
                  onChange={(e) => setRoastDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="lotNumber"
                  className="block text-sm font-medium text-ink-muted mb-2"
                >
                  Lot Number
                </label>
                <input
                  id="lotNumber"
                  type="text"
                  value={lotNumber}
                  onChange={(e) => setLotNumber(e.target.value)}
                  placeholder="e.g. L-274"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-card border border-border p-6 space-y-6">
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
                className={inputClass}
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
                className={inputClass}
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

        <div className="bg-card border border-border p-6 space-y-6">
          <h2 className="font-display text-xl font-semibold text-ink">
            Detected Flavors
          </h2>
          <p className="text-sm text-ink-muted">
            What flavors did you taste? Add them and rate their intensity.
          </p>
          {identification && identification.flavor_notes.length > 0 && (
            <BagFlavorSuggestions
              flavors={identification.flavor_notes}
              onAdd={handleAddBagFlavor}
              addedNames={addedFlavorNames}
            />
          )}
          <FlavorPicker
            selectedFlavors={detectedFlavors}
            onChange={setDetectedFlavors}
          />
        </div>

        <div className="bg-card border border-border p-6 space-y-6">
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
              className="w-full px-3 py-2 bg-card border border-border focus:outline-none focus:border-ink text-ink placeholder:text-ink-muted transition-colors"
            />
          </div>
        </div>

        <div className="bg-card border border-border p-6 space-y-6">
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
              className="w-full px-3 py-2 bg-card border border-border focus:outline-none focus:border-ink text-ink placeholder:text-ink-muted transition-colors"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/tastings')}
            className="px-6 py-2 border border-border text-ink hover:bg-sand transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!coffeeEntry || isSubmitting}
            className="px-6 py-2 bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Create Tasting'}
          </button>
        </div>
      </form>
    </div>
  )
}
