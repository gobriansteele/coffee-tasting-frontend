'use client'

import { useProfile, useFlavorProfile } from '@/lib/queries/user'
import { FlavorProfileList } from '@/components/FlavorProfileList'

export default function ProfilePage() {
  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useProfile()
  const { data: flavorProfile, isLoading: isLoadingFlavor, error: flavorError } = useFlavorProfile()

  if (isLoadingProfile || isLoadingFlavor) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-ink-muted">Loading profile...</div>
      </div>
    )
  }

  if (profileError || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-danger">
          Error: {profileError?.message || 'Failed to load profile'}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl font-bold text-ink mb-8">
        My Profile
      </h1>

      {/* User Info */}
      <div className="bg-card shadow-sm rounded-lg p-6 mb-8">
        <h2 className="font-display text-xl font-semibold text-ink mb-4">
          Account Information
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-ink-muted">Email</span>
            <span className="text-ink">{profile.email}</span>
          </div>
          {profile.display_name && (
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-ink-muted">Display Name</span>
              <span className="text-ink">{profile.display_name}</span>
            </div>
          )}
          {(profile.first_name || profile.last_name) && (
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-ink-muted">Name</span>
              <span className="text-ink">
                {[profile.first_name, profile.last_name].filter(Boolean).join(' ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Flavor Profile */}
      <div className="bg-card shadow-sm rounded-lg p-6">
        <h2 className="font-display text-xl font-semibold text-ink mb-4">
          My Flavor Profile
        </h2>
        {flavorError ? (
          <div className="text-center text-danger py-4">
            Failed to load flavor profile
          </div>
        ) : flavorProfile ? (
          <FlavorProfileList flavorProfile={flavorProfile} />
        ) : (
          <div className="text-center text-ink-muted py-4">
            No flavor profile data available
          </div>
        )}
      </div>
    </div>
  )
}
