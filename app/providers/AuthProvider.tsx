'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push('/login')
        router.refresh()
      }
      // Handle sign out

      console.log('session', session)
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
  }, [router, supabase])

  return <>{children}</>
}
