'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { DesktopNavigation } from './DesktopNavigation'
import { MobileNavigation } from './MobileNavigation'

type NavigationProps = {
  user: User | null
  isRecoveryMode?: boolean
}

export default function Navigation({ user, isRecoveryMode = false }: NavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleNavClick = (href?: string) => {
    // If clicking on the same page we're already on, close the menu
    if (href && pathname === href) {
      setIsMobileMenuOpen(false)
    }
    // Otherwise, wait for route change to close the menu
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Close mobile menu when route changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu when viewport crosses 768px threshold
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <nav className="bg-card shadow-sm border-b border-border relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DesktopNavigation user={user} onSignOut={handleSignOut} isRecoveryMode={isRecoveryMode} />
        <MobileNavigation
          user={user}
          isOpen={isMobileMenuOpen}
          onToggle={handleMobileMenuToggle}
          onNavClick={handleNavClick}
          onSignOut={handleSignOut}
          isRecoveryMode={isRecoveryMode}
        />
      </div>
    </nav>
  )
}
