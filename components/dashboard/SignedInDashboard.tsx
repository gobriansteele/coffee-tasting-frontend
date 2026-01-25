'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { queryKeys } from '@/lib/query-keys'
import { DashboardLoading } from './DashboardLoading'
import { DashboardContent } from './DashboardContent'

type SignedInDashboardProps = {
  userEmail: string
}

export function SignedInDashboard({ userEmail }: SignedInDashboardProps) {
  // Fetch all tastings for accurate stats - recent section will limit display
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.tastings.all(),
    queryFn: () => apiClient.getTastings({ limit: 100 }),
  })

  if (isLoading) {
    return <DashboardLoading />
  }

  if (error) {
    // Show dashboard with empty state on error (graceful degradation)
    return (
      <DashboardContent userEmail={userEmail} tastings={[]} totalTastings={0} />
    )
  }

  return (
    <DashboardContent
      userEmail={userEmail}
      tastings={data?.items ?? []}
      totalTastings={data?.total ?? 0}
    />
  )
}
