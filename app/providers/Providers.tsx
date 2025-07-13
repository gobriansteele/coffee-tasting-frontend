'use client'

import { AuthProvider } from './AuthProvider'
import { QueryProvider } from './QueryProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <QueryProvider>{children}</QueryProvider>
    </AuthProvider>
  )
}