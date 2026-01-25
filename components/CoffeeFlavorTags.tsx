import type { Flavor } from '@/lib/api/types'

type CoffeeFlavorTagsProps = {
  flavors: Flavor[]
  limit?: number
  size?: 'sm' | 'md'
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
}

export function CoffeeFlavorTags({
  flavors,
  limit,
  size = 'md',
}: CoffeeFlavorTagsProps) {
  if (flavors.length === 0) {
    return null
  }

  const displayFlavors = limit ? flavors.slice(0, limit) : flavors
  const remainingCount = limit ? Math.max(0, flavors.length - limit) : 0

  return (
    <div className="flex flex-wrap gap-1.5">
      {displayFlavors.map((flavor) => (
        <span
          key={flavor.id}
          className={`bg-primary-soft text-primary rounded-full ${sizeClasses[size]}`}
        >
          {flavor.name}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className={`text-ink-muted ${sizeClasses[size]}`}>
          +{remainingCount} more
        </span>
      )}
    </div>
  )
}
