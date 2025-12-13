import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-ink mb-4">
          Welcome to Coffee Tasting Notes
        </h1>
        <p className="text-xl text-ink-muted mb-8">
          Track, analyze, and improve your coffee tasting experiences
        </p>

        {user ? (
          <div className="space-y-6">
            <p className="text-lg text-ink">Welcome back, {user.email}!</p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/coffees/new"
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-hover transition-colors"
              >
                Add Coffee
              </Link>
              <Link
                href="/tastings/new"
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-hover transition-colors"
              >
                Record Tasting
              </Link>
              <Link
                href="/tastings"
                className="bg-sand text-ink px-6 py-3 rounded-md hover:bg-border transition-colors"
              >
                View Tastings
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-lg text-ink">
              Get started by creating an account or signing in
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/signup"
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-hover transition-colors"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="bg-sand text-ink px-6 py-3 rounded-md hover:bg-border transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h3 className="font-display text-xl font-semibold mb-3 text-ink">Track Tastings</h3>
          <p className="text-ink-muted">
            Record detailed notes about each coffee you taste, including brewing
            parameters, flavor notes, and ratings.
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h3 className="font-display text-xl font-semibold mb-3 text-ink">Discover Patterns</h3>
          <p className="text-ink-muted">
            Analyze your tasting history to discover your flavor preferences and
            find your perfect coffee profile.
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h3 className="font-display text-xl font-semibold mb-3 text-ink">Explore Roasters</h3>
          <p className="text-ink-muted">
            Keep track of your favorite roasters and coffees, and discover new
            ones based on your taste preferences.
          </p>
        </div>
      </div>
    </div>
  )
}
