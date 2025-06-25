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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Coffee Tasting Notes
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Track, analyze, and improve your coffee tasting experiences
        </p>

        {user ? (
          <div className="space-y-6">
            <p className="text-lg text-gray-700">Welcome back, {user.email}!</p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/tastings/new"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Record New Tasting
              </Link>
              <Link
                href="/tastings"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors"
              >
                View My Tastings
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-lg text-gray-700">
              Get started by creating an account or signing in
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Track Tastings</h3>
          <p className="text-gray-600">
            Record detailed notes about each coffee you taste, including brewing
            parameters, flavor notes, and ratings.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Discover Patterns</h3>
          <p className="text-gray-600">
            Analyze your tasting history to discover your flavor preferences and
            find your perfect coffee profile.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Explore Roasters</h3>
          <p className="text-gray-600">
            Keep track of your favorite roasters and coffees, and discover new
            ones based on your taste preferences.
          </p>
        </div>
      </div>
    </div>
  )
}
