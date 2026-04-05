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

        return (
          <button
            key={flavor.name}
            type="button"
            disabled={added}
            onClick={added ? undefined : () => onAdd(flavor.name, flavor.category)}
            className={`px-2 py-0.5 border border-border text-xs transition-colors ${
              added
                ? 'text-ink-muted opacity-50 cursor-default'
                : 'text-ink cursor-pointer hover:border-ink'
            }`}
          >
            {added ? '✓' : '+'} {flavor.name}
          </button>
        )
      })}
    </div>
  )
}
