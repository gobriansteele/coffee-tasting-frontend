'use client'

import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import Logo from './Logo'
import { useTheme } from '@/hooks/use-theme'

type DesktopNavigationProps = {
  user: User | null
  onSignOut: () => void
  isRecoveryMode?: boolean
}

export function DesktopNavigation({ user, onSignOut, isRecoveryMode = false }: DesktopNavigationProps) {
  const { toggleTheme, resolvedTheme, mounted } = useTheme()

  return (
    <div className="hidden md:flex justify-between items-center w-full h-14">
      <div className="flex items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="w-8 h-8" />
        </Link>
        {user && !isRecoveryMode && (
          <div className="ml-10 flex items-center space-x-8">
            <Link
              href="/tastings"
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              Tastings
            </Link>
            <Link
              href="/tastings/new"
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              New Tasting
            </Link>
            <Link
              href="/roasters"
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              Roasters
            </Link>
            <Link
              href="/coffees"
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              Coffees
            </Link>
            <Link
              href="/discover"
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              Discover
            </Link>
          </div>
        )}
        {isRecoveryMode && (
          <div className="ml-10">
            <span className="text-ink-muted text-sm">Complete your password reset</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-6">
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

        {isRecoveryMode ? null : user ? (
          <>
            <Link
              href="/profile"
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              Profile
            </Link>
            <button
              onClick={onSignOut}
              className="text-sm text-ink-muted hover:text-danger transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm text-ink-muted hover:text-ink transition-colors">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-primary text-white px-4 py-2 text-sm hover:bg-primary-hover transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
