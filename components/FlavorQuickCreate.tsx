'use client'

import { useState } from 'react'
import { useCreateFlavor } from '@/lib/queries/flavors'
import type { Flavor } from '@/lib/api/types'

type FlavorQuickCreateProps = {
  onFlavorCreated: (flavor: Flavor) => void
  onCancel: () => void
}

const FLAVOR_CATEGORIES = [
  'Fruity',
  'Floral',
  'Sweet',
  'Nutty',
  'Chocolate',
  'Spicy',
  'Roasted',
  'Other',
]

export function FlavorQuickCreate({
  onFlavorCreated,
  onCancel,
}: FlavorQuickCreateProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const createFlavorMutation = useCreateFlavor()

  const handleCreate = () => {
    if (!name.trim()) return
    createFlavorMutation.mutate(
      { name: name.trim(), category: category || undefined },
      { onSuccess: (newFlavor) => onFlavorCreated(newFlavor) }
    )
  }

  return (
    <div className="border border-primary-soft bg-primary-soft rounded-md p-4 mt-2 space-y-3">
      {createFlavorMutation.error && (
        <div className="bg-danger-soft text-danger p-2 rounded-md text-sm">
          {createFlavorMutation.error.message}
        </div>
      )}

      <div>
        <label
          htmlFor="flavor-name"
          className="block text-sm font-medium text-ink-muted mb-1"
        >
          Flavor Name *
        </label>
        <input
          id="flavor-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Blueberry, Caramel, Jasmine"
          className="w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm text-ink placeholder:text-ink-muted"
        />
      </div>

      <div>
        <label
          htmlFor="flavor-category"
          className="block text-sm font-medium text-ink-muted mb-1"
        >
          Category
        </label>
        <select
          id="flavor-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm text-ink"
        >
          <option value="">Select a category</option>
          {FLAVOR_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 border border-border rounded-md text-ink hover:bg-sand text-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCreate}
          disabled={createFlavorMutation.isPending || !name.trim()}
          className="px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {createFlavorMutation.isPending ? 'Creating...' : 'Create Flavor'}
        </button>
      </div>
    </div>
  )
}
