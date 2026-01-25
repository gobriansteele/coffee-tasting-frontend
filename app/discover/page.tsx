'use client'

import Link from 'next/link'
import { useTastings } from '@/lib/queries/tastings'

export default function DiscoverPage() {
  const { data: tastings } = useTastings({ limit: 10 })

  // Get recently tasted coffees for "Find Similar" suggestions
  const recentCoffees = tastings?.items
    .map((t) => t.coffee)
    .filter((coffee, index, self) =>
      index === self.findIndex((c) => c.id === coffee.id)
    )
    .slice(0, 4) || []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl font-bold text-ink mb-8">
        Discover Coffee
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Find by Flavor */}
        <Link
          href="/discover/by-flavor"
          className="bg-card shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary-soft rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">
                Search by Flavor
              </h2>
              <p className="text-sm text-ink-muted">
                Find coffees with specific flavors you enjoy
              </p>
            </div>
          </div>
          <p className="text-ink-muted">
            Select flavors you want to explore and we&apos;ll show you coffees
            that match your preferences.
          </p>
        </Link>

        {/* Find Similar */}
        <div className="bg-card shadow-sm rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-success-soft rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">
                Find Similar Coffees
              </h2>
              <p className="text-sm text-ink-muted">
                Discover coffees similar to ones you&apos;ve loved
              </p>
            </div>
          </div>

          {recentCoffees.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-ink-muted mb-3">
                Select a coffee you&apos;ve tried:
              </p>
              {recentCoffees.map((coffee) => (
                <Link
                  key={coffee.id}
                  href={`/discover/similar/${coffee.id}`}
                  className="block p-3 bg-sand rounded-lg hover:bg-border transition-colors"
                >
                  <span className="font-medium text-ink">{coffee.name}</span>
                  {coffee.roaster && (
                    <span className="text-sm text-ink-muted ml-2">
                      by {coffee.roaster.name}
                    </span>
                  )}
                </Link>
              ))}
              <Link
                href="/coffees"
                className="block text-center text-sm text-primary hover:underline mt-2"
              >
                Browse all coffees →
              </Link>
            </div>
          ) : (
            <p className="text-ink-muted">
              Record some tastings first, then we&apos;ll suggest similar
              coffees based on what you&apos;ve enjoyed.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
