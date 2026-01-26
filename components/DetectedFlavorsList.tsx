import type { DetectedFlavor } from '@/lib/api/types'

type DetectedFlavorsListProps = {
  detectedFlavors: DetectedFlavor[]
  compact?: boolean
}

export function DetectedFlavorsList({
  detectedFlavors,
  compact = false,
}: DetectedFlavorsListProps) {
  if (detectedFlavors.length === 0) {
    return null
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1">
        {detectedFlavors.map((df, index) => (
          <span
            key={index}
            className="bg-sand text-ink-muted px-2 py-0.5 rounded text-xs"
            title={`Intensity: ${df.intensity}/10`}
          >
            {df.flavor.name}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {detectedFlavors.map((df, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 bg-sand rounded-lg"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium text-ink">{df.flavor.name}</span>
            {df.flavor.category && (
              <span className="text-xs bg-card text-ink-muted px-2 py-0.5 rounded">
                {df.flavor.category}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${(df.intensity / 10) * 100}%` }}
              />
            </div>
            <span className="text-sm text-ink-muted tabular-nums w-10 text-right">
              {df.intensity}/10
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
