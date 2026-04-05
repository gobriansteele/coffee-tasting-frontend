'use client'

import { useState } from 'react'
import { CoffeePhotoUpload } from '@/components/CoffeePhotoUpload'
import { CoffeeSearchInput } from '@/components/CoffeeSearchInput'
import { RoasterAutocomplete } from '@/components/RoasterAutocomplete'
import type {
  ProcessingMethod,
  RoastLevel,
  Coffee,
  CoffeeInput,
  CoffeeEntryResult,
  CoffeeIdentificationResponse,
  RoasterInput,
} from '@/lib/api/types'
import { formatRoastLevel } from '@/lib/format'

type CoffeeEntryProps = {
  onChange: (result: CoffeeEntryResult | null) => void
  onIdentified?: (response: CoffeeIdentificationResponse) => void
}

type EntryMode = 'scan' | 'search' | 'manual'

type CoffeeFields = {
  name: string
  roaster: RoasterInput | null
  origin_country: string
  origin_region: string
  processing_method: ProcessingMethod | ''
  roast_level: RoastLevel | ''
  variety: string
}

const EMPTY_FIELDS: CoffeeFields = {
  name: '',
  roaster: null,
  origin_country: '',
  origin_region: '',
  processing_method: '',
  roast_level: '',
  variety: '',
}

const MODES: { key: EntryMode; label: string }[] = [
  { key: 'scan', label: 'Scan Bag' },
  { key: 'search', label: 'Search' },
  { key: 'manual', label: 'Enter Manually' },
]

function fieldsToInput(f: CoffeeFields): CoffeeInput {
  return {
    name: f.name,
    roaster: {
      existing_id: f.roaster?.existing_id,
      name: f.roaster?.name ?? '',
      location: f.roaster?.location,
    },
    origin_country: f.origin_country || undefined,
    origin_region: f.origin_region || undefined,
    processing_method: f.processing_method || undefined,
    variety: f.variety || undefined,
    roast_level: f.roast_level || undefined,
  }
}



