'use client'

import { useState, useRef, useEffect } from 'react'
import { useCoffeeSearch } from '@/lib/queries/coffees'
import { useDebounced } from '@/hooks/use-debounced'
import type { Coffee } from '@/lib/api/types'
import { formatRoastLevel } from '@/lib/format'

type CoffeeSearchInputProps = {
  onSelect: (coffee: Coffee) => void
  placeholder?: string
}

export function CoffeeSearchInput({
  onSelect,
  placeholder = 'Search for a coffee...',
}: CoffeeSearchInputProps) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounced(query, 300)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data, isFetching } = useCoffeeSearch(debouncedQuery)
  const coffees = data?.items ?? []
  const showDropdown = isOpen && debouncedQuery.trim().length >= 2

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const handleSelect = (coffee: Coffee) => {
    onSelect(coffee)
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-card border border-border text-ink placeholder:text-ink-muted focus:outline-none focus:border-ink transition-colors"
      />

      {showDropdown && (
        <div className="absolute z-10 mt-1 w-full bg-card border border-border shadow-sm max-h-60 overflow-y-auto">
          {isFetching && coffees.length === 0 ? (
            <div className="flex items-center justify-center py-4">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="ml-2 text-sm text-ink-muted">Searching...</span>
            </div>
          ) : coffees.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-ink-muted">
              No coffees found
            </div>
          ) : (
            coffees.map((coffee) => (
              <button
                key={coffee.id}
                type="button"
                onClick={() => handleSelect(coffee)}
                className="w-full px-3 py-2 text-left hover:bg-sand transition-colors border-b border-border last:border-b-0"
              >
                <div className="text-sm text-ink">
                  {coffee.name} — {coffee.roaster.name}
                </div>
                {(coffee.origin_country || coffee.roast_level) && (
                  <div className="text-xs text-ink-muted mt-0.5">
                    {[
                      coffee.origin_country,
                      coffee.roast_level && formatRoastLevel(coffee.roast_level),
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
