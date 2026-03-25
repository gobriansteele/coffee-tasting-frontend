'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRoasters } from '@/lib/queries/roasters'
import type { Roaster } from '@/lib/api/types'

type RoasterSelection =
  | { existing_id: string; name: string; location?: string }
  | { existing_id?: undefined; name: string; location?: string }

type RoasterAutocompleteProps = {
  value: RoasterSelection | null
  onChange: (value: RoasterSelection | null) => void
}

function useDebounced(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

export function RoasterAutocomplete({ value, onChange }: RoasterAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value?.name ?? '')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedQuery = useDebounced(inputValue, 300)
  const shouldSearch = debouncedQuery.length >= 2

  const { data: roastersData, isLoading } = useRoasters(
    shouldSearch ? { search: debouncedQuery, limit: 10 } : undefined
  )

  const roasters = shouldSearch ? (roastersData?.items ?? []) : []

  const exactMatch = roasters.some(
    (r) => r.name.toLowerCase() === inputValue.trim().toLowerCase()
  )

  const syncInputFromValue = useCallback(() => {
    setInputValue(value?.name ?? '')
  }, [value?.name])

  useEffect(() => {
    syncInputFromValue()
  }, [syncInputFromValue])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    setIsOpen(true)

    if (!val.trim()) {
      onChange(null)
    } else {
      onChange({ name: val.trim() })
    }
  }

  const handleSelect = (roaster: Roaster) => {
    setInputValue(roaster.name)
    onChange({
      existing_id: roaster.id,
      name: roaster.name,
      location: roaster.location,
    })
    setIsOpen(false)
  }

  const handleCreateNew = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    onChange({ name: trimmed })
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const showDropdown = isOpen && inputValue.trim().length >= 2

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => inputValue.trim().length >= 2 && setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search roasters..."
        className="w-full px-3 py-2 bg-card border border-border rounded-md text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {value?.existing_id && (
        <div className="mt-1 text-xs text-ink-muted">
          {value.location && <span>{value.location} · </span>}
          <span>Existing roaster</span>
        </div>
      )}

      {showDropdown && (
        <div className="absolute z-10 mt-1 w-full bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {isLoading && (
            <div className="px-3 py-2 text-sm text-ink-muted">Searching...</div>
          )}

          {!isLoading && roasters.length === 0 && (
            <button
              type="button"
              onClick={handleCreateNew}
              className="w-full px-3 py-2 text-left text-sm text-primary hover:bg-sand transition-colors"
            >
              Create: {inputValue.trim()}
            </button>
          )}

          {!isLoading && roasters.length > 0 && (
            <>
              {roasters.map((roaster) => (
                <button
                  key={roaster.id}
                  type="button"
                  onClick={() => handleSelect(roaster)}
                  className="w-full px-3 py-2 text-left hover:bg-sand transition-colors"
                >
                  <div className="text-sm text-ink">{roaster.name}</div>
                  {roaster.location && (
                    <div className="text-xs text-ink-muted">{roaster.location}</div>
                  )}
                </button>
              ))}

              {!exactMatch && (
                <button
                  type="button"
                  onClick={handleCreateNew}
                  className="w-full px-3 py-2 text-left text-sm text-primary hover:bg-sand transition-colors border-t border-border"
                >
                  Create: {inputValue.trim()}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export type { RoasterSelection, RoasterAutocompleteProps }
