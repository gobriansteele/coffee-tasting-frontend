'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-card shadow-sm rounded-lg px-8 py-10">
          <h2 className="font-display text-2xl font-bold text-center text-ink mb-8">
            Reset Your Password
          </h2>

          {success ? (
            <div className="space-y-6">
              <div className="bg-success-soft text-success p-3 rounded-md text-sm">
                Check your email for a password reset link. If you don&apos;t see it, check your spam folder.
              </div>
              <p className="text-center text-sm text-ink-muted">
                <Link href="/login" className="text-primary hover:underline">
                  Back to sign in
                </Link>
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-ink-muted mb-6 text-center">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {(error || urlError) && (
                  <div className="bg-danger-soft text-danger p-3 rounded-md text-sm">
                    {error || urlError}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-ink-muted mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-ink placeholder:text-ink-muted"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-ink-muted">
                Remember your password?{' '}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
