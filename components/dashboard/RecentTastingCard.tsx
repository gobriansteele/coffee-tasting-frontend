import Link from 'next/link'
import type { TastingSession } from '@/lib/api/types'
import { formatShortDate } from '@/lib/utils/date'

type RecentTastingCardProps = {
  tasting: TastingSession
}

function formatBrewMethod(method: string): string {
  return method
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function RecentTastingCard({ tasting }: RecentTastingCardProps) {
  return (
    <Link
      href={`/tastings/${tasting.id}`}
      className="bg-card rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-ink">
          {tasting.coffee_name || 'Unknown Coffee'}
        </h3>
        <p className="text-sm text-ink-muted">
          {tasting.roaster_name || 'Unknown Roaster'}
        </p>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-ink-muted">Method:</span>
          <span className="font-medium text-ink">
            {formatBrewMethod(tasting.brew_method)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-muted">Rating:</span>
          <span className="font-medium text-ink tabular-nums">
            {tasting.overall_rating}/10
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-muted">Date:</span>
          <span className="font-medium text-ink">
            {formatShortDate(tasting.created_at)}
          </span>
        </div>
      </div>

      {tasting.notes && (
        <p className="mt-3 text-sm text-ink-muted line-clamp-2">
          {tasting.notes}
        </p>
      )}
    </Link>
  )
}
