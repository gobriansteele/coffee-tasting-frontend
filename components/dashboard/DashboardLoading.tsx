export function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="h-9 w-48 bg-sand rounded animate-pulse" />
          <div className="h-5 w-32 bg-sand rounded animate-pulse mt-2" />
        </div>
        <div className="flex space-x-3">
          <div className="h-10 w-28 bg-sand rounded-md animate-pulse" />
          <div className="h-10 w-32 bg-sand rounded-md animate-pulse" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <div className="h-4 w-24 bg-sand rounded animate-pulse mb-3" />
          <div className="h-10 w-20 bg-sand rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-sand rounded animate-pulse" />
        </div>
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <div className="h-4 w-24 bg-sand rounded animate-pulse mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <div className="h-4 w-20 bg-sand rounded animate-pulse" />
                  <div className="h-4 w-6 bg-sand rounded animate-pulse" />
                </div>
                <div className="h-2 bg-sand rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent tastings header skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-6 w-36 bg-sand rounded animate-pulse" />
        <div className="h-4 w-20 bg-sand rounded animate-pulse" />
      </div>

      {/* Cards skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-lg p-6 shadow-sm">
            <div className="h-5 w-32 bg-sand rounded animate-pulse mb-2" />
            <div className="h-4 w-24 bg-sand rounded animate-pulse mb-4" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-16 bg-sand rounded animate-pulse" />
                <div className="h-4 w-20 bg-sand rounded animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-12 bg-sand rounded animate-pulse" />
                <div className="h-4 w-10 bg-sand rounded animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-10 bg-sand rounded animate-pulse" />
                <div className="h-4 w-24 bg-sand rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
