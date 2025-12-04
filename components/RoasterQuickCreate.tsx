'use client'

import { useState } from 'react'
import { useCreateRoaster } from '@/lib/queries/roasters'
import type { Roaster } from '@/lib/api/types'

interface RoasterQuickCreateProps {
  onRoasterCreated: (roaster: Roaster) => void
  onCancel: () => void
}

export function RoasterQuickCreate({
  onRoasterCreated,
  onCancel,
}: RoasterQuickCreateProps) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const createRoasterMutation = useCreateRoaster()

  const handleCreate = () => {
    if (!name.trim()) return
    createRoasterMutation.mutate(
      { name: name.trim(), location: location.trim() || undefined },
      { onSuccess: (newRoaster) => onRoasterCreated(newRoaster) }
    )
  }

  return (
    <div className="border border-blue-200 bg-blue-50 rounded-md p-4 mt-2 space-y-3">
      {createRoasterMutation.error && (
        <div className="bg-red-50 text-red-600 p-2 rounded-md text-sm">
          {createRoasterMutation.error.message}
        </div>
      )}

      <div>
        <label
          htmlFor="roaster-name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Roaster Name *
        </label>
        <input
          id="roaster-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Blue Bottle Coffee"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="roaster-location"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Location
        </label>
        <input
          id="roaster-location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Oakland, CA"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCreate}
          disabled={createRoasterMutation.isPending || !name.trim()}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {createRoasterMutation.isPending ? 'Creating...' : 'Create Roaster'}
        </button>
      </div>
    </div>
  )
}
