import type { FlavorProfile } from '@/lib/api/types'

type FlavorProfileListProps = {
  flavorProfile: FlavorProfile
}

export function FlavorProfileList({ flavorProfile }: FlavorProfileListProps) {
  const { total_tastings, top_flavors, flavor_categories } = flavorProfile

  if (total_tastings === 0) {
    return (
      <div className="text-center py-8 text-ink-muted">
        <p>No flavor profile yet.</p>
        <p className="text-sm mt-2">
          Record some tastings to discover your flavor preferences.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Flavors */}
      {top_flavors?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-ink mb-3">Top Flavors</h3>
          <div className="space-y-3">
            {top_flavors.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-sand rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-primary tabular-nums">
                    #{index + 1}
                  </span>
                  <div>
                    <span className="font-medium text-ink">
                      {entry.flavor.name}
                    </span>
                    {entry.flavor.category && (
                      <span className="ml-2 text-xs bg-card text-ink-muted px-2 py-0.5 rounded">
                        {entry.flavor.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-ink-muted">
                    {entry.count} time{entry.count !== 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-ink-muted">
                    avg intensity: {entry.avg_intensity.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flavor Categories */}
      {flavor_categories && Object.keys(flavor_categories).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-ink mb-3">
            Category Distribution
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(flavor_categories)
              .sort(([, a], [, b]) => b - a)
              .map(([category, count]) => (
                <div
                  key={category}
                  className="p-3 bg-card border border-border rounded-lg text-center"
                >
                  <div className="text-2xl font-bold text-primary tabular-nums">
                    {count}
                  </div>
                  <div className="text-sm text-ink-muted">{category}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="text-sm text-ink-muted text-center pt-4 border-t border-border">
        Based on {total_tastings} tasting{total_tastings !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
