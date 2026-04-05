import React from 'react'

type FlavorTagProps = {
  flavor: string
  onRemove: () => void
}

export default function FlavorTag({ flavor, onRemove }: FlavorTagProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-border text-ink text-sm">
      <span>{flavor}</span>
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 hover:text-danger p-0.5 transition-colors"
        aria-label={`Remove ${flavor} tag`}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
