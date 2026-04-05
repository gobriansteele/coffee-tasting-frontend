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
      <div className="md:hidden flex justify-between items-center w-full h-14 relative z-50 bg-paper">
        <Link
          href="/"
          className="flex items-center space-x-2"
          onClick={() => onNavClick('/')}
        >
          <Logo className="w-8 h-8" />
        </Link>

        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 text-ink-muted hover:text-ink transition-colors"
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {mounted && resolvedTheme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {!isRecoveryMode && (
            <button
              onClick={onToggle}
              className="p-1.5 text-ink-muted hover:text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="h-5 w-5"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
          className="fixed inset-0 bg-black/25 z-30 md:hidden transition-opacity duration-300"
          onClick={() => onNavClick()}
        />
      )}

      {/* Mobile menu full-screen overlay */}
      {!isRecoveryMode && (
      <div
        className={`fixed left-0 right-0 bg-paper z-40 md:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? 'transform translate-y-0' : 'transform -translate-y-full'
        }`}
        style={{
          top: '56px',
          height: 'calc(100vh - 56px)',
        }}
      >
        <div className="h-full overflow-y-auto">
          <div className="px-6 py-10 space-y-1">
            {user ? (
              <>
                <Link
                  href="/tastings"
                  className="block px-2 py-4 text-2xl font-display font-medium text-ink hover:text-ink-muted min-h-[44px] flex items-center transition-colors border-b border-border"
                  onClick={() => onNavClick('/tastings')}
                >
                  Tastings
                </Link>
                <Link
                  href="/tastings/new"
                  className="block px-2 py-4 text-2xl font-display font-medium text-ink hover:text-ink-muted min-h-[44px] flex items-center transition-colors border-b border-border"
                  onClick={() => onNavClick('/tastings/new')}
                >
                  New Tasting
                </Link>
                <Link
                  href="/roasters"
                  className="block px-2 py-4 text-2xl font-display font-medium text-ink hover:text-ink-muted min-h-[44px] flex items-center transition-colors border-b border-border"
                  onClick={() => onNavClick('/roasters')}
                >
                  Roasters
                </Link>
                <Link
                  href="/coffees"
                  className="block px-2 py-4 text-2xl font-display font-medium text-ink hover:text-ink-muted min-h-[44px] flex items-center transition-colors border-b border-border"
                  onClick={() => onNavClick('/coffees')}
                >
                  Coffees
                </Link>
                <Link
                  href="/discover"
                  className="block px-2 py-4 text-2xl font-display font-medium text-ink hover:text-ink-muted min-h-[44px] flex items-center transition-colors border-b border-border"
                  onClick={() => onNavClick('/discover')}
                >
                  Discover
                </Link>

                <div className="pt-8 mt-4">
                  <Link
                    href="/profile"
                    className="block px-2 py-3 text-sm text-ink-muted hover:text-ink min-h-[44px] flex items-center transition-colors"
                    onClick={() => onNavClick('/profile')}
                  >
                    Profile
                  </Link>
                  <div className="px-2 py-1 text-xs text-ink-muted">
                    {user.email}
                  </div>
                  <button
                    onClick={() => {
                      onSignOut()
                      onNavClick()
                    }}
                    className="block w-full text-left px-2 py-3 text-sm text-ink-muted hover:text-danger min-h-[44px] flex items-center transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-2 py-4 text-2xl font-display font-medium text-ink hover:text-ink-muted min-h-[44px] flex items-center transition-colors border-b border-border"
                  onClick={() => onNavClick('/login')}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block px-2 py-4 text-2xl font-display font-medium text-ink hover:text-ink-muted min-h-[44px] flex items-center transition-colors border-2 border-ink"
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
