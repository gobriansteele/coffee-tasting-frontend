'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api/client'
import type { Coffee, Roaster, FlavorTag } from '@/lib/api/types'

export default function NewTastingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [coffees, setCoffees] = useState<Coffee[]>([])
  const [roasters, setRoasters] = useState<Roaster[]>([])
  const [flavorTags, setFlavorTags] = useState<FlavorTag[]>([])
  const [selectedCoffeeId, setSelectedCoffeeId] = useState('')
  const [brewMethod, setBrewMethod] = useState('')
  const [grindSize, setGrindSize] = useState('')
  const [waterTemp, setWaterTemp] = useState('')
  const [brewTime, setBrewTime] = useState('')
  const [coffeeGrams, setCoffeeGrams] = useState('')
  const [waterGrams, setWaterGrams] = useState('')
  const [overallRating, setOverallRating] = useState('5')
  const [notes, setNotes] = useState('')
  const [tastingDate, setTastingDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [roastersData, tagsData] = await Promise.all([
        apiClient.getRoasters(),
        apiClient.getFlavorTags(),
      ])
      setRoasters(roastersData.roasters)
      setFlavorTags(tagsData.flavor_tags)
    } catch (err) {
      setError('Failed to load data')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const sessionData = {
        coffee_id: selectedCoffeeId,
        brew_method: brewMethod,
        grind_size: grindSize || undefined,
        water_temp_celsius: waterTemp ? parseFloat(waterTemp) : undefined,
        brew_time_seconds: brewTime ? parseInt(brewTime) : undefined,
        coffee_grams: coffeeGrams ? parseFloat(coffeeGrams) : undefined,
        water_grams: waterGrams ? parseFloat(waterGrams) : undefined,
        overall_rating: parseFloat(overallRating),
        notes: notes || undefined,
        tasting_date: tastingDate,
      }

      const newSession = await apiClient.createTastingSession(sessionData)
      router.push(`/tastings/${newSession.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tasting')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        New Tasting Session
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
        )}

        <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Coffee Details
          </h2>

          <div>
            <label
              htmlFor="coffee"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Coffee *
            </label>
            <select
              id="coffee"
              value={selectedCoffeeId}
              onChange={(e) => setSelectedCoffeeId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a coffee</option>
              {coffees.map((coffee) => (
                <option key={coffee.id} value={coffee.id}>
                  {coffee.name} - {coffee.roaster?.name || 'Unknown Roaster'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="tastingDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tasting Date *
            </label>
            <input
              id="tastingDate"
              type="date"
              value={tastingDate}
              onChange={(e) => setTastingDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Brewing Parameters
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="brewMethod"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Brew Method *
              </label>
              <input
                id="brewMethod"
                type="text"
                value={brewMethod}
                onChange={(e) => setBrewMethod(e.target.value)}
                required
                placeholder="e.g., V60, Chemex, Espresso"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="grindSize"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Grind Size
              </label>
              <input
                id="grindSize"
                type="text"
                value={grindSize}
                onChange={(e) => setGrindSize(e.target.value)}
                placeholder="e.g., Medium, Fine, Coarse"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="waterTemp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Water Temperature (°C)
              </label>
              <input
                id="waterTemp"
                type="number"
                value={waterTemp}
                onChange={(e) => setWaterTemp(e.target.value)}
                placeholder="e.g., 93"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="brewTime"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Brew Time (seconds)
              </label>
              <input
                id="brewTime"
                type="number"
                value={brewTime}
                onChange={(e) => setBrewTime(e.target.value)}
                placeholder="e.g., 180"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="coffeeGrams"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="waterGrams"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Water (grams)
              </label>
              <input
                id="waterGrams"
                type="number"
                value={waterGrams}
                onChange={(e) => setWaterGrams(e.target.value)}
                placeholder="e.g., 250"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Rating & Notes
          </h2>

          <div>
            <label
              htmlFor="overallRating"
              className="block text-sm font-medium text-gray-700 mb-2"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tasting Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Describe the flavors, aromas, and overall experience..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/tastings')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Tasting'}
          </button>
        </div>
      </form>
    </div>
  )
}
