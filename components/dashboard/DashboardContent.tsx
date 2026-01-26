import Link from 'next/link'
import type { Tasting } from '@/lib/api/types'
import { QuickStats } from './QuickStats'
import { RecentTastingCard } from './RecentTastingCard'

type DashboardContentProps = {
  userEmail: string
  tastings: Tasting[]
  totalTastings: number
  recentTastingsLimit?: number
}

export function DashboardContent({
  userEmail,
  tastings,
  totalTastings,
  recentTastingsLimit = 3,
}: DashboardContentProps) {
  const hasTastings = totalTastings > 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">
            Welcome back!
          </h1>
          <p className="text-ink-muted">{userEmail}</p>
        </div>
        {hasTastings && (
          <div className="flex space-x-3">
            <Link
              href="/coffees/new"
              className="bg-sand text-ink px-4 py-2 rounded-md hover:bg-border transition-colors"
            >
              Add Coffee
            </Link>
            <Link
              href="/tastings/new"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover transition-colors"
            >
              Record Tasting
            </Link>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <QuickStats tastings={tastings} totalTastings={totalTastings} />

      {/* Recent Tastings */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-xl font-semibold text-ink">
            Recent Tastings
          </h2>
          {hasTastings && (
            <Link
              href="/tastings"
              className="text-primary hover:underline text-sm"
            >
              View all ({totalTastings})
            </Link>
          )}
        </div>

        {hasTastings ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tastings.map((tasting, idx) =>
              idx < recentTastingsLimit ? (
                <RecentTastingCard key={tasting.id} tasting={tasting} />
              ) : null
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg shadow-sm">
            <p className="text-ink-muted">
              You haven&apos;t recorded any tastings yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
