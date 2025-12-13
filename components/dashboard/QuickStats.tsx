import Link from 'next/link'
import type { TastingSession } from '@/lib/api/types'

type QuickStatsProps = {
  tastings: TastingSession[]
  totalTastings: number
}

const MIN_TASTINGS_FOR_INSIGHTS = 3

function formatBrewMethod(method: string): string {
  return method
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function StatsContent({
  topRated,
  bestMethod,
}: {
  topRated: { name: string; roaster: string; avgRating: number; count: number }[]
  bestMethod: { method: string; avgRating: number; count: number } | null
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Top Rated Coffees */}
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <div className="text-sm text-ink-muted uppercase tracking-wide mb-4">
          Your Favorites
        </div>
        <div className="space-y-3">
          {topRated.map((coffee, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-ink truncate">
                  {coffee.name}
                </div>
                <div className="text-sm text-ink-muted truncate">
                  {coffee.roaster} · {coffee.count} tasting{coffee.count !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="ml-4 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-warning tabular-nums">
                  {coffee.avgRating.toFixed(1)}
                </span>
                <span className="text-sm text-ink-muted">/10</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Brew Method */}
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <div className="text-sm text-ink-muted uppercase tracking-wide mb-4">
          Best Brew Method
        </div>
        {bestMethod ? (
          <div>
            <div className="text-2xl font-bold text-ink mb-1">
              {formatBrewMethod(bestMethod.method)}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg text-warning tabular-nums">
                {bestMethod.avgRating.toFixed(1)}
              </span>
              <span className="text-sm text-ink-muted">avg rating</span>
            </div>
            <p className="text-sm text-ink-muted mt-3">
              Based on {bestMethod.count} tasting{bestMethod.count !== 1 ? 's' : ''}
            </p>
          </div>
        ) : (
          <p className="text-ink-muted">
            Try different brew methods to see which works best for you
          </p>
        )}
      </div>
    </div>
  )
}

function PlaceholderStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Top Rated Coffees Placeholder */}
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <div className="text-sm text-ink-muted uppercase tracking-wide mb-4">
          Your Favorites
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-ink">Ethiopian Yirgacheffe</div>
              <div className="text-sm text-ink-muted">Onyx Coffee Lab · 4 tastings</div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-warning tabular-nums">
                9.2
              </span>
              <span className="text-sm text-ink-muted">/10</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-ink">Colombia Huila</div>
              <div className="text-sm text-ink-muted">Counter Culture · 3 tastings</div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-warning tabular-nums">
                8.7
              </span>
              <span className="text-sm text-ink-muted">/10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Best Brew Method Placeholder */}
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <div className="text-sm text-ink-muted uppercase tracking-wide mb-4">
          Best Brew Method
        </div>
        <div>
          <div className="text-2xl font-bold text-ink mb-1">Pour Over</div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg text-warning tabular-nums">8.4</span>
            <span className="text-sm text-ink-muted">avg rating</span>
          </div>
          <p className="text-sm text-ink-muted mt-3">
            Based on 8 tastings
          </p>
        </div>
      </div>
    </div>
  )
}

export function QuickStats({ tastings, totalTastings }: QuickStatsProps) {
  const hasEnoughData = totalTastings >= MIN_TASTINGS_FOR_INSIGHTS

  // Group tastings by coffee and calculate average ratings
  const coffeeRatings = tastings.reduce<
    Record<string, { roaster: string; ratings: number[] }>
  >((acc, t) => {
    const name = t.coffee_name || 'Unknown Coffee'
    if (!acc[name]) {
      acc[name] = { roaster: t.roaster_name || 'Unknown Roaster', ratings: [] }
    }
    acc[name].ratings.push(t.overall_rating)
    return acc
  }, {})

  // Calculate top rated coffees (top 2 by average rating)
  const topRated = Object.entries(coffeeRatings)
    .map(([name, { roaster, ratings }]) => ({
      name,
      roaster,
      avgRating: ratings.reduce((a, b) => a + b, 0) / ratings.length,
      count: ratings.length,
    }))
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 2)

  // Calculate best brew method
  const methodRatings = tastings.reduce<Record<string, number[]>>((acc, t) => {
    if (!acc[t.brew_method]) {
      acc[t.brew_method] = []
    }
    acc[t.brew_method].push(t.overall_rating)
    return acc
  }, {})

  const methodAverages = Object.entries(methodRatings)
    .map(([method, ratings]) => ({
      method,
      avgRating: ratings.reduce((a, b) => a + b, 0) / ratings.length,
      count: ratings.length,
    }))
    .sort((a, b) => b.avgRating - a.avgRating)

  const bestMethod = methodAverages[0] ?? null

  if (hasEnoughData) {
    return <StatsContent topRated={topRated} bestMethod={bestMethod} />
  }

  // Teaser state with blur
  return (
    <div className="relative">
      {/* Blurred placeholder content */}
      <div className="blur-sm pointer-events-none select-none">
        <PlaceholderStats />
      </div>

      {/* Overlay with CTA */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-paper/60 rounded-lg">
        <p className="text-ink text-center mb-4 px-4">
          Record a few more tastings to unlock insights
        </p>
        <Link
          href="/tastings/new"
          className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-hover transition-colors"
        >
          Record Tasting
        </Link>
      </div>
    </div>
  )
}
