import Link from 'next/link'
import type { SimilarCoffee } from '@/lib/api/types'
import { CoffeeFlavorTags } from './CoffeeFlavorTags'

type SimilarCoffeesListProps = {
  similarCoffees: SimilarCoffee[]
  emptyMessage?: string
}

export function SimilarCoffeesList({
  similarCoffees,
  emptyMessage = 'No similar coffees found.',
}: SimilarCoffeesListProps) {
  if (similarCoffees.length === 0) {
    return (
      <div className="text-center py-8 text-ink-muted">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {similarCoffees.map((item) => (
        <Link
          key={item.coffee.id}
          href={`/coffees/${item.coffee.id}`}
          className="block bg-card rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-ink">{item.coffee.name}</h3>
              {item.coffee.roaster && (
                <p className="text-sm text-ink-muted">
                  {item.coffee.roaster.name}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary tabular-nums">
                {Math.round(item.similarity_score * 100)}%
              </div>
              <div className="text-xs text-ink-muted">match</div>
            </div>
          </div>

          {item.shared_flavors.length > 0 && (
            <div className="mt-3">
              <div className="text-xs text-ink-muted mb-1">Shared flavors:</div>
              <div className="flex flex-wrap gap-1">
                {item.shared_flavors.map((flavor, index) => (
                  <span
                    key={index}
                    className="bg-success-soft text-success px-2 py-0.5 rounded text-xs"
                  >
                    {flavor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.coffee.flavors && item.coffee.flavors.length > 0 && (
            <div className="mt-2">
              <CoffeeFlavorTags flavors={item.coffee.flavors} size="sm" limit={4} />
            </div>
          )}
        </Link>
      ))}
    </div>
  )
}
