'use client'

import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import Logo from './Logo'
import { useTheme } from '@/hooks/use-theme'

type MobileNavigationProps = {
  user: User | null
  isOpen: boolean
  onToggle: () => void
  onNavClick: (href?: string) => void
  onSignOut: () => void
  isRecoveryMode?: boolean
}

export function MobileNavigation({
  user,
  isOpen,
  onToggle,
  onNavClick,
  onSignOut,
  isRecoveryMode = false,
}: MobileNavigationProps) {
  const { toggleTheme, resolvedTheme, mounted } = useTheme()

  return (
    <>
      {/* Mobile navigation bar */}
      <div className="md:hidden flex justify-between items-center w-full h-16 relative z-50 bg-card">
        <Link
          href="/"
          className="flex items-center space-x-2"
          onClick={() => onNavClick('/')}
        >
          <Logo className="w-10 h-10" />
        </Link>

        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-ink-muted hover:text-ink hover:bg-sand transition-colors"
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {mounted && resolvedTheme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {!isRecoveryMode && (
            <button
              onClick={onToggle}
              className="p-2 rounded-md text-ink-muted hover:text-ink hover:bg-sand focus:outline-none focus:ring-2 focus:ring-primary"
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
          )}
        </div>
      </div>

      {/* Backdrop overlay for mobile menu */}
      {isOpen && !isRecoveryMode && (
        <div
          className="fixed inset-0 bg-opacity-25 z-30 md:hidden transition-opacity duration-300"
          onClick={() => onNavClick()}
        />
      )}

      {/* Mobile menu full-screen overlay */}
      {!isRecoveryMode && (
      <div
        className={`fixed left-0 right-0 bg-card z-40 md:hidden transition-transform duration-300 ease-in-out ${
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
                  className="block px-4 py-4 text-lg font-medium text-ink-muted hover:text-ink hover:bg-sand rounded-lg min-h-[44px] flex items-center transition-colors duration-200"
                  onClick={() => onNavClick('/tastings')}
                >
                  My Tastings
                </Link>
                <Link
                  href="/tastings/new"
                  className="block px-4 py-4 text-lg font-medium text-ink-muted hover:text-ink hover:bg-sand rounded-lg min-h-[44px] flex items-center transition-colors duration-200"
                  onClick={() => onNavClick('/tastings/new')}
                >
                  New Tasting
                </Link>
                <Link
                  href="/roasters"
                  className="block px-4 py-4 text-lg font-medium text-ink-muted hover:text-ink hover:bg-sand rounded-lg min-h-[44px] flex items-center transition-colors duration-200"
                  onClick={() => onNavClick('/roasters')}
                >
                  Roasters
                </Link>
                <Link
                  href="/coffees"
                  className="block px-4 py-4 text-lg font-medium text-ink-muted hover:text-ink hover:bg-sand rounded-lg min-h-[44px] flex items-center transition-colors duration-200"
                  onClick={() => onNavClick('/coffees')}
                >
                  Coffees
                </Link>

                <div className="border-t border-border pt-6 mt-8">
                  <div className="px-4 py-2 text-sm text-ink-muted font-medium">
                    {user.email}
                  </div>
                  <button
                    onClick={() => {
                      onSignOut()
                      onNavClick()
                    }}
                    className="block w-full text-left px-4 py-4 text-lg font-medium text-danger hover:bg-danger-soft rounded-lg min-h-[44px] flex items-center transition-colors duration-200 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-4 text-lg font-medium text-ink-muted hover:text-ink hover:bg-sand rounded-lg min-h-[44px] flex items-center transition-colors duration-200"
                  onClick={() => onNavClick('/login')}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-4 text-lg font-medium bg-primary text-white hover:bg-primary-hover rounded-lg min-h-[44px] flex items-center transition-colors duration-200 mt-4"
                  onClick={() => onNavClick('/signup')}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      )}
    </>
  )
}
