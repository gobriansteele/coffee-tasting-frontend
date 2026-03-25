'use client'

import { useState, useRef } from 'react'
import type { CoffeeIdentificationResponse } from '@/lib/api/types'

type CoffeePhotoUploadProps = {
  onIdentified: (result: CoffeeIdentificationResponse) => void
  onSkip: () => void
}

export function CoffeePhotoUpload({ onIdentified, onSkip }: CoffeePhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)

    setIsAnalyzing(true)
    // TODO: wire up actual identification API call
    // For now this is a placeholder — the real implementation will POST the image
    // and call onIdentified with the response
  }

  return (
    <div className="space-y-4">
      {!preview ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary hover:bg-sand/50 transition-colors"
        >
          <div className="text-ink-muted space-y-2">
            <svg
              className="mx-auto h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
              />
            </svg>
            <p className="text-sm font-medium">Take a photo of the bag</p>
            <p className="text-xs">We&apos;ll identify the coffee automatically</p>
          </div>
        </button>
      ) : (
        <div className="relative rounded-lg overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Coffee bag" className="w-full max-h-48 object-cover" />
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span className="ml-2 text-sm text-white">Analyzing...</span>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={onSkip}
        className="w-full text-sm text-ink-muted hover:text-ink transition-colors py-2"
      >
        Skip — enter manually instead
      </button>
    </div>
  )
}
