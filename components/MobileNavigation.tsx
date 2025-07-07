import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import Logo from './Logo'

interface MobileNavigationProps {
  user: User | null
  isOpen: boolean
  onToggle: () => void
  onNavClick: (href?: string) => void
  onSignOut: () => void
}

export function MobileNavigation({
  user,
  isOpen,
  onToggle,
  onNavClick,
  onSignOut,
}: MobileNavigationProps) {
  return (
    <>
      {/* Mobile navigation bar */}
      <div className="md:hidden flex justify-between items-center w-full h-16 relative z-50 bg-white">
        <Link
          href="/"
          className="flex items-center space-x-2"
          onClick={() => onNavClick('/')}
        >
          <Logo className="w-10 h-10" />
        </Link>

        <button
          onClick={onToggle}
          className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle mobile menu"
        >
          <svg
            className="h-6 w-6"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Backdrop overlay for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-25 z-30 md:hidden transition-opacity duration-300"
          onClick={() => onNavClick()}
        />
      )}

      {/* Mobile menu full-screen overlay */}
      <div
        className={`fixed left-0 right-0 bg-white z-40 md:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? 'transform translate-y-0' : 'transform -translate-y-full'
        }`}
        style={{
          top: '64px',
          height: 'calc(100vh - 64px)',
        }}
      >
        <div className="h-full overflow-y-auto">
          <div className="px-6 py-8 space-y-2">
            {user ? (
              <>
                <Link
                  href="/tastings"
                  className="block px-4 py-4 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg min-h-[44px] flex items-center transition-colors duration-200"
                  onClick={() => onNavClick('/tastings')}
                >
                  My Tastings
                </Link>
                <Link
                  href="/tastings/new"
                  className="block px-4 py-4 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg min-h-[44px] flex items-center transition-colors duration-200"
                  onClick={() => onNavClick('/tastings/new')}
                >
                  New Tasting
                </Link>
                <Link
                  href="/roasters"
                  className="block px-4 py-4 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg min-h-[44px] flex items-center transition-colors duration-200"
                  onClick={() => onNavClick('/roasters')}
                >
                  Roasters
                </Link>

                <div className="border-t border-gray-200 pt-6 mt-8">
                  <div className="px-4 py-2 text-sm text-gray-600 font-medium">
                    {user.email}
                  </div>
                  <button
                    onClick={() => {
                      onSignOut()
                      onNavClick()
                    }}
                    className="block w-full text-left px-4 py-4 text-lg font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg min-h-[44px] flex items-center transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-4 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg min-h-[44px] flex items-center transition-colors duration-200"
                  onClick={() => onNavClick('/login')}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-4 text-lg font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg min-h-[44px] flex items-center transition-colors duration-200 mt-4"
                  onClick={() => onNavClick('/signup')}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
