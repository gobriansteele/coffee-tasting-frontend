'use client'

import { useState, useEffect } from 'react'
import { useProfile, useFlavorProfile, useUpdateProfile } from '@/lib/queries/user'
import { FlavorProfileList } from '@/components/FlavorProfileList'

export default function ProfilePage() {
  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useProfile()
  const { data: flavorProfile, isLoading: isLoadingFlavor, error: flavorError } = useFlavorProfile()
  const updateProfile = useUpdateProfile()

  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [displayName, setDisplayName] = useState('')

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name ?? '')
      setLastName(profile.last_name ?? '')
      setDisplayName(profile.display_name ?? '')
    }
  }, [profile])

  const handleSave = () => {
    updateProfile.mutate(
      {
        first_name: firstName || undefined,
        last_name: lastName || undefined,
        display_name: displayName || undefined,
      },
      {
        onSuccess: () => {
          setIsEditing(false)
        },
      }
    )
  }

  const handleCancel = () => {
    setFirstName(profile?.first_name ?? '')
    setLastName(profile?.last_name ?? '')
    setDisplayName(profile?.display_name ?? '')
    setIsEditing(false)
  }

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
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-xl font-semibold text-ink">
            Account Information
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Edit
            </button>
          )}
        </div>

        {updateProfile.error && (
          <div className="mb-4 p-3 bg-danger/10 text-danger text-sm rounded-md">
            Failed to update profile. Please try again.
          </div>
        )}

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-ink-muted">Email</span>
            <span className="text-ink">{profile.email}</span>
          </div>

          {isEditing ? (
            <>
              <div className="py-2 border-b border-border">
                <label className="block text-ink-muted text-sm mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-ink focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter first name"
                />
              </div>
              <div className="py-2 border-b border-border">
                <label className="block text-ink-muted text-sm mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-ink focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter last name"
                />
              </div>
              <div className="py-2 border-b border-border">
                <label className="block text-ink-muted text-sm mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-ink focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter display name"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={handleCancel}
                  disabled={updateProfile.isPending}
                  className="px-4 py-2 text-sm font-medium text-ink-muted hover:text-ink border border-border rounded-md disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={updateProfile.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md disabled:opacity-50"
                >
                  {updateProfile.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-ink-muted">First Name</span>
                <span className="text-ink">{profile.first_name || <span className="text-ink-muted italic">Not set</span>}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-ink-muted">Last Name</span>
                <span className="text-ink">{profile.last_name || <span className="text-ink-muted italic">Not set</span>}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-ink-muted">Display Name</span>
                <span className="text-ink">{profile.display_name || <span className="text-ink-muted italic">Not set</span>}</span>
              </div>
            </>
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
