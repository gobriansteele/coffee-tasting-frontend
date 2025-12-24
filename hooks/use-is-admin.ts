'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type JwtPayload = {
  user_role?: string
  [key: string]: unknown
}

const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const base64Payload = token.split('.')[1]
    const payload = atob(base64Payload)
    return JSON.parse(payload)
  } catch {
    return null
  }
}

export const useIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.access_token) {
        const payload = decodeJwtPayload(session.access_token)
        setIsAdmin(payload?.user_role === 'admin')
      } else {
        setIsAdmin(false)
      }
      setIsLoading(false)
    }

    checkAdminStatus()

    // Subscribe to auth changes
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) {
        const payload = decodeJwtPayload(session.access_token)
        setIsAdmin(payload?.user_role === 'admin')
      } else {
        setIsAdmin(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { isAdmin, isLoading }
}
