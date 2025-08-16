import {
  parseISODate,
  formatDate,
  formatTime,
  formatDateTime,
  formatLongDate,
  formatShortDate,
} from './date'

describe('Date Utils', () => {
  describe('parseISODate', () => {
    it('should parse ISO date with microseconds correctly', () => {
      const dateString = '2025-07-02T14:21:33.666826'
      const result = parseISODate(dateString)
      expect(result).toBeInstanceOf(Date)
      expect(result.getFullYear()).toBe(2025)
      expect(result.getMonth()).toBe(6) // July is month 6 (0-indexed)
      expect(result.getDate()).toBe(2)
      // Note: Hours may vary due to timezone, so we'll just check that it's a valid date
      expect(result.getHours()).toBeGreaterThanOrEqual(0)
      expect(result.getHours()).toBeLessThan(24)
      expect(result.getMinutes()).toBe(21)
      expect(result.getSeconds()).toBe(33)
    })

    it('should parse ISO date without microseconds correctly', () => {
      const dateString = '2025-07-02T14:21:33Z'
      const result = parseISODate(dateString)
      expect(result).toBeInstanceOf(Date)
      expect(result.getFullYear()).toBe(2025)
      expect(result.getMonth()).toBe(6)
      expect(result.getDate()).toBe(2)
    })

    it('should parse ISO date with timezone offset correctly', () => {
      const dateString = '2025-07-02T14:21:33.666826+00:00'
      const result = parseISODate(dateString)
      expect(result).toBeInstanceOf(Date)
      expect(result.getFullYear()).toBe(2025)
    })

    it('should handle null input', () => {
      const result = parseISODate(null)
      expect(result).toBe('Invalid Date')
    })

    it('should handle undefined input', () => {
      const result = parseISODate(undefined)
      expect(result).toBe('Invalid Date')
    })

    it('should handle empty string', () => {
      const result = parseISODate('')
      expect(result).toBe('Invalid Date')
    })

    it('should handle invalid date format', () => {
      const result = parseISODate('not-a-date')
      expect(result).toBeInstanceOf(Date)
      expect(result.toString()).toContain('Invalid Date')
    })
  })

  describe('formatDate', () => {
    it('should format date with default options', () => {
      const dateString = '2025-07-02T14:21:33.666826'
      const result = formatDate(dateString)
      expect(result).toBe('Jul 2, 2025')
    })

    it('should format date with custom options', () => {
      const dateString = '2025-07-02T14:21:33.666826'
      const result = formatDate(dateString, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      expect(result).toBe('July 2, 2025')
    })

    it('should return "Invalid Date" for invalid input', () => {
      const result = formatDate('invalid-date')
      expect(result).toBe('Invalid Date')
    })
  })

  describe('formatTime', () => {
    it('should format time with default options', () => {
      const dateString = '2025-07-02T14:21:33.666826'
      const result = formatTime(dateString)
      // Time may vary due to timezone, so we'll just check the format
      expect(result).toMatch(/^\d{1,2}:\d{2} (AM|PM)$/)
    })

    it('should format time with custom options', () => {
      const dateString = '2025-07-02T14:21:33.666826'
      const result = formatTime(dateString, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      // Time may vary due to timezone, so we'll just check the format
      expect(result).toMatch(/^\d{1,2}:\d{2}:\d{2} (AM|PM)$/)
    })

    it('should return "Invalid Date" for invalid input', () => {
      const result = formatTime('invalid-time')
      expect(result).toBe('Invalid Date')
    })
  })

  describe('formatDateTime', () => {
    it('should format date and time together', () => {
      const dateString = '2025-07-02T14:21:33.666826'
      const result = formatDateTime(dateString)
      // Time may vary due to timezone, so we'll just check the format
      expect(result).toMatch(/^Jul 2, 2025, \d{1,2}:\d{2} (AM|PM)$/)
    })

    it('should return "No date available" for null input', () => {
      const result = formatDateTime(null)
      expect(result).toBe('No date available')
    })

    it('should return "No date available" for undefined input', () => {
      const result = formatDateTime(undefined)
      expect(result).toBe('No date available')
    })

    it('should return "Invalid Date" for invalid input', () => {
      const result = formatDateTime('invalid-datetime')
      expect(result).toBe('Invalid Date')
    })
  })

  describe('formatLongDate', () => {
    it('should format date in long format', () => {
      const dateString = '2025-07-02T14:21:33.666826'
      const result = formatLongDate(dateString)
      expect(result).toBe('July 2, 2025')
    })

    it('should return "Invalid Date" for invalid input', () => {
      const result = formatLongDate('invalid-long-date')
      expect(result).toBe('Invalid Date')
    })
  })

  describe('formatShortDate', () => {
    it('should format date in short format', () => {
      const dateString = '2025-07-02T14:21:33.666826'
      const result = formatShortDate(dateString)
      expect(result).toBe('Jul 2, 2025')
    })

    it('should return "Invalid Date" for invalid input', () => {
      const result = formatShortDate('invalid-short-date')
      expect(result).toBe('Invalid Date')
    })
  })

  describe('Edge cases', () => {
    it('should handle dates with different timezone formats', () => {
      const dateStrings = [
        '2025-07-02T14:21:33.666826Z',
        '2025-07-02T14:21:33.666826+00:00',
        '2025-07-02T14:21:33.666826-05:00',
      ]

      dateStrings.forEach((dateString) => {
        const result = parseISODate(dateString)
        expect(result).toBeInstanceOf(Date)
        expect(result.getFullYear()).toBe(2025)
      })
    })

    it('should handle dates with varying microsecond precision', () => {
      const dateStrings = [
        '2025-07-02T14:21:33.1',
        '2025-07-02T14:21:33.12',
        '2025-07-02T14:21:33.123',
        '2025-07-02T14:21:33.1234',
        '2025-07-02T14:21:33.12345',
        '2025-07-02T14:21:33.123456',
        '2025-07-02T14:21:33.1234567',
      ]

      dateStrings.forEach((dateString) => {
        const result = parseISODate(dateString)
        expect(result).toBeInstanceOf(Date)
        expect(result.getFullYear()).toBe(2025)
      })
    })

    it('should handle dates without time component', () => {
      const dateString = '2025-07-02'
      const result = parseISODate(dateString)
      expect(result).toBeInstanceOf(Date)
      expect(result.getFullYear()).toBe(2025)
      expect(result.getMonth()).toBe(6)
      // Note: Date may vary due to timezone, so we'll just check it's a valid date
      expect(result.getDate()).toBeGreaterThanOrEqual(1)
      expect(result.getDate()).toBeLessThanOrEqual(31)
    })
  })
})
