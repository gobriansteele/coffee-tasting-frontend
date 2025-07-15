'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient()
  const pathname = usePathname()

  useEffect(() => {
    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const publicRoutes = ['/login', '/signup', '/auth', '/']
      const isPublicRoute = publicRoutes.some(
        (route) => pathname.startsWith(route) || pathname === route
      )
      if (isPublicRoute) {
        return
      }
      if (!session) {
        router.push('/login')
        router.refresh()
      }
      // Handle sign out
      if (event === 'SIGNED_OUT') {
        router.push('/login')
        router.refresh()
      }

      // Handle sign in
      if (event === 'SIGNED_IN' && session) {
        router.refresh()
      }

      // Handle token refreshed
      if (event === 'TOKEN_REFRESHED') {
        router.refresh()
      }

      // Handle user updated
      if (event === 'USER_UPDATED') {
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase, pathname])

  return <>{children}</>
}
