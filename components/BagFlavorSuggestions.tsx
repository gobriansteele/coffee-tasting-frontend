import type { IdentifiedFlavor } from '@/lib/api/types'

type BagFlavorSuggestionsProps = {
  flavors: IdentifiedFlavor[]
  onAdd: (flavorName: string, category: string | null, intensity: number) => void
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
            onClick={added ? undefined : () => onAdd(flavor.name, flavor.category, 5)}
            className={`px-3 py-2 border text-sm transition-colors min-h-[44px] ${
              added
                ? 'border-border text-ink-muted opacity-50 cursor-default'
                : 'border-border text-ink cursor-pointer hover:border-ink active:bg-sand'
            }`}
          >
            {added ? '✓' : '+'} {flavor.name}
          </button>
        )
      })}
    </div>
  )
}
