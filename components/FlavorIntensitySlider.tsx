'use client'

import type { Flavor } from '@/lib/api/types'

type FlavorIntensitySliderProps = {
  flavor: Flavor
  intensity: number
  onChange: (intensity: number) => void
  onRemove: () => void
}

export function FlavorIntensitySlider({
  flavor,
  intensity,
  onChange,
  onRemove,
}: FlavorIntensitySliderProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-sand rounded-lg">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-ink truncate">{flavor.name}</span>
          <button
            type="button"
            onClick={onRemove}
            className="text-ink-muted hover:text-danger transition-colors p-1"
            aria-label={`Remove ${flavor.name}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <span className="text-sm font-medium text-ink tabular-nums w-8 text-right">
            {intensity}/10
          </span>
        </div>
      </div>
    </div>
  )
}
