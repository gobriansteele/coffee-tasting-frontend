'use client'

type RatingInputProps = {
  value: number | null
  onChange: (value: number | null) => void
  max?: number
  label?: string
}

export function RatingInput({
  value,
  onChange,
  max = 5,
  label = 'Rating',
}: RatingInputProps) {
  const handleClick = (rating: number) => {
    // Clicking the same rating again clears it
    if (rating === value) {
      onChange(null)
    } else {
      onChange(rating)
    }
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-ink-muted mb-2">
          {label}
        </label>
      )}
      <div className="flex items-center gap-1">
        {Array.from({ length: max }, (_, i) => i + 1).map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => handleClick(rating)}
            className={`p-1 transition-colors ${
              value !== null && rating <= value
                ? 'text-warning'
                : 'text-border hover:text-warning/50'
            }`}
            aria-label={`Rate ${rating} out of ${max}`}
          >
            <svg
              className="w-8 h-8"
              fill={value !== null && rating <= value ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={value !== null && rating <= value ? 0 : 1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        ))}
        <span className="ml-2 text-lg font-medium text-ink tabular-nums">
          {value !== null ? `${value}/${max}` : 'Not rated'}
        </span>
      </div>
    </div>
  )
}
