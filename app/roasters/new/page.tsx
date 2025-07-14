'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { CreateRoasterRequest } from '@/lib/api/types'
import { queryKeys } from '@/lib/query-keys'

export default function NewRoasterPage() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const {
    mutate: createRoaster,
    isPending: isCreating,
    error: createError,
  } = useMutation({
    mutationFn: (roasterData: CreateRoasterRequest) =>
      apiClient.createRoaster(roasterData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roasters.all() })
      router.push('/roasters')
    },
    onError: () => {
      // do error stuff
    },
  })
  // Form state
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const roasterData = {
      name,
      location: location || undefined,
      website: website || undefined,
      notes: notes || undefined,
    }

    createRoaster(roasterData)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Roaster</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {createError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md">
            {createError.message}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Roaster Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Blue Bottle Coffee"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Oakland, CA"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Website
            </label>
            <input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="e.g., https://bluebottlecoffee.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Any additional notes about this roaster..."
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
            disabled={isCreating}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating...' : 'Create Roaster'}
          </button>
        </div>
      </form>
    </div>
  )
}
