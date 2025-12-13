import React from 'react'

type FlavorTagProps = {
  flavor: string
  onRemove: () => void
}

export default function FlavorTag({ flavor, onRemove }: FlavorTagProps) {
  return (
    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-copper-soft text-copper text-sm">
      <span>{flavor}</span>
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 hover:bg-copper/10 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${flavor} tag`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