export function CoffeeEntrySection({ onChange, onIdentified }: CoffeeEntryProps) {
  const [mode, setMode] = useState<EntryMode>('scan')
  const [fields, setFields] = useState<CoffeeFields>(EMPTY_FIELDS)
  const [aiFilledFields, setAiFilledFields] = useState<Set<keyof CoffeeFields>>(new Set())
  const [scanCompleted, setScanCompleted] = useState(false)
  const [selectedCoffee, setSelectedCoffee] = useState<Coffee | null>(null)

  const showEditableFields = mode === 'manual' || (mode === 'scan' && scanCompleted)

  const handleModeChange = (newMode: EntryMode) => {
    if (newMode === mode) return
    setMode(newMode)
    setFields(EMPTY_FIELDS)
    setAiFilledFields(new Set())
    setScanCompleted(false)
    setSelectedCoffee(null)
    onChange(null)
  }

  const handleScanIdentified = (result: CoffeeIdentificationResponse) => {
    const newFields: CoffeeFields = {
      name: result.coffee_name ?? '',
      roaster: result.roaster
        ? { name: result.roaster.name, location: result.roaster.location ?? undefined }
        : null,
      origin_country: result.origin_country ?? '',
      origin_region: result.origin_region ?? '',
      processing_method: result.processing_method ?? '',
      roast_level: result.roast_level ?? '',
      variety: result.variety ?? '',
    }

    const filled = new Set<keyof CoffeeFields>()
    if (newFields.name) filled.add('name')
    if (newFields.roaster) filled.add('roaster')
    if (newFields.origin_country) filled.add('origin_country')
    if (newFields.origin_region) filled.add('origin_region')
    if (newFields.processing_method) filled.add('processing_method')
    if (newFields.roast_level) filled.add('roast_level')
    if (newFields.variety) filled.add('variety')

    setFields(newFields)
    setAiFilledFields(filled)
    setScanCompleted(true)
    onIdentified?.(result)

    if (newFields.name.trim()) {
      onChange({ mode: 'new', input: fieldsToInput(newFields) })
    }
  }

  const handleSearchSelect = (coffee: Coffee) => {
    setSelectedCoffee(coffee)
    onChange({ mode: 'existing', coffee })
  }

  const handleSearchReset = () => {
    setSelectedCoffee(null)
    onChange(null)
  }

  const updateField = <K extends keyof CoffeeFields>(key: K, value: CoffeeFields[K]) => {
    const updated = { ...fields, [key]: value }
    setFields(updated)
    setAiFilledFields((prev) => {
      if (!prev.has(key)) return prev
      const next = new Set(prev)
      next.delete(key)
      return next
    })
    const input = fieldsToInput(updated)
    if (input.name.trim()) {
      onChange({ mode: 'new', input })
    } else {
      onChange(null)
    }
  }

  const aiAccent = (field: keyof CoffeeFields) =>
    `pl-3 border-l-2 ${aiFilledFields.has(field) ? 'border-l-primary' : 'border-l-transparent'}`

  const inputClass =
    'w-full px-3 py-2 bg-card border border-border focus:outline-none focus:border-ink text-ink transition-colors'
  const labelClass = 'block text-sm font-medium text-ink-muted mb-2'

  return (
    <div className="bg-card border border-border p-6 space-y-6">
      <h2 className="font-display text-xl font-semibold text-ink">
        What are you tasting?
      </h2>

      <div className="flex border border-border overflow-hidden">
        {MODES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleModeChange(key)}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              mode === key
                ? 'bg-primary text-white'
                : 'bg-card text-ink-muted hover:text-ink hover:bg-sand'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'scan' && !scanCompleted && (
        <CoffeePhotoUpload
          onIdentified={handleScanIdentified}
          onSkip={() => handleModeChange('manual')}
        />
      )}

      {mode === 'search' && !selectedCoffee && (
        <CoffeeSearchInput onSelect={handleSearchSelect} />
      )}

      {mode === 'search' && selectedCoffee && (
        <div className="border border-border p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-ink font-medium">{selectedCoffee.name}</p>
              <p className="text-sm text-ink-muted">{selectedCoffee.roaster.name}</p>
            </div>
            <button
              type="button"
              onClick={handleSearchReset}
              className="text-sm text-primary hover:text-primary-hover"
            >
              Change
            </button>
          </div>
          {(selectedCoffee.origin_country || selectedCoffee.roast_level || selectedCoffee.processing_method) && (
            <div className="text-xs text-ink-muted">
              {[
                selectedCoffee.origin_country,
                selectedCoffee.roast_level && formatRoastLevel(selectedCoffee.roast_level),
                selectedCoffee.processing_method,
              ]
                .filter(Boolean)
                .join(' · ')}
            </div>
          )}
        </div>
      )}

      {showEditableFields && (
        <div className="space-y-4">
          <div className={aiAccent('name')}>
            <label htmlFor="coffee-name" className={labelClass}>
              Coffee Name *
            </label>
            <input
              id="coffee-name"
              type="text"
              value={fields.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
              placeholder="e.g. Ethiopia Yirgacheffe"
              className={inputClass}
            />
          </div>

          <div className={aiAccent('roaster')}>
            <label className={labelClass}>Roaster Name</label>
            <RoasterAutocomplete
              key={`${mode}-${scanCompleted}`}
              value={fields.roaster}
              onChange={(val) => updateField('roaster', val)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className={aiAccent('origin_country')}>
              <label htmlFor="origin-country" className={labelClass}>
                Origin Country
              </label>
              <input
                id="origin-country"
                type="text"
                value={fields.origin_country}
                onChange={(e) => updateField('origin_country', e.target.value)}
                placeholder="e.g. Ethiopia"
                className={inputClass}
              />
            </div>

            <div className={aiAccent('origin_region')}>
              <label htmlFor="origin-region" className={labelClass}>
                Origin Region
              </label>
              <input
                id="origin-region"
                type="text"
                value={fields.origin_region}
                onChange={(e) => updateField('origin_region', e.target.value)}
                placeholder="e.g. Yirgacheffe"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className={aiAccent('processing_method')}>
              <label htmlFor="processing-method" className={labelClass}>
                Processing Method
              </label>
              <select
                id="processing-method"
                value={fields.processing_method}
                onChange={(e) =>
                  updateField('processing_method', e.target.value as ProcessingMethod | '')
                }
                className={inputClass}
              >
                <option value="">Select processing method</option>
                <option value="washed">Washed</option>
                <option value="natural">Natural</option>
                <option value="honey">Honey</option>
                <option value="anaerobic">Anaerobic</option>
              </select>
            </div>

            <div className={aiAccent('roast_level')}>
              <label htmlFor="roast-level" className={labelClass}>
                Roast Level
              </label>
              <select
                id="roast-level"
                value={fields.roast_level}
                onChange={(e) =>
                  updateField('roast_level', e.target.value as RoastLevel | '')
                }
                className={inputClass}
              >
                <option value="">Select roast level</option>
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="medium_dark">Medium Dark</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>

          <div className={aiAccent('variety')}>
            <label htmlFor="variety" className={labelClass}>
              Variety
            </label>
            <input
              id="variety"
              type="text"
              value={fields.variety}
              onChange={(e) => updateField('variety', e.target.value)}
              placeholder="e.g. Bourbon, Gesha"
              className={inputClass}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export type { CoffeeEntryProps }
