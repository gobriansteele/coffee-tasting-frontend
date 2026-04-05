'use client'

import { useState, useRef, useCallback } from 'react'
import { useIdentifyCoffee } from '@/lib/queries/identification'
import type { CoffeeIdentificationResponse } from '@/lib/api/types'

type CoffeePhotoUploadProps = {
  onIdentified: (result: CoffeeIdentificationResponse) => void
  onSkip: () => void
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_IMAGES = 4

export function CoffeePhotoUpload({ onIdentified, onSkip }: CoffeePhotoUploadProps) {
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const identifyMutation = useIdentifyCoffee()

  const validateAndAddFiles = useCallback((files: FileList | File[]) => {
    setValidationError(null)
    const fileArray = Array.from(files)

    for (const file of fileArray) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setValidationError(`"${file.name}" is not a supported image type. Use JPEG, PNG, or WebP.`)
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        setValidationError(`"${file.name}" exceeds the 10MB size limit.`)
        return
      }
    }

    setImages((prev) => {
      const combined = [...prev, ...fileArray]
      if (combined.length > MAX_IMAGES) {
        setValidationError(`You can upload up to ${MAX_IMAGES} images.`)
        return prev
      }
      return combined
    })

    setPreviews((prev) => {
      if (prev.length + fileArray.length > MAX_IMAGES) return prev
      return [...prev, ...fileArray.map((file) => URL.createObjectURL(file))]
    })
  }, [])

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index])
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
    setValidationError(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files)
    }
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  const handleIdentify = () => {
    identifyMutation.mutate(images, {
      onSuccess: (result) => {
        onIdentified(result)
      },
    })
  }

  const handleRetry = () => {
    identifyMutation.reset()
  }

  return (
    <div className="bg-card border border-border p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">
            Scan Coffee Bag
          </h2>
          <p className="text-sm text-ink-muted mt-1">
            Upload a photo of your coffee bag to auto-fill details, or skip to enter manually.
          </p>
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="text-sm text-primary hover:text-primary-hover"
        >
          Skip
        </button>
      </div>

      {/* Validation / API error */}
      {(validationError || identifyMutation.error) && (
        <div className="bg-danger-soft text-danger p-4 text-sm">
          {validationError || identifyMutation.error?.message || 'Failed to identify coffee.'}
          {identifyMutation.error && (
            <button
              type="button"
              onClick={handleRetry}
              className="ml-2 underline hover:no-underline"
            >
              Try again
            </button>
          )}
        </div>
      )}

      {/* Drop zone / file input */}
      {images.length < MAX_IMAGES && !identifyMutation.isPending && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
            isDragOver
              ? 'border-ink bg-sand'
              : 'border-border hover:border-ink'
          }`}
        >
          <div className="text-ink-muted">
            <svg
              className="mx-auto h-10 w-10 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
              />
            </svg>
            <p className="text-sm font-medium text-ink">
              Drop photos here or tap to upload
            </p>
            <p className="text-xs mt-1">
              JPEG, PNG, or WebP &middot; Up to {MAX_IMAGES} images &middot; 10MB each
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {previews.map((src, index) => (
            <div key={src} className="relative group">
              <img
                src={src}
                alt={`Coffee bag photo ${index + 1}`}
                className="h-24 w-24 object-cover border border-border"
              />
              {!identifyMutation.isPending && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-card border border-border w-6 h-6 flex items-center justify-center text-xs text-ink-muted hover:text-danger transition-colors"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {images.length > 0 && (
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-2 border border-border text-ink text-sm hover:bg-sand transition-colors"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={handleIdentify}
            disabled={identifyMutation.isPending}
            className="px-4 py-2 bg-primary text-white text-sm hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {identifyMutation.isPending ? 'Identifying...' : 'Identify Coffee'}
          </button>
        </div>
      )}

      {/* Loading state */}
      {identifyMutation.isPending && (
        <div className="text-center py-4">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-ink-muted mt-2">
            Analyzing your coffee bag...
          </p>
        </div>
      )}
    </div>
  )
}
