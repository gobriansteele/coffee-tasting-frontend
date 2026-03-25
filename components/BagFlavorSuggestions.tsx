import type { IdentifiedFlavor } from '@/lib/api/types'

type BagFlavorSuggestionsProps = {
  flavors: IdentifiedFlavor[]
  onAdd: (flavorName: string, category: string | null) => void
  addedNames?: Set<string>
}

export function BagFlavorSuggestions({
  flavors,
  onAdd,
  addedNames,
}: BagFlavorSuggestionsProps) {
  if (flavors.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-ink-muted">Bag describes:</span>
      {flavors.map((flavor) => {
        const added = addedNames?.has(flavor.name) ?? false

        if (added) {
          return (
            <span
              key={flavor.name}
              className="px-2 py-0.5 bg-sand text-ink-muted text-xs rounded-full opacity-50"
            >
              ✓ {flavor.name}
            </span>
          )
        }

        return (
          <button
            key={flavor.name}
            type="button"
            onClick={() => onAdd(flavor.name, flavor.category)}
            className="px-2 py-0.5 bg-sand text-ink text-xs rounded-full cursor-pointer hover:bg-copper-soft hover:text-copper transition-colors"
          >
            + {flavor.name}
          </button>
        )
      })}
    </div>
  )
}
