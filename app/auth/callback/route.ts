import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      // If code exchange fails, redirect to forgot password with error
      return NextResponse.redirect(
        `${origin}/forgot-password?error=Your reset link has expired or is invalid. Please request a new one.`
      )
    }

    // If this is a password recovery flow, set cookie and redirect to reset password page
    if (type === 'recovery') {
      const response = NextResponse.redirect(`${origin}/auth/reset-password`)
      response.cookies.set('recovery_mode', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 15, // 15 minutes
        path: '/',
      })
      return response
    }
  }

  // Default: redirect to home after sign in/sign up
  return NextResponse.redirect(`${origin}/`)
}
