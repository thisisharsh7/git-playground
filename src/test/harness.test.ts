import { describe, expect, it } from 'vitest'
import { cn } from '@/lib/utils'

// Proves the runner, the `@/*` alias, jsdom, and the TZ pin are all wired up.
describe('test harness', () => {
  it('runs and resolves the @/ alias', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('provides a jsdom document', () => {
    expect(typeof document).toBe('object')
    expect(document.createElement('div').tagName).toBe('DIV')
  })

  it('provides localStorage', () => {
    localStorage.setItem('probe', '1')
    expect(localStorage.getItem('probe')).toBe('1')
  })

  it('pins the timezone to UTC', () => {
    expect(new Date('2026-01-01T00:00:00.000Z').getHours()).toBe(0)
  })
})
