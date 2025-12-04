import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import Logo from './Logo'

interface DesktopNavigationProps {
  user: User | null
  onSignOut: () => void
}

export function DesktopNavigation({ user, onSignOut }: DesktopNavigationProps) {
  return (
    <div className="hidden md:flex justify-between items-center w-full h-16">
      <div className="flex items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="w-10 h-10" />
        </Link>
        {user && (
          <div className="ml-10 flex items-center space-x-6">
            <Link
              href="/tastings"
              className="text-gray-700 hover:text-gray-900"
            >
              My Tastings
            </Link>
            <Link
              href="/tastings/new"
              className="text-gray-700 hover:text-gray-900"
            >
              New Tasting
            </Link>
            <Link
              href="/roasters"
              className="text-gray-700 hover:text-gray-900"
            >
              Roasters
            </Link>
            <Link
              href="/coffees"
              className="text-gray-700 hover:text-gray-900"
            >
              Coffees
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={onSignOut}
              className="text-gray-700 hover:text-gray-900 text-sm cursor-pointer"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-gray-700 hover:text-gray-900">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
