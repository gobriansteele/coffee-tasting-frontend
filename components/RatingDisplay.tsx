type RatingDisplayProps = {
  score: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

const textClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

export function RatingDisplay({
  score,
  max = 5,
  size = 'md',
  showLabel = true,
}: RatingDisplayProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((rating) => (
        <svg
          key={rating}
          className={`${sizeClasses[size]} ${
            rating <= score ? 'text-warning' : 'text-border'
          }`}
          fill={rating <= score ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={rating <= score ? 0 : 1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      ))}
      {showLabel && (
        <span className={`ml-1 font-medium text-ink tabular-nums ${textClasses[size]}`}>
          {score}/{max}
        </span>
      )}
    </div>
  )
}
