'use client'

import { useIsAdmin } from '@/hooks/use-is-admin'
import { useAdminGraphSync } from '@/lib/queries/admin'

export function AdminGraphSyncButton() {
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin()
  console.log('isAdmin', isAdmin)
  const {
    mutate: syncGraph,
    isPending,
    isSuccess,
    isError,
  } = useAdminGraphSync()

  // Don't render anything if not admin or still checking
  if (isAdminLoading || !isAdmin) {
    return null
  }

  const handleSync = () => {
    syncGraph()
  }

  const getStatusColor = () => {
    if (isPending) return 'text-yellow-500'
    if (isSuccess) return 'text-green-500'
    if (isError) return 'text-danger'
    return 'text-ink-muted hover:text-ink'
  }

  const getTitle = () => {
    if (isPending) return 'Syncing graph database...'
    if (isSuccess) return 'Graph sync started'
    if (isError) return 'Graph sync failed'
    return 'Sync graph database'
  }

  return (
    <button
      onClick={handleSync}
      disabled={isPending}
      className={`p-2 rounded-md hover:bg-sand transition-colors disabled:cursor-not-allowed ${getStatusColor()}`}
      aria-label={getTitle()}
      title={getTitle()}
    >
      {isPending ? (
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      )}
    </button>
  )
}
