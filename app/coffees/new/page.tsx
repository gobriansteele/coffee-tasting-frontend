'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiClient } from '@/lib/api/client'
import type {
  CreateCoffeeRequest,
  ProcessingMethod,
  RoastLevel,
  Roaster,
} from '@/lib/api/types'

export default function NewCoffeePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [roasters, setRoasters] = useState<Roaster[]>([])
  const [loadingRoasters, setLoadingRoasters] = useState(true)

  // Form state
  const [name, setName] = useState('')
  const [roasterId, setRoasterId] = useState('')

  // Origin info
  const [originCountry, setOriginCountry] = useState('')
  const [originRegion, setOriginRegion] = useState('')
  const [farmName, setFarmName] = useState('')
  const [producer, setProducer] = useState('')
  const [altitude, setAltitude] = useState('')

  // Processing
  const [processingMethod, setProcessingMethod] = useState<
    ProcessingMethod | ''
  >('')
  const [variety, setVariety] = useState('')

  // Roasting
  const [roastLevel, setRoastLevel] = useState<RoastLevel | ''>('')
  const [roastDate, setRoastDate] = useState('')

  // Additional info
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [bagSize, setBagSize] = useState('')

  useEffect(() => {
    loadRoasters()

    // Pre-select roaster from query params
    const roasterIdParam = searchParams.get('roasterId')
    if (roasterIdParam) {
      setRoasterId(roasterIdParam)
    }
  }, [searchParams])

  const loadRoasters = async () => {
    try {
      setLoadingRoasters(true)
      const data = await apiClient.getRoasters()
      setRoasters(data.roasters)
    } catch (err) {
      setError('Failed to load roasters')
    } finally {
      setLoadingRoasters(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const coffeeData: CreateCoffeeRequest = {
        name,
        roaster_id: roasterId,
        origin_country: originCountry || undefined,
        origin_region: originRegion || undefined,
        farm_name: farmName || undefined,
        producer: producer || undefined,
        altitude: altitude || undefined,
        processing_method: processingMethod || undefined,
        variety: variety || undefined,
        roast_level: roastLevel || undefined,
        roast_date: roastDate || undefined,
        description: description || undefined,
        price: price ? parseFloat(price) : undefined,
        bag_size: bagSize || undefined,
      }

      await apiClient.createCoffee(coffeeData)
      router.push(`/roasters/${roasterId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create coffee')
      setLoading(false)
    }
  }

  if (loadingRoasters) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading roasters...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Coffee</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
        )}

        {/* Basic Info */}
        <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h2>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="roaster"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Roaster *
            </label>
            <select
              id="roaster"
              value={roasterId}
              onChange={(e) => setRoasterId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a roaster</option>
              {roasters.map((roaster) => (
                <option key={roaster.id} value={roaster.id}>
                  {roaster.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Origin Information */}
        <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Origin Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="originCountry"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Country
              </label>
              <input
                id="originCountry"
                type="text"
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value)}
                placeholder="e.g., Ethiopia"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="originRegion"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Region
              </label>
              <input
                id="originRegion"
                type="text"
                value={originRegion}
                onChange={(e) => setOriginRegion(e.target.value)}
                placeholder="e.g., Yirgacheffe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="farmName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Farm Name
              </label>
              <input
                id="farmName"
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="e.g., Chelchele Farm"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="producer"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Producer
              </label>
              <input
                id="producer"
                type="text"
                value={producer}
                onChange={(e) => setProducer(e.target.value)}
                placeholder="e.g., Kebede Alemu"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="altitude"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Altitude
              </label>
              <input
                id="altitude"
                type="text"
                value={altitude}
                onChange={(e) => setAltitude(e.target.value)}
                placeholder="e.g., 1800-2000m"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="variety"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Variety
              </label>
              <input
                id="variety"
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g., Heirloom"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Processing & Roasting */}
        <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Processing & Roasting
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="processingMethod"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Processing Method
              </label>
              <select
                id="processingMethod"
                value={processingMethod}
                onChange={(e) =>
                  setProcessingMethod(e.target.value as ProcessingMethod)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select processing method</option>
                <option value="washed">Washed</option>
                <option value="natural">Natural</option>
                <option value="honey">Honey</option>
                <option value="semi_washed">Semi-washed</option>
                <option value="wet_hulled">Wet Hulled</option>
                <option value="anaerobic">Anaerobic</option>
                <option value="carbonic_maceration">Carbonic Maceration</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="roastLevel"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Roast Level
              </label>
              <select
                id="roastLevel"
                value={roastLevel}
                onChange={(e) => setRoastLevel(e.target.value as RoastLevel)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select roast level</option>
                <option value="light">Light</option>
                <option value="medium_light">Medium-Light</option>
                <option value="medium">Medium</option>
                <option value="medium_dark">Medium-Dark</option>
                <option value="dark">Dark</option>
                <option value="french">French</option>
                <option value="italian">Italian</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="roastDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Roast Date
              </label>
              <input
                id="roastDate"
                type="text"
                value={roastDate}
                onChange={(e) => setRoastDate(e.target.value)}
                placeholder="e.g., 2024-01-15 or Jan 15, 2024"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Additional Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Price
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 18.50"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="bagSize"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Bag Size
              </label>
              <input
                id="bagSize"
                type="text"
                value={bagSize}
                onChange={(e) => setBagSize(e.target.value)}
                placeholder="e.g., 12oz, 340g"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the coffee's flavor profile, tasting notes, etc..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/roasters')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Coffee'}
          </button>
        </div>
      </form>
    </div>
  )
}
