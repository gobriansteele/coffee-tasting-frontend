/**
 * Safely parses an ISO date string that may contain microseconds
 * and returns a Date object
 */
export function parseISODate(dateString?: string | null): Date | string {
  if (!dateString) return 'Invalid Date'

  try {
    // Handle ISO format with microseconds by truncating to milliseconds
    let cleanDateString = dateString
    if (dateString.includes('.')) {
      cleanDateString = dateString.split('.')[0] + 'Z'
    } else if (!dateString.endsWith('Z') && !dateString.includes('+')) {
      // If no timezone info, add Z
      cleanDateString = dateString + 'Z'
    }
    return new Date(cleanDateString)
  } catch (error) {
    console.error('Error parsing date:', dateString, error)
    return 'Invalid Date'
  }
}

/**
 * Formats a date string to a readable date format
 */
export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const date = parseISODate(dateString)
    if (typeof date === 'string') return 'Invalid date'
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    })
  } catch (error) {
    console.error('Error formatting date:', dateString, error)
    return 'No date available'
  }
}

/**
 * Formats a date string to a readable time format
 */
export function formatTime(
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const date = parseISODate(dateString)
    if (typeof date === 'string') return 'Invalid time'
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      ...options,
    })
  } catch (error) {
    console.error('Error formatting time:', dateString, error)
    return 'Invalid time'
  }
}

/**
 * Formats a date string to show both date and time
 */
export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return 'No date available'

  try {
    const date = parseISODate(dateString)
    if (typeof date === 'string') return 'Invalid date'
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (error) {
    console.error('Error formatting date time:', dateString, error)
    return 'No date available'
  }
}

/**
 * Formats a date string to a long date format (e.g., "January 15, 2024")
 */
export function formatLongDate(dateString: string): string {
  return formatDate(dateString, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Formats a date string to a short date format (e.g., "Jan 15, 2024")
 */
export function formatShortDate(dateString: string): string {
  return formatDate(dateString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
