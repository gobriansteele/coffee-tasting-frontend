'use client'

import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import Logo from './Logo'
import { useTheme } from '@/hooks/use-theme'
import { AdminGraphSyncButton } from './dashboard/AdminGraphSyncButton'

type DesktopNavigationProps = {
  user: User | null
  onSignOut: () => void
  isRecoveryMode?: boolean
}

export function DesktopNavigation({ user, onSignOut, isRecoveryMode = false }: DesktopNavigationProps) {
  const { toggleTheme, resolvedTheme, mounted } = useTheme()

  return (
    <div className="hidden md:flex justify-between items-center w-full h-16">
      <div className="flex items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="w-10 h-10" />
        </Link>
        {user && !isRecoveryMode && (
          <div className="ml-10 flex items-center space-x-6">
            <Link
              href="/tastings"
              className="text-ink-muted hover:text-ink"
            >
              My Tastings
            </Link>
            <Link
              href="/tastings/new"
              className="text-ink-muted hover:text-ink"
            >
              New Tasting
            </Link>
            <Link
              href="/roasters"
              className="text-ink-muted hover:text-ink"
            >
              Roasters
            </Link>
            <Link
              href="/coffees"
              className="text-ink-muted hover:text-ink"
            >
              Coffees
            </Link>
          </div>
        )}
        {isRecoveryMode && (
          <div className="ml-10">
            <span className="text-ink-muted text-sm">Complete your password reset</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Admin Graph Sync - only visible to admins */}
        <AdminGraphSyncButton />

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

        {isRecoveryMode ? null : user ? (
          <>
            <span className="text-sm text-ink-muted">{user.email}</span>
            <button
              onClick={onSignOut}
              className="text-ink-muted hover:text-ink text-sm cursor-pointer"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-ink-muted hover:text-ink">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary-hover"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
